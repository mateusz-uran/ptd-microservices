package io.github.mateuszuran.listener;

/*@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaConsumer {

    private final SimpMessagingTemplate template;

    @KafkaListener(topics = "notificationTopic")
    public void handleNotification(CardToggledEvent card) {
        log.info(card.getCardNumber());
        log.info(card.getCardAuthor());
        log.info(card.getCardEvent());

        template.convertAndSend("/notification", card);
    }
}*/
