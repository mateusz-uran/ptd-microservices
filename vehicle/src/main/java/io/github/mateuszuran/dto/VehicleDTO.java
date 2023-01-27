package io.github.mateuszuran.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleDTO {
    private String id;
    private String model;
    private String truckType;
    private String truckLicensePlate;
    private Integer leftTankFuelCapacity;
    private Integer rightTankFuelCapacity;
    private Integer fullTankCapacity;
    private Integer adBlueCapacity;
}
