package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_trailer")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Trailer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String licensePlate;
    private Integer fuelCapacity;

    @OneToOne(mappedBy = "trailer")
    private Vehicle vehicle;
}
