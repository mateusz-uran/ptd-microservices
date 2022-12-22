package io.github.mateuszuran.pdfgenerator.dto;

import io.github.mateuszuran.pdfgenerator.dto.card.CardPDFResponse;
import io.github.mateuszuran.pdfgenerator.dto.vehicle.VehiclePDFResponse;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PdfResponse {
    private CardPDFResponse card;
    private VehiclePDFResponse vehiclePdf;
}
