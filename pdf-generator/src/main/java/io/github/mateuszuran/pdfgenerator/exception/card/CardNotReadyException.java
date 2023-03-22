package io.github.mateuszuran.pdfgenerator.exception.card;

public class CardNotReadyException extends RuntimeException {
    public CardNotReadyException() {
        super("Card not ready yet.");
    }
}
