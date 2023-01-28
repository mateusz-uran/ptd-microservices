package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Optional;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Vehicle {
    @Id
    private String id;
    private String model;
    private String truckType;
    private String truckLicensePlate;
    private Integer leftTankFuelCapacity;
    private Integer rightTankFuelCapacity;
    private Integer fullTankCapacity;
    private Integer adBlueCapacity;
    private Long userId;
    private Trailer trailer;
    private VehicleImage image;
}
