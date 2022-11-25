package io.github.mateuszuran.dto.response;

import io.github.mateuszuran.dto.request.TrailerRequest;
import io.github.mateuszuran.dto.request.VehicleRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleResponse {
    private Long id;
    private String model;
    private String type;
    private String licensePlate;
    private Integer leftTankFuelCapacity;
    private Integer rightTankFuelCapacity;
    private Integer adBlueCapacity;
}
