package io.github.mateuszuran.card.exception;

import io.github.mateuszuran.card.exception.card.*;
import io.github.mateuszuran.card.exception.user.UserNotFoundException;
import io.github.mateuszuran.card.exception.user.UserNotReadyException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler({CallNotPermittedException.class})
    public ResponseEntity<ErrorMessage> handleServiceNotAvailable() {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                ErrorMessage.trimExceptionTimestamp(),
                "Service not available at the moment, please try again later.");
        return new ResponseEntity<>(message, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler({CardEmptyException.class})
    public ResponseEntity<ErrorMessage> handleToggleEmptyCard(CardEmptyException exception) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                ErrorMessage.trimExceptionTimestamp(),
                exception.getMessage());
        return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({CardExistsException.class})
    public ResponseEntity<ErrorMessage> handleAddExistingCard(CardExistsException exception) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.CONFLICT.value(),
                ErrorMessage.trimExceptionTimestamp(),
                exception.getMessage());
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({CardNotFoundException.class})
    public ResponseEntity<ErrorMessage> handleCardNotFound(CardNotFoundException exception) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.NOT_FOUND.value(),
                ErrorMessage.trimExceptionTimestamp(),
                exception.getMessage());
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({UserNotReadyException.class})
    public ResponseEntity<ErrorMessage> handleNotToggled(UserNotReadyException exception) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                ErrorMessage.trimExceptionTimestamp(),
                exception.getMessage());
        return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({UserNotFoundException.class})
    public ResponseEntity<ErrorMessage> handleUserInformation(UserNotFoundException exception) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                ErrorMessage.trimExceptionTimestamp(),
                exception.getMessage());
        return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    static class ErrorMessage {
        private int statusCode;
        private String timestamp;
        private String description;

        static String trimExceptionTimestamp() {
            var result = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return result.format(formatter);
        }
    }
}
