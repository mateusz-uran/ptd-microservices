package io.github.mateuszuran.card.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "cards_trips")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String dayStart;
    private String hourStart;
    private String locationStart;
    private String dayEnd;
    private String hourEnd;
    private String locationEnd;
    private String countryStart;
    private String countryEnd;
    private Integer counterStart;
    private Integer counterEnd;
    private Integer carMileage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;
}
