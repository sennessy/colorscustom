package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PagesController {

    // SERVICES
    @GetMapping("/services")
    public String servicesOverview() { return "services"; }

    @GetMapping("/services/vitres-teintees")
    public String vitresTeintees() { return "services/vitres-teintees"; }

    @GetMapping("/services/covering")
    public String covering() { return "services/covering"; }

    @GetMapping("/services/ceramique")
    public String ceramique() { return "services/ceramique"; }

    @GetMapping("/services/feux-teintees")
    public String feuxTeintees() { return "services/feux-teintees"; }

    @GetMapping("/services/creation-visuelle")
    public String creationVisuelle() { return "services/creation-visuelle"; }

    @GetMapping("/services/film-protection")
    public String filmProtection() { return "services/film-protection"; }

    @GetMapping("/services/ceramique-long")
    public String ceramiqueLong() { return "services/ceramique-long"; }

    @GetMapping("/services/creation-visuelle-long")
    public String creationVisuelleLong() { return "services/creation-visuelle-long"; }

    // ENTREPRISE
    @GetMapping("/entreprise")
    public String entreprise() { return "entreprise/entreprise"; }

    @GetMapping("/entreprise/flotte")
    public String flotte() { return "entreprise/flotte"; }

    @GetMapping("/entreprise/publicite")
    public String publicite() { return "entreprise/publicite"; }

    @GetMapping("/entreprise/projet-sur-mesure")
    public String projetSurMesure() { return "entreprise/projet-sur-mesure"; }

    // EXPERTISE
    @GetMapping("/expertise/voiture")
    public String expertiseVoiture() { return "expertise-voiture"; }

    @GetMapping("/expertise/moto")
    public String expertiseMoto() { return "expertise-moto"; }

    @GetMapping("/expertise/nautique")
    public String expertiseNautique() { return "expertise-nautique"; }

    @GetMapping("/expertise/entreprise")
    public String expertiseEntreprise() { return "expertise-entreprise"; }

    @GetMapping("/expertise/mobilite-speciale")
    public String expertiseMobilite() { return "expertise-mobilite"; }

    // CONTACT & DEVIS & TARIFS
    @GetMapping("/boutique/entretien")
    public String boutiqueEntretien() { return "redirect:/boutique#boutique-top-ventes"; }

    @GetMapping("/boutique/accessoires")
    public String boutiqueAccessoires() { return "boutique/accessoires"; }

    @GetMapping("/boutique/stickers")
    public String boutiqueStickers() { return "boutique/stickers"; }

    @GetMapping("/contact")
    public String contact() { return "contact/contact"; }

    @GetMapping("/devis")
    public String devis() { return "devis/devis"; }

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

    @GetMapping("/mentions-legales")
    public String mentionsLegales() { return "mentions-legales"; }

    @GetMapping("/conditions-utilisation")
    public String conditionsUtilisation() { return "conditions-utilisation"; }

    @GetMapping("/confidentialite")
    public String confidentialite() { return "confidentialite"; }
}
