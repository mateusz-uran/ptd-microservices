package io.github.mateuszuran.card.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "cards")
@AllArgsConstructor
@NoArgsConstructor
@Data
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
