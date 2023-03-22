package io.github.mateuszuran.listener;

import io.github.mateuszuran.event.CardToggledEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaConsumer {

    private final SimpMessagingTemplate template;

    @KafkaListener(topics = "${spring.kafka.template.default-topic}", containerFactory = "notificationKafkaListenerContainerFactory")
    public void greetingListener(CardToggledEvent card) {
        template.convertAndSend("/topic/notify",card);
    }
}
