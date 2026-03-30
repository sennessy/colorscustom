package com.colorscustom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/services")
public class ServicesController {

    @GetMapping("")
    public String servicesOverview() { return "services"; }

    @GetMapping("/vitres-teintees")
    public String vitresTeintees() { return "services/vitres-teintees"; }

    @GetMapping("/covering")
    public String covering() { return "services/covering"; }

    @GetMapping("/ceramique")
    public String ceramique() { return "services/ceramique"; }

    @GetMapping("/feux-teintees")
    public String feuxTeintees() { return "services/feux-teintees"; }

    @GetMapping("/creation-visuelle")
    public String creationVisuelle() { return "services/creation-visuelle"; }

    @GetMapping("/film-protection")
    public String filmProtection() { return "services/film-protection"; }

    @GetMapping("/ceramique-long")
    public String ceramiqueLong() { return "services/ceramique-long"; }

    @GetMapping("/creation-visuelle-long")
    public String creationVisuelleLong() { return "services/creation-visuelle-long"; }
}
