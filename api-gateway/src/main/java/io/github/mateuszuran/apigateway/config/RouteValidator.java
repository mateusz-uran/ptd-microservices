package io.github.mateuszuran.apigateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    final List<String> apiEndpoints = List.of(
            "/api/auth/register",
            "/api/auth/authenticate",
            "/api/user\\\\?username=[^&]+"
    );

    Predicate<ServerHttpRequest> isApiSecured = r -> apiEndpoints.stream()
            .noneMatch(uri -> r.getURI().getPath().contains(uri));
}
