package io.github.mateuszuran.pdfgenerator.dto.vehicle;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class VehiclePDFResponse {
    private VehicleResponse vehicle;
    private TrailerResponse trailer;
    private VehicleImageResponse image;
}
