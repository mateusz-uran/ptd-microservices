package io.github.mateuszuran.pdfgenerator.controller;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import io.github.mateuszuran.pdfgenerator.service.PdfService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;

@Slf4j
@Controller
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {
    private final PdfService service;
    private final ServletContext servletContext;
    private final TemplateEngine templateEngine;

    @GetMapping
    public ResponseEntity<?> getPDF(@RequestParam Long cardId, @RequestParam Long userId, HttpServletRequest request, HttpServletResponse response) {
        var card = service.calculateCardDataForPdf(cardId);
        var vehicle = service.retrieveVehicleDataForPdf(userId);

        var pdf = service.buildResponse(card, vehicle);

        WebContext context = new WebContext(request, response, servletContext);
        context.setVariable("pdf", pdf);

        String orderHtml = templateEngine.process("card", context);
        ByteArrayOutputStream target = new ByteArrayOutputStream();

        ConverterProperties converterProperties = new ConverterProperties();
        converterProperties.setBaseUri("http://localhost:8181");

        HtmlConverter.convertToPdf(orderHtml, target, converterProperties);

        byte[] bytes = target.toByteArray();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }
}
