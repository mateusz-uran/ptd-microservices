package io.github.mateuszuran.card.exception.card;

public class UserNotReadyException extends RuntimeException {
    public UserNotReadyException() {
        super("You have no permissions.");
    }
}
