package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.response.UserResponse;
import lombok.extern.slf4j.Slf4j;
import okhttp3.HttpUrl;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.reactivestreams.Publisher;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static reactor.core.publisher.Mono.when;

@Slf4j
@ExtendWith(SpringExtension.class)
public class CardWebClientTest {

    private MockWebServer server;
    private CardService service;
    private WebClient.Builder webClientBuilder;

    @BeforeEach
    void setup() {
        server = new MockWebServer();
        webClientBuilder = WebClient.builder().baseUrl(server.url("").toString());
        service = new CardService(null, webClientBuilder, null, null, null, null);
    }

    @Test
    void test() throws Exception {
        server.enqueue(new MockResponse().setBody("{\"id\": 2}")
                .addHeader("Content-Type", "application/json")
                .setResponseCode(200)
                .setHeader("X-Username", "john"));
        var result = webClientBuilder.build().get()
                .uri("api/user",
                        uriBuilder -> uriBuilder.queryParam("username", "john").build())
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();

        assertNotNull(result);
        assertEquals(2L, result.getId());

        RecordedRequest request = server.takeRequest();
        assertEquals("GET", request.getMethod());
        assertEquals("/api/user?username=john", request.getPath());
    }
}
