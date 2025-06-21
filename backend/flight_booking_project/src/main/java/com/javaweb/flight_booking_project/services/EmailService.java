package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.MailBody;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendHtmlMail(MailBody mailBody, String templateName) throws MessagingException;
}
