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
                // pas de CSRF pour le moment (on n'a pas de formulaires sensibles)
                .csrf(csrf -> csrf.disable())

                // on autorise tout le monde à accéder à toutes les pages
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",              // accueil
                                "/vitres-teintees",
                                "/covering",
                                "/tarifs",
                                "/boutique",
                                "/contact",
                                "/css/**",
                                "/js/**",
                                "/img/**",
                                "/h2-console/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                )

                // pas de formulaire de login
                .formLogin(form -> form.disable())

                // pas de basic auth
                .httpBasic(basic -> basic.disable());

        // si jamais tu utilises la console H2
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
