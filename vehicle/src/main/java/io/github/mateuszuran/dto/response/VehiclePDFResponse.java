package io.github.mateuszuran.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehiclePDFResponse {
    private VehicleResponse vehicle;
    private TrailerResponse trailer;
    private VehicleImageResponse image;
}
