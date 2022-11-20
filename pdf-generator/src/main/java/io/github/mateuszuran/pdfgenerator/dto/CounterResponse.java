package io.github.mateuszuran.pdfgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CounterResponse {
    private Integer firstCounter;
    private Integer lastCounter;
    private Integer mileage;
    private Integer refuelingSum;
}
