package io.github.mateuszuran.pdfgenerator.exception;

public class CardNotReadyException extends RuntimeException {
    public CardNotReadyException() {
        super("Card not ready yet.");
    }
}
