package io.github.mateuszuran.pdfgenerator.dto.vehicle;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleImageResponse {
    private String name;
    private String description;
    private String link;
}
