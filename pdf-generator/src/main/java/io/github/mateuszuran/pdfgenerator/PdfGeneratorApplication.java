package io.github.mateuszuran.pdfgenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class PdfGeneratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(PdfGeneratorApplication.class, args);
    }
}
