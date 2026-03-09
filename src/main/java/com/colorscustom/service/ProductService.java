package com.colorscustom.service;

import com.colorscustom.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final List<Product> PRODUCTS = List.of(
        new Product(1L,  "CANDY 711",        "Dressing plastiques",                    new BigDecimal("17.90"), "/img/products/02_candy_x_plastic_reviver.webp"),
        new Product(2L,  "COCKPIT 702",      "Nettoyant Alcantara / Moquettes",        new BigDecimal("8.90"),  "/img/products/06_cockpit_x_interior_cleaner.webp"),
        new Product(3L,  "DRIFT 120",        "Nettoyant jantes",                       new BigDecimal("18.90"), "/img/products/10_drift_x_wheel_cleaner.webp"),
        new Product(4L,  "Glaco BLAVE",      "Traitement hydrophobe vitres",           new BigDecimal("16.90"), "/img/products/13_glaco_brave_x_long_shield.webp"),
        new Product(5L,  "Glaco DE CLEANER", "Nettoyant vitres (préparation)",         new BigDecimal("11.90"), "/img/products/14_glaco_clean_x_2in1.webp"),
        new Product(6L,  "Glaco DEICER",     "Dégivrant vitres",                       new BigDecimal("19.90"), "/img/products/15_glaco_ice_x_de_icer.webp"),
        new Product(7L,  "Glaco DX",         "Traitement longue durée",                new BigDecimal("21.90"), "/img/products/11_glaco_x_rain_repellent.webp"),
        new Product(8L,  "Glaco W-JET",      "Lave-glace & hydrophobe",                new BigDecimal("17.90"), "/img/products/12_glaco_x_applicator_pad.webp"),
        new Product(9L,  "HIDE 750",         "Protection cuir",                        new BigDecimal("21.90"), "/img/products/08_hide_x_leather_protect.webp"),
        new Product(10L, "HIDE CLEAN 751",   "Nettoyant cuir",                         new BigDecimal("19.90"), "/img/products/09_hide_clean_x_leather_cleaner.webp"),
        new Product(11L, "HYDRO STOP 618",   "Protection hydrophobe",                  new BigDecimal("7.90"),  "/img/products/03_hydro_shield_x.webp"),
        new Product(12L, "MIRROR 723",       "Nettoyant vitres",                       new BigDecimal("6.50"),  "/img/products/04_mirror_x_glass_cleaner.webp"),
        new Product(13L, "SPRINT 743",       "Quick Detailer (brillance express)",     new BigDecimal("8.90"),  "/img/products/01_sprint_x_quick_detailer.webp"),
        new Product(14L, "TYRE 719",         "Brillant pneus",                         new BigDecimal("18.90"), "/img/products/07_tyre_x_gloss_dressing.webp"),
        new Product(15L, "VIBES FLORA 730",  "Destructeur d’odeurs parfumé",           new BigDecimal("12.90"), "/img/products/05_vibes_x_odor_killer.webp")
    );

    private static final Map<Long, Product> PRODUCTS_BY_ID = PRODUCTS.stream()
        .collect(Collectors.toUnmodifiableMap(Product::getId, Function.identity()));

    public List<Product> getAllProducts() {
        return PRODUCTS;
    }

    public Product findById(Long id) {
        if (id == null) {
            return null;
        }
        return PRODUCTS_BY_ID.get(id);
    }
}
