package io.github.mateuszuran.pdfgenerator.exception.card;

public class ServiceNotAvailableException extends RuntimeException {
    public ServiceNotAvailableException() {
        super("Something went wrong, please try again later.");
    }
}
