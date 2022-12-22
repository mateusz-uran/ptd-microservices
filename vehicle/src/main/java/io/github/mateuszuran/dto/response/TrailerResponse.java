package io.github.mateuszuran.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TrailerResponse {
    private Long id;
    private String type;
    private String licensePlate;
    private Integer fuelCapacity;
}
