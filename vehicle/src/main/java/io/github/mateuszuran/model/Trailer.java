package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Trailer {
    private String trailerType;
    private String trailerLicensePlate;
    private Integer trailerFuelCapacity;
}
