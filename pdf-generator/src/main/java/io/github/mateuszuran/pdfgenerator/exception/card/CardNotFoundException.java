package io.github.mateuszuran.pdfgenerator.exception.card;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException() {
        super("Card not found.");
    }
}
