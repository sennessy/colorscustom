package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/expertise")
public class ExpertiseController {

    @GetMapping("/voiture")
    public String voiture() { return "expertise-voiture"; }

    @GetMapping("/moto")
    public String moto() { return "expertise-moto"; }

    @GetMapping("/nautique")
    public String nautique() { return "expertise-nautique"; }

    @GetMapping("/entreprise")
    public String entreprise() { return "expertise-entreprise"; }

    @GetMapping("/mobilite-speciale")
    public String mobiliteSpeciale() { return "expertise-mobilite"; }
}
