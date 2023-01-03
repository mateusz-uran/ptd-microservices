package io.github.mateuszuran.card.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

public class CardWebClientTest {
    private MockWebServer server;
    private CardService service;

    @BeforeEach
    void setup() {
        server = new MockWebServer();
        WebClient webClient = WebClient.builder().baseUrl(server.url("").toString()).build();
        service = new CardService(webClient);
    }

    @Test
    void test() {
        server.enqueue(new MockResponse().setBody("{\"id\": 12345}")
                .addHeader("Content-Type", "application/json")
                .setResponseCode(200));

        var result = service.getUsername("john");

        assertThat(result.getId()).isEqualTo(12345);
    }
}
