package io.github.mateuszuran.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "vehicles")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String model;
    private String type;
    private String licensePlate;
    private Integer leftTankFuelCapacity;
    private Integer rightTankFuelCapacity;
    private Integer adBlueCapacity;
    private Long userId;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "trailer_id", referencedColumnName = "id")
    private Trailer trailer;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vehicle_image_id", referencedColumnName = "id")
    private VehicleImage image;
}
