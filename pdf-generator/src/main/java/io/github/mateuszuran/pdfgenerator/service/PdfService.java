package io.github.mateuszuran.pdfgenerator.service;

import io.github.mateuszuran.pdfgenerator.dto.PdfResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.CardPDFResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.CounterResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.FuelResponse;
import io.github.mateuszuran.pdfgenerator.dto.card.TripResponse;
import io.github.mateuszuran.pdfgenerator.dto.vehicle.VehiclePDFResponse;
import io.github.mateuszuran.pdfgenerator.exception.CardNotReadyException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.NoSuchElementException;

@Slf4j
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

    private VehiclePDFResponse getVehicleValues(Long userId) {
        return webClientBuilder.build().get()
                .uri("http://vehicle-service/api/vehicle",
                        uriBuilder -> uriBuilder.queryParam("userId", userId).build())
                .retrieve()
                .bodyToMono(VehiclePDFResponse.class)
                .block();
    }

    public VehiclePDFResponse retrieveVehicleDataForPdf(Long id) {
        return getVehicleValues(id);
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
            throw new CardNotReadyException();
        }
    }

    public PdfResponse buildResponse(CardPDFResponse card, VehiclePDFResponse vehicle) {
        return PdfResponse.builder()
                .card(card)
                .vehiclePdf(vehicle)
                .build();
    }
}
