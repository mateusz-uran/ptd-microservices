package io.github.mateuszuran.card.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "card_fuels")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Fuel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String refuelingDate;
    private String refuelingLocation;
    private Integer vehicleCounter;
    private Integer refuelingAmount;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;
}
