package com.colorscustom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF activé partout sauf webhook Stripe (appel serveur à serveur)
                .csrf(csrf -> csrf.ignoringRequestMatchers("/stripe/webhook"))

                // Autorise absolument toutes les requêtes
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // Pas de login
                .formLogin(form -> form.disable())

                // Pas de basic auth
                .httpBasic(basic -> basic.disable());

        // Autorise les frames (utile en dev, ex: console H2)
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
