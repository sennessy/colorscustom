package com.colorscustom.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/stripe")
public class StripeWebhookController {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookController.class);

    @Value("${stripe.webhook.secret:}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws Exception {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("Stripe webhook appelé sans stripe.webhook.secret configuré");
            return ResponseEntity.status(503).body("Webhook secret not configured");
        }

        String payload = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
        String sigHeader = request.getHeader("Stripe-Signature");
        if (sigHeader == null || sigHeader.isBlank()) {
            return ResponseEntity.badRequest().body("Missing Stripe-Signature header");
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Signature Stripe invalide: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid signature");
        } catch (Exception e) {
            log.warn("Payload Stripe invalide: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid payload");
        }

        // Exemple: événement clé pour une commande Checkout.
        if ("checkout.session.completed".equals(event.getType())) {
            log.info("Paiement confirmé: checkout.session.completed");
        }

        return ResponseEntity.ok("ok");
    }
}
