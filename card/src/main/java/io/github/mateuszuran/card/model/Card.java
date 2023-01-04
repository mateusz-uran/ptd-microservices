package io.github.mateuszuran.card.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cards")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String number;
    private boolean done;
    private Long userId;
    @Column(name = "creation_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime creationTime;
    @OneToMany(mappedBy = "card", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<Fuel> fuels = new ArrayList<>();

    @OneToMany(mappedBy = "card", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<Trip> trips = new ArrayList<>();
}
