package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    // Pages business
    @GetMapping("/services")
    public String services() {
        return "services";
    }

    @GetMapping("/services/vitres-teintees")
    public String vitresTeintees() {
        return "services/vitres-teintees";
    }

    @GetMapping("/services/covering")
    public String covering() {
        return "services/covering";
    }

    @GetMapping("/tarifs")
    public String tarifs() {
        return "tarifs";
    }

    @GetMapping("/contact")
    public String contact() {
        return "contact/contact";
    }

    @GetMapping("/hero-test")
    public String heroTest() {
        return "hero-test";
    }
}
