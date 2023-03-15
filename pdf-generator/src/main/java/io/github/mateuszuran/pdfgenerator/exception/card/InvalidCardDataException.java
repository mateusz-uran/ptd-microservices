package io.github.mateuszuran.pdfgenerator.exception.card;

public class InvalidCardDataException extends RuntimeException {
    public InvalidCardDataException() {
        super("Something went wrong, please try again later.");
    }
}
