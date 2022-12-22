package io.github.mateuszuran.pdfgenerator.dto.card;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardResponse {
    private Long id;
    private String number;
    private boolean done;
}
