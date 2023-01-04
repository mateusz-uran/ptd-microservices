package io.github.mateuszuran.card.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.mateuszuran.card.dto.response.UserResponse;
import lombok.extern.slf4j.Slf4j;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.io.IOException;

@Slf4j
class CardServiceIntegrationTest {
    public static MockWebServer mockBackEnd;
    private ObjectMapper MAPPER = new ObjectMapper();
    private WebClient webClient;

    @BeforeAll
    static void setUp() throws IOException {
        mockBackEnd = new MockWebServer();
        mockBackEnd.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockBackEnd.shutdown();
    }

    @BeforeEach
    void initialize() {
        webClient = WebClient.create("http://localhost:" + mockBackEnd.getPort());
    }

    @Test
    void givenUsername_whenSendRequest_thenReturnUserResponseBody() throws Exception {
        UserResponse userResponse = UserResponse.builder().id(1L).build();
        mockBackEnd.enqueue(new MockResponse().setBody(MAPPER.writeValueAsString(userResponse))
                .addHeader("Content-Type", "application/json"));
        String username = "john";

        Mono<UserResponse> response = webClient.get().uri("/api/user",
                uriBuilder -> uriBuilder.queryParam("username", username).build()).retrieve().bodyToMono(UserResponse.class);
        StepVerifier.create(response).expectNext(userResponse).verifyComplete();
    }
}