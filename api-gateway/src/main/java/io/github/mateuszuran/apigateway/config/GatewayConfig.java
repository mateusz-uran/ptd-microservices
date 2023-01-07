package io.github.mateuszuran.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/user/**", "/api/auth/**")
                        .uri("lb://user-service"))
                .route("card-service", r -> r.path("/api/card/**", "/api/fuel/**", "/api/trip/**")
                        .uri("lb://card-service"))
                .route("pdf-service", r -> r.path("/api/pdf/**", "/css/main.css")
                        .uri("lb://pdf-service"))
                .route("vehicle-service", r -> r.path("/api/vehicle/**")
                        .uri("lb://vehicle-service"))
                .build();
    }
}
