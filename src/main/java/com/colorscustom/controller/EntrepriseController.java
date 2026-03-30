package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/entreprise")
public class EntrepriseController {

    @GetMapping("")
    public String entreprise() { return "entreprise/entreprise"; }

    @GetMapping("/flotte")
    public String flotte() { return "entreprise/flotte"; }

    @GetMapping("/publicite")
    public String publicite() { return "entreprise/publicite"; }

    @GetMapping("/projet-sur-mesure")
    public String projetSurMesure() { return "entreprise/projet-sur-mesure"; }
}
