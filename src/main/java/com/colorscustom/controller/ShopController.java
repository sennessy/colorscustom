package com.colorscustom.controller;

import com.colorscustom.model.CartItem;
import com.colorscustom.service.CartService;
import com.colorscustom.service.ProductService;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Controller
public class ShopController {

    private static final Logger log = LoggerFactory.getLogger(ShopController.class);

    private final ProductService productService;
    private final CartService cartService;

    // Clé Stripe: OK en fallback vide pour éviter crash au démarrage si pas configuré
    @Value("${stripe.secretKey:}")
    private String stripeSecretKey;

    // Base URL: prévoir fallback sinon ça casse en local si pas set
    @Value("${app.baseUrl:http://localhost:8080}")
    private String baseUrl;

    @Value("${app.checkout.simulation-enabled:true}")
    private boolean checkoutSimulationEnabled;

    @Value("${app.bank-transfer.enabled:false}")
    private boolean bankTransferEnabled;

    @Value("${app.bank-transfer.recipient:}")
    private String bankTransferRecipient;

    @Value("${app.bank-transfer.iban:}")
    private String bankTransferIban;

    private static final String CURRENCY = "chf";
    private static final String SHIPPING_HERO = "Livraison gratuite partout en Suisse";
    private static final List<String> PREFERRED_PAYMENT_METHOD_TYPES = List.of("card", "twint");
    private static final List<String> PAYMENT_METHOD_LABELS = List.of(
            "TWINT",
            "Carte de crédit / débit (Visa, Mastercard)",
            "Apple Pay",
            "Google Pay"
    );
    private static final String PAYMENT_METHODS_HINT =
            "Apple Pay et Google Pay apparaissent via le mode carte selon Stripe, votre appareil et navigateur.";

    public ShopController(ProductService productService, CartService cartService) {
        this.productService = productService;
        this.cartService = cartService;
    }

    /* ===========================
       BOUTIQUE
       =========================== */

    @GetMapping("/boutique")
    public String boutique(HttpSession session, Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("shippingHero", SHIPPING_HERO);
        return "boutique";
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("productId") Long productId,
                            @RequestParam(value = "qty", defaultValue = "1") int qty,
                            HttpSession session,
                            RedirectAttributes redirectAttributes) {
        var p = productService.findById(productId); // Product ou null
        int safeQty = Math.max(qty, 1);
        if (p != null) {
            cartService.add(session, p, safeQty);
            redirectAttributes.addFlashAttribute("cartToastMessage",
                    safeQty + " × " + p.getName() + " ajouté au panier");
            redirectAttributes.addFlashAttribute("cartToastType", "success");
        } else {
            redirectAttributes.addFlashAttribute("cartToastMessage",
                    "Impossible d'ajouter ce produit au panier.");
            redirectAttributes.addFlashAttribute("cartToastType", "error");
        }
        return "redirect:/boutique";
    }

    /* ===========================
       PANIER
       =========================== */

    @GetMapping("/panier")
    public String panier(HttpSession session, Model model) {
        Map<Long, CartItem> cart = cartService.getCart(session);
        BigDecimal subtotal = cartService.subtotal(session);
        boolean stripeCheckoutAvailable = isStripeSecretKeyConfigured();

        model.addAttribute("shippingHero", SHIPPING_HERO);
        model.addAttribute("paymentMethods", PAYMENT_METHOD_LABELS);
        model.addAttribute("paymentMethodsHint", PAYMENT_METHODS_HINT);
        model.addAttribute("stripeCheckoutAvailable", stripeCheckoutAvailable);
        model.addAttribute("bankTransferEnabled", bankTransferEnabled);
        model.addAttribute("bankTransferRecipient", bankTransferRecipient);
        model.addAttribute("bankTransferIban", bankTransferIban);
        model.addAttribute("cart", cart);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shipping", BigDecimal.ZERO);
        model.addAttribute("total", subtotal);

        return "panier";
    }

    @PostMapping("/cart/update")
    public String updateCart(@RequestParam("productId") Long productId,
                             @RequestParam("qty") int qty,
                             HttpSession session) {
        cartService.update(session, productId, qty);
        return "redirect:/panier";
    }

    @PostMapping("/cart/remove")
    public String removeCart(@RequestParam("productId") Long productId,
                             HttpSession session) {
        cartService.remove(session, productId);
        return "redirect:/panier";
    }

    /* ===========================
       CHECKOUT STRIPE
       =========================== */

