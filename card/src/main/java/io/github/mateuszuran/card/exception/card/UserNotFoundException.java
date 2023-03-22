package io.github.mateuszuran.card.exception.card;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("You have no permissions.");
    }
}
