package com.colorscustom.service;

import com.colorscustom.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    public List<Product> getAllProducts() {
        return List.of(
            new Product(1L,  "CANDY 711",        "Dressing plastiques",                    new BigDecimal("17.90")),
            new Product(2L,  "COCKPIT 702",      "Nettoyant Alcantara / Moquettes",        new BigDecimal("8.90")),
            new Product(3L,  "DRIFT 120",        "Nettoyant jantes",                       new BigDecimal("18.90")),
            new Product(4L,  "Glaco BLAVE",      "Traitement hydrophobe vitres",           new BigDecimal("16.90")),
            new Product(5L,  "Glaco DE CLEANER", "Nettoyant vitres (préparation)",         new BigDecimal("11.90")),
            new Product(6L,  "Glaco DEICER",     "Dégivrant vitres",                       new BigDecimal("19.90")),
            new Product(7L,  "Glaco DX",         "Traitement longue durée",                new BigDecimal("21.90")),
            new Product(8L,  "Glaco W-JET",      "Lave-glace & hydrophobe",                new BigDecimal("17.90")),
            new Product(9L,  "HIDE 750",         "Protection cuir",                        new BigDecimal("21.90")),
            new Product(10L, "HIDE CLEAN 751",   "Nettoyant cuir",                         new BigDecimal("19.90")),
            new Product(11L, "HYDRO STOP 618",   "Protection hydrophobe",                  new BigDecimal("7.90")),
            new Product(12L, "MIRROR 723",       "Nettoyant vitres",                       new BigDecimal("6.50")),
            new Product(13L, "SPRINT 743",       "Quick Detailer (brillance express)",     new BigDecimal("8.90")),
            new Product(14L, "TYRE 719",         "Brillant pneus",                         new BigDecimal("18.90")),
            new Product(15L, "VIBES FLORA 730",  "Destructeur d’odeurs parfumé",           new BigDecimal("12.90"))
        );
    }

    public Product findById(Long id) {
        return getAllProducts().stream()
            .filter(p -> p.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
}
