package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_image")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String publicImageId;
    private String link;

    @OneToOne(mappedBy = "image")
    private Vehicle vehicle;
}
