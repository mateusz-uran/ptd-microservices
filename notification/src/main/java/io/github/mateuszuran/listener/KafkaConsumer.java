package io.github.mateuszuran.listener;

import io.github.mateuszuran.event.CardToggledEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaConsumer {

    @Value(value = "${spring.kafka.template.default-topic}")
    private String greetingTopicName;

    private final SimpMessagingTemplate template;

    @KafkaListener(topics = "${spring.kafka.template.default-topic}", containerFactory = "notificationKafkaListenerContainerFactory")
    public void greetingListener(CardToggledEvent card) {
        log.info(card.getCardNumber());
        log.info(card.getCardAuthor());
        log.info(card.getCardEvent());
        template.convertAndSend("/topic/notify",card);
    }
}
