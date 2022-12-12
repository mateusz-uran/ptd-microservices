package io.github.mateuszuran.card.exception.card;

public class CardExistsException extends RuntimeException {
    public CardExistsException(String number) {
        super("Card with number: " + number + " already exists.");
    }
}
