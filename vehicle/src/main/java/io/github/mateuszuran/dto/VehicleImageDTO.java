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
    private String name;
    private String description;
    private String publicImageId;
    private String link;
}
