package io.github.mateuszuran.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleResponseDTO {
    private VehicleDTO truck;
    private TrailerDTO trailer;
    private VehicleImageDTO image;
}
