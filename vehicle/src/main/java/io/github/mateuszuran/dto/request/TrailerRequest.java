package io.github.mateuszuran.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TrailerRequest {
    private String type;
    private String licensePlate;
    private Integer fuelCapacity;
}
