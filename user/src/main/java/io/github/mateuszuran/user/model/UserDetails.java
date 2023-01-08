package io.github.mateuszuran.user.model;

public interface UserDetails {
    String getUsername();
    String getPassword();
    boolean isEnabled();
}
