package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.dto.MailBody;
import com.javaweb.flight_booking_project.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@Service
public class EmailServiceImpl implements EmailService {
    @Value("${spring.mail.username}")
    private String mail;

    @Autowired
    private final JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendHtmlMail(MailBody mailBody, String templateName) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

        Context context = new Context();
        context.setVariables(mailBody.props());

        String html = templateEngine.process(templateName, context);

        helper.setTo(mailBody.to());
        helper.setSubject(mailBody.subject());
        helper.setText(html, true);

        javaMailSender.send(message);
    }
}
