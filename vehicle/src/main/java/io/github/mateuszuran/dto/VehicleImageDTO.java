package io.github.mateuszuran.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleImageDTO {
    private String vehicleImageName;
    private String vehicleImageDescription;
    private String vehicleImagePublicId;
    private String vehicleImageDirectLink;
}
