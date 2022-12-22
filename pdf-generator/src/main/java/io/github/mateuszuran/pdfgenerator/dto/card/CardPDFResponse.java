package io.github.mateuszuran.pdfgenerator.dto.card;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CardPDFResponse {
    private CardResponse cardInfo;
    private List<FuelResponse> fuels;
    private List<TripResponse> trips;
    private CounterResponse counter;
}
