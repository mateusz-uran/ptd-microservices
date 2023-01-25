package io.github.mateuszuran.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TrailerDTO {
    private String trailerType;
    private String trailerLicensePlate;
    private Integer trailerFuelCapacity;
}
