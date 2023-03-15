package io.github.mateuszuran.user.repository;

public interface UserProjections {
    Long getId();
    String getUsername();
    boolean isActive();
}