    @PostMapping("/checkout")
    public String checkout(HttpSession session, RedirectAttributes redirectAttributes) throws Exception {
        Map<Long, CartItem> cart = cartService.getCart(session);
        if (cart == null || cart.isEmpty()) {
            redirectAttributes.addFlashAttribute("checkoutError", "Ton panier est vide.");
            return "redirect:/panier";
        }

        if (!isStripeSecretKeyConfigured()) {
            if (checkoutSimulationEnabled) {
                cartService.clear(session);
                redirectAttributes.addFlashAttribute("checkoutNotice",
                        "Paiement simulé: aucun débit réel n'a été effectué.");
                return "redirect:/checkout/success?simulated=true";
            }
            redirectAttributes.addFlashAttribute("checkoutError",
                    "Paiement indisponible: configure STRIPE_SECRET_KEY pour activer Stripe.");
            return "redirect:/panier";
        }

        Stripe.apiKey = stripeSecretKey;

        try {
            // Priorité conversion: laisser Stripe activer automatiquement les moyens disponibles
            // selon pays, appareil et wallet (Apple Pay / Google Pay / TWINT, etc.).
            Session checkoutSession = createCheckoutSession(cart, null);
            return "redirect:" + checkoutSession.getUrl();
        } catch (Exception ex) {
            log.warn("Stripe checkout with automatic payment methods failed: {}", ex.getMessage());
            // Fallback robuste: forcer les moyens principaux si la config auto échoue.
            try {
                Session checkoutSession = createCheckoutSession(cart, PREFERRED_PAYMENT_METHOD_TYPES);
                return "redirect:" + checkoutSession.getUrl();
            } catch (Exception fallbackEx) {
                log.error("Stripe checkout failed after automatic fallback", fallbackEx);
                redirectAttributes.addFlashAttribute("checkoutError", mapStripeError(fallbackEx));
                return "redirect:/panier";
            }
        }
    }

    @GetMapping("/checkout/success")
    public String checkoutSuccess(@RequestParam(name = "simulated", defaultValue = "false") boolean simulated,
                                  Model model) {
        model.addAttribute("simulatedCheckout", simulated);
        // Optionnel: vider le panier après paiement confirmé via webhook
        // ou ici si tu veux un comportement simple:
        // cartService.clear(session);
        return "checkout_success";
    }

    @GetMapping("/checkout/cancel")
    public String checkoutCancel() {
        return "checkout_cancel";
    }

    private String normalizedBaseUrl() {
        if (baseUrl == null || baseUrl.isBlank()) {
            return "http://localhost:8080";
        }
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    private String buildProductName(CartItem item) {
        String name = item.getProduct().getName();
        String subtitle = item.getProduct().getSubtitle();
        if (subtitle == null || subtitle.isBlank()) {
            return name;
        }
        return name + " — " + subtitle;
    }

    private Session createCheckoutSession(Map<Long, CartItem> cart, List<String> paymentMethodTypes) throws Exception {
        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(normalizedBaseUrl() + "/checkout/success")
                .setCancelUrl(normalizedBaseUrl() + "/checkout/cancel");

        if (paymentMethodTypes != null && !paymentMethodTypes.isEmpty()) {
            builder.putExtraParam("payment_method_types", paymentMethodTypes);
        }

        // Items du panier
        for (CartItem item : cart.values()) {
            if (item == null || item.getProduct() == null || item.getProduct().getPrice() == null || item.getQuantity() <= 0) {
                continue;
            }
            BigDecimal price = item.getProduct().getPrice();
            long unitAmountCents = price
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValueExact();

            builder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) item.getQuantity())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency(CURRENCY)
                                            .setUnitAmount(unitAmountCents)
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(buildProductName(item))
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        return Session.create(builder.build());
    }

    private boolean isStripeSecretKeyConfigured() {
        if (stripeSecretKey == null) {
            return false;
        }
        String normalized = stripeSecretKey.trim();
        return !normalized.isBlank() && normalized.startsWith("sk_");
    }

    private String mapStripeError(Exception ex) {
        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            return "Erreur Stripe temporaire. Réessaie dans un instant.";
        }
        String normalizedMessage = message.toLowerCase(Locale.ROOT);
        if (normalizedMessage.contains("invalid api key")
                || normalizedMessage.contains("api key provided")) {
            return "Configuration Stripe invalide: vérifie STRIPE_SECRET_KEY (sk_live_...).";
        }
        if (normalizedMessage.contains("payment_method_types")) {
            return "Configuration des moyens de paiement Stripe invalide. Vérifie le Dashboard Stripe.";
        }
        if (normalizedMessage.contains("twint")) {
            return "TWINT indisponible actuellement. Réessaie ou utilise la carte.";
        }
        return "Erreur Stripe temporaire. Réessaie dans un instant.";
    }
}
