package com.colorscustom.controller;

import com.colorscustom.model.CartItem;
import com.colorscustom.service.CartService;
import com.colorscustom.service.ProductService;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Controller
public class ShopController {

    private final ProductService productService;
    private final CartService cartService;

    // Clé Stripe: OK en fallback vide pour éviter crash au démarrage si pas configuré
    @Value("${stripe.secretKey:}")
    private String stripeSecretKey;

    // Base URL: prévoir fallback sinon ça casse en local si pas set
    @Value("${app.baseUrl:http://localhost:8080}")
    private String baseUrl;

    private static final String SHIPPING_HERO = "🚚 Livraison gratuite partout en Suisse 🇨🇭";

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
        model.addAttribute("cartCount", cartService.countItems(session));
        return "boutique";
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("productId") Long productId,
                            @RequestParam(value = "qty", defaultValue = "1") int qty,
                            HttpSession session) {
        var p = productService.findById(productId); // Product ou null
        if (p != null) {
            cartService.add(session, p, Math.max(qty, 1));
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

        model.addAttribute("shippingHero", SHIPPING_HERO);
        model.addAttribute("cart", cart);
        model.addAttribute("cartCount", cartService.countItems(session));
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
    public String checkout(HttpSession session) throws Exception {

        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException(
                    "stripe.secretKey est vide. Mets ta clé sk_test_... dans application.properties " +
                    "ou en variable d'environnement."
            );
        }

        Stripe.apiKey = stripeSecretKey;

        Map<Long, CartItem> cart = cartService.getCart(session);
        if (cart == null || cart.isEmpty()) {
            return "redirect:/panier";
        }

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(baseUrl + "/checkout/success")
                .setCancelUrl(baseUrl + "/checkout/cancel");

        // ✅ Items du panier
        for (CartItem item : cart.values()) {
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
                                            .setCurrency("chf")
                                            .setUnitAmount(unitAmountCents)
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(item.getProduct().getName()
                                                                    + (item.getProduct().getSubtitle() != null && !item.getProduct().getSubtitle().isBlank()
                                                                    ? " — " + item.getProduct().getSubtitle()
                                                                    : ""))
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        // ✅ Livraison gratuite (optionnelle) — Stripe n’aime pas trop les items à 0 dans certains cas,
        // donc on peut la supprimer si ça pose problème.
        builder.addLineItem(
                SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("chf")
                                        .setUnitAmount(0L)
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Livraison Suisse 🇨🇭")
                                                        .setDescription("Gratuite partout en Suisse")
                                                        .build()
                                        )
                                        .build()
                        )
                        .build()
        );

        Session checkoutSession = Session.create(builder.build());
        return "redirect:" + checkoutSession.getUrl();
    }

    @GetMapping("/checkout/success")
    public String checkoutSuccess(HttpSession session) {
        // Optionnel: vider le panier après paiement confirmé via webhook
        // ou ici si tu veux un comportement simple:
        // cartService.clear(session);
        return "checkout_success";
    }

    @GetMapping("/checkout/cancel")
    public String checkoutCancel() {
        return "checkout_cancel";
    }
}
