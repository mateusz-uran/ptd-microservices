package io.github.mateuszuran.card.exception.card;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException() {
        super("Card not found.");
    }
}
