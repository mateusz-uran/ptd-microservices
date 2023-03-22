package io.github.mateuszuran.card.exception.user;

public class UserNotReadyException extends RuntimeException {
    public UserNotReadyException() {
        super("You have no permissions.");
    }
}
