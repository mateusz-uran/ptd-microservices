package io.github.mateuszuran.pdfgenerator.service;

import io.github.mateuszuran.pdfgenerator.dto.PdfResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.CardPDFResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.CounterResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.FuelResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.TripResponse;
import io.github.mateuszuran.pdfgenerator.dto.vehicle.VehiclePDFResponse;
import io.github.mateuszuran.pdfgenerator.exception.card.CardNotReadyException;
import io.github.mateuszuran.pdfgenerator.exception.card.CardNotFoundException;
import io.github.mateuszuran.pdfgenerator.exception.card.InvalidCardDataException;
import io.github.mateuszuran.pdfgenerator.exception.ServiceNotAvailableException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfService {
    private final WebClient.Builder webClientBuilder;

    @CircuitBreaker(name = "card")
    private CardPDFResponse getCardValues(Long cardId) {
        return webClientBuilder.build().get()
                .uri("http://card-service/api/card",
                        uriBuilder -> uriBuilder.queryParam("id", cardId).build())
                .retrieve()
                .bodyToMono(CardPDFResponse.class)
                .block();
    }

    @CircuitBreaker(name = "vehicle")
    private VehiclePDFResponse getVehicleValues(Long userId) {
        return webClientBuilder.build().get()
                .uri("http://vehicle-service/api/vehicle",
                        uriBuilder -> uriBuilder.queryParam("userId", userId).build())
                .retrieve()
                .bodyToMono(VehiclePDFResponse.class)
                .block();
    }

    public VehiclePDFResponse retrieveVehicleDataForPdf(Long userId) {
        var result = getVehicleValues(userId);
        if (result == null) {
            throw new ServiceNotAvailableException();
        }
        return  result;
    }

    public CardPDFResponse calculateCardDataForPdf(Long id) {
        var card = getCardValues(id);
        if (card == null) {
            throw new CardNotFoundException();
        }

        if (!card.getCardInfo().isDone()) {
            throw new CardNotReadyException();
        }

        var minimalCounter = card.getTrips().stream().mapToInt(TripResponse::getCounterStart).min()
                .orElseThrow(InvalidCardDataException::new);
        var maximumCounter = card.getTrips().stream().mapToInt(TripResponse::getCounterEnd).max()
                .orElseThrow(InvalidCardDataException::new);

        var sumMileage = card.getTrips().stream().mapToInt(TripResponse::getCarMileage).sum();

        var cardRefuelingAmount = card.getFuels().stream().mapToInt(FuelResponse::getRefuelingAmount).sum();
        card.setCounter(new CounterResponse(minimalCounter, maximumCounter, sumMileage, cardRefuelingAmount));

        return card;
    }

    public PdfResponse buildResponse(CardPDFResponse card, VehiclePDFResponse vehicle) {
        return PdfResponse.builder()
                .card(card)
                .vehiclePdf(vehicle)
                .build();
    }
}
