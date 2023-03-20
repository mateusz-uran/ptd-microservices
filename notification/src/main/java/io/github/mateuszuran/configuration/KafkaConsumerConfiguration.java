package io.github.mateuszuran.configuration;

/*@Configuration
@EnableKafka
public class KafkaConsumerConfiguration {

    private final Environment env;

    public KafkaConsumerConfiguration(Environment env) {
        this.env = env;
    }

//    @Bean
//    public ConsumerFactory<String, String> consumerFactory(){
//        Map<String,Object> config=new HashMap<>();
//        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
//        config.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("spring.kafka.consumer.group-id"));
//        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
//        return new DefaultKafkaConsumerFactory<>(config);
//    }

    @Bean
    public ConsumerFactory<String, CardToggledEvent> greetingConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("spring.kafka.consumer.group-id"));
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), new JsonDeserializer<>(CardToggledEvent.class));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, CardToggledEvent> greetingKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, CardToggledEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(greetingConsumerFactory());
        return factory;
    }

//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String,String> kafkaListenerContainerFactory(){
//        ConcurrentKafkaListenerContainerFactory<String, String> factory=new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(consumerFactory());
//        return factory;
//    }
}*/
