package io.github.mateuszuran.card.exception.card;

public class CardEmptyException extends RuntimeException {
    public CardEmptyException() {
        super("Card is empty.");
    }
}
