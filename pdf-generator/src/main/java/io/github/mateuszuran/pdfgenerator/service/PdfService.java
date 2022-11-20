package io.github.mateuszuran.pdfgenerator.service;

import io.github.mateuszuran.pdfgenerator.dto.CardPDFResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class PdfService {
    private final WebClient.Builder webClientBuilder;

    public CardPDFResponse getCardValues(Long id) {
        return webClientBuilder.build().get()
                .uri("http://card-service/api/card",
                        uriBuilder -> uriBuilder.queryParam("id", id).build())
                .retrieve()
                .bodyToMono(CardPDFResponse.class)
                .block();
    }
}
