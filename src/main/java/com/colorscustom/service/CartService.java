package com.colorscustom.service;

import com.colorscustom.model.CartItem;
import com.colorscustom.model.Product;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    private static final String CART_KEY = "CART";

    @SuppressWarnings("unchecked")
    public Map<Long, CartItem> getCart(HttpSession session) {
        Object obj = session.getAttribute(CART_KEY);
        if (obj instanceof Map<?, ?>) {
            return (Map<Long, CartItem>) obj;
        }
        Map<Long, CartItem> cart = new HashMap<>();
        session.setAttribute(CART_KEY, cart);
        return cart;
    }

    public int countItems(HttpSession session) {
        int total = 0;
        for (CartItem item : getCart(session).values()) {
            total += item.getQuantity();
        }
        return total;
    }

    public BigDecimal subtotal(HttpSession session) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : getCart(session).values()) {
            total = total.add(item.getLineTotal());
        }
        return total;
    }

    public void add(HttpSession session, Product product, int qty) {
        if (product == null || product.getId() == null) return;
        if (qty <= 0) qty = 1;

        Map<Long, CartItem> cart = getCart(session);
        Long id = product.getId();

        CartItem existing = cart.get(id);
        if (existing == null) {
            cart.put(id, new CartItem(product, qty));
        } else {
            existing.setQuantity(existing.getQuantity() + qty);
        }
    }

    public void update(HttpSession session, Long productId, int qty) {
        if (productId == null) return;

        Map<Long, CartItem> cart = getCart(session);

        if (qty <= 0) {
            cart.remove(productId);
            return;
        }

        CartItem existing = cart.get(productId);
        if (existing != null) {
            existing.setQuantity(qty);
        }
    }

    public void remove(HttpSession session, Long productId) {
        if (productId == null) return;
        getCart(session).remove(productId);
    }

    public void clear(HttpSession session) {
        getCart(session).clear();
    }
}
