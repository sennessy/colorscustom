// CONTROLLER CORRIGÉ ET PROPRE

@GetMapping("/services/vitres-teintees")
public String vitresTeintees() {
    return "services/vitres-teintees";
}

@GetMapping("/services/covering")
public String covering() {
    return "services/covering";
}

@GetMapping("/services/ceramique")
public String ceramique() {
    return "services/ceramique";
}

@GetMapping("/services/feux-teintes")
public String feuxTeintes() {
    return "services/feux-teintees";
}

@GetMapping("/services/creation-visuelle")
public String creationVisuelle() {
    return "services/creation-visuelle";
}

@GetMapping("/services/film-protection")
public String filmProtection() {
    return "services/film-protection";
}

@GetMapping("/services/ceramique-long")
public String ceramiqueLong() {
    return "services/ceramique-long";
}

@GetMapping("/services/creation-visuelle-long")
public String creationVisuelleLong() {
    return "services/creation-visuelle-long";
}

@GetMapping("/services")
public String servicesOverview() {
    return "services";
}

// --------------------
// BOUTIQUE
// --------------------

@GetMapping("/boutique")
public String boutique() {
    return "boutique/boutique";
}

@GetMapping("/boutique/entretien")
public String boutiqueEntretien() {
    return "boutique/entretien";
}

@GetMapping("/boutique/stickers")
public String boutiqueStickers() {
    return "boutique/stickers";
}

@GetMapping("/boutique/accessoires")
public String boutiqueAccessoires() {
    return "boutique/accessoires";
}

// --------------------
// ENTREPRISE
// --------------------

@GetMapping("/entreprise")
public String entreprises() {
    return "entreprise/entreprise";
}

@GetMapping("/entreprise/flotte")
public String flotte() {
    return "entreprise/flotte";
}

@GetMapping("/entreprise/publicite")
public String publicite() {
    return "entreprise/publicite";
}

@GetMapping("/entreprise/projet-sur-mesure")
public String projetSurMesure() {
    return "entreprise/projet-sur-mesure";
}

// --------------------
// EXPERTISE
// --------------------

@GetMapping("/expertise/voiture")
public String expertiseVoiture() {
    return "expertise-voiture";
}

@GetMapping("/expertise/moto")
public String expertiseMoto() {
    return "expertise-moto";
}

@GetMapping("/expertise/nautique")
public String expertiseNautique() {
    return "expertise-nautique";
}

@GetMapping("/expertise/entreprise")
public String expertiseEntreprise() {
    return "expertise-entreprise";
}

@GetMapping("/expertise/mobilite-speciale")
public String expertiseMobilite() {
    return "expertise-mobilite";
}

// --------------------
// CONTACT & DEVIS
// --------------------

@GetMapping("/contact")
public String contact() {
    return "contact/contact";
}

@GetMapping("/devis")
public String devis() {
    return "devis/devis";
}
