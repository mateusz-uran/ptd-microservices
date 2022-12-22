package io.github.mateuszuran.pdfgenerator.dto.card;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CounterResponse {
    private Integer firstCounter;
    private Integer lastCounter;
    private Integer mileage;
    private Integer refuelingSum;
}
