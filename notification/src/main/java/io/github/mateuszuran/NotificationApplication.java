package io.github.mateuszuran;

import io.github.mateuszuran.event.CardToggledEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.KafkaListener;

@SpringBootApplication
@Slf4j
public class NotificationApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
    }

/*    @KafkaListener(topics = "notificationTopic")
    public void handleNotification(CardToggledEvent card) {
        // TODO: 15.11.2022 Notification logic e.g. send email
        log.info(card.getCardNumber());
        log.info(card.getCardAuthor());
        log.info(card.getCardEvent());
    }*/
}
