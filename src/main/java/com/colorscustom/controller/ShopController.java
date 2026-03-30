package com.colorscustom.controller;

import com.colorscustom.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ShopController {

    private final ProductService productService;

    public ShopController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/boutique")
    public String boutique(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        return "boutique";
    }
}
