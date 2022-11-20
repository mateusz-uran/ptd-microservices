package io.github.mateuszuran.pdfgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CardPDFResponse {
    private CardResponse cardInfo;
    private List<FuelResponse> fuels;
    private List<TripResponse> trips;
}
