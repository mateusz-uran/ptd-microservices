package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleImage {
    private String vehicleImageName;
    private String vehicleImageDescription;
    private String vehicleImagePublicId;
    private String vehicleImageDirectLink;
}
