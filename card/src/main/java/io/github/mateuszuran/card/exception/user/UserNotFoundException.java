package io.github.mateuszuran.card.exception.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("You have no permissions.");
    }
}
