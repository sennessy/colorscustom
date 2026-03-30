package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PagesController {

    // Boutique sub-pages
    @GetMapping("/boutique/entretien")
    public String boutiqueEntretien() { return "redirect:/boutique#boutique-top-ventes"; }

    @GetMapping("/boutique/accessoires")
    public String boutiqueAccessoires() { return "boutique/accessoires"; }

    @GetMapping("/boutique/stickers")
    public String boutiqueStickers() { return "boutique/stickers"; }

    // Contact & quote
    @GetMapping("/contact")
    public String contact() { return "contact/contact"; }

    @GetMapping("/devis")
    public String devis() { return "devis/devis"; }

    // Info pages
    @GetMapping("/tarifs")
    public String tarifs() { return "tarifs"; }

    @GetMapping("/faq")
    public String faq() { return "faq"; }

    @GetMapping("/about")
    public String about() { return "about"; }

    @GetMapping("/approach")
    public String approach() { return "approach"; }

    @GetMapping("/clients")
    public String clients() { return "clients"; }

    // Legal
    @GetMapping("/mentions-legales")
    public String mentionsLegales() { return "mentions-legales"; }

    @GetMapping("/conditions-utilisation")
    public String conditionsUtilisation() { return "conditions-utilisation"; }

    @GetMapping("/confidentialite")
    public String confidentialite() { return "confidentialite"; }
}
