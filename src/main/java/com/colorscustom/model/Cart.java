package com.colorscustom.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Cart {

    private List<CartItem> items = new ArrayList<>();

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public int countItems() {
        int total = 0;
        for (CartItem item : items) {
            total += item.getQuantity();
        }
        return total;
    }

    public BigDecimal subtotal() {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            total = total.add(item.getLineTotal());
        }
        return total;
    }

    public void addOrIncrement(CartItem toAdd) {
        if (toAdd == null || toAdd.getProduct() == null || toAdd.getProduct().getId() == null) {
            return;
        }

        for (CartItem item : items) {
            if (item.getProduct() != null
                && item.getProduct().getId() != null
                && item.getProduct().getId().equals(toAdd.getProduct().getId())) {

                item.setQuantity(item.getQuantity() + toAdd.getQuantity());
                return;
            }
        }

        items.add(toAdd);
    }

    public void updateQuantity(Long productId, int quantity) {
        if (productId == null) return;

        items.removeIf(item ->
            item.getProduct() != null
            && productId.equals(item.getProduct().getId())
            && quantity <= 0
        );

        for (CartItem item : items) {
            if (item.getProduct() != null
                && productId.equals(item.getProduct().getId())) {

                item.setQuantity(quantity);
                return;
            }
        }
    }

    public void remove(Long productId) {
        if (productId == null) return;

        items.removeIf(item ->
            item.getProduct() != null
            && productId.equals(item.getProduct().getId())
        );
    }

    public void clear() {
        items.clear();
    }
}
