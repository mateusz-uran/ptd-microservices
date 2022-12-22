package io.github.mateuszuran.pdfgenerator.dto.card;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TripResponse {
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
}
