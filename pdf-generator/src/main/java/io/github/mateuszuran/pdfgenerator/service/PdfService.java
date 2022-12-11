package io.github.mateuszuran.pdfgenerator.service;

import io.github.mateuszuran.pdfgenerator.dto.CardPDFResponse;
import io.github.mateuszuran.pdfgenerator.dto.CounterResponse;
import io.github.mateuszuran.pdfgenerator.dto.FuelResponse;
import io.github.mateuszuran.pdfgenerator.dto.TripResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PdfService {
    private final WebClient.Builder webClientBuilder;

    private CardPDFResponse getCardValues(Long id) {
        return webClientBuilder.build().get()
                .uri("http://card-service/api/card",
                        uriBuilder -> uriBuilder.queryParam("id", id).build())
                .retrieve()
                .bodyToMono(CardPDFResponse.class)
                .block();
    }

    public CardPDFResponse calculateCardDataForPdf(Long id) {
        var card = getCardValues(id);
        if (card.getCardInfo().isDone()) {
            var minimalCounter = card.getTrips().stream().mapToInt(TripResponse::getCounterStart).min()
                    .orElseThrow(NoSuchElementException::new);
            var maximumCounter = card.getTrips().stream().mapToInt(TripResponse::getCounterEnd).max()
                    .orElseThrow(NoSuchElementException::new);
            var sumMileage = card.getTrips().stream().mapToInt(TripResponse::getCarMileage).sum();
            var cardRefuelingAmount = card.getFuels().stream().mapToInt(FuelResponse::getRefuelingAmount).sum();
            card.setCounter(new CounterResponse(minimalCounter, maximumCounter, sumMileage, cardRefuelingAmount));
            return card;
        } else {
            throw new IllegalArgumentException("Card not done yet");
        }
    }
}
