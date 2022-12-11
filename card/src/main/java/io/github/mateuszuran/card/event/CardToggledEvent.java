package io.github.mateuszuran.card.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardToggledEvent {
    private String cardNumber;
    private String message;
}
