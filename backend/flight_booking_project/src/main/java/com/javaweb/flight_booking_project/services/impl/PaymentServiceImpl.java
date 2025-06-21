package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.configuration.ConfigVNPay;
import com.javaweb.flight_booking_project.converter.SeatConverter;
import com.javaweb.flight_booking_project.dto.MailBody;
import com.javaweb.flight_booking_project.dto.request.TicketBookingRequest;
import com.javaweb.flight_booking_project.dto.request.TicketRequest;
import com.javaweb.flight_booking_project.dto.response.InfoBookingResponse;
import com.javaweb.flight_booking_project.dto.response.LuggageResponse;
import com.javaweb.flight_booking_project.dto.response.SeatResponse;
import com.javaweb.flight_booking_project.dto.response.TicketBookedInfo;
import com.javaweb.flight_booking_project.models.*;
import com.javaweb.flight_booking_project.repositories.*;
import com.javaweb.flight_booking_project.services.EmailService;
import com.javaweb.flight_booking_project.services.PaymentService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static com.javaweb.flight_booking_project.configuration.ConfigVNPay.vnp_Command;
import static com.javaweb.flight_booking_project.configuration.ConfigVNPay.vnp_Version;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private LuggageRepository luggageRepository;

    @Autowired
    private RevenueRepository revenueRepository;

    @Override
    public String createPayment(TicketRequest ticketRequest) throws Exception{
        FlightEntity flight = flightRepository.findById(ticketRequest.getFlightId()).orElseThrow( ()-> new Exception("Flight not found") );

        List<SeatEntity> seatEntityList = seatRepository.findByFlightId(flight.getId(),ticketRequest.getSeatCLass());
        SeatEntity seat = null;
        if (!seatEntityList.isEmpty()) {
             seat = seatEntityList.get(0);
        } else {
            throw new IllegalStateException("No available seats found for the given criteria.");
        }

        double price = 0;
        if(seat.isAvailable()){
            price = seat.getSeatClass().equals("Economy Class") ? flight.getEcoPrice() : flight.getBusPrice();
        } else {
            throw new Exception("Seat not available");
        }

        LuggageEntity luggageEntity;
        if(ticketRequest.getLuggageId() != null){
            luggageEntity = luggageRepository.findById(ticketRequest.getLuggageId()).orElseThrow(() -> new Exception("Luggage not found"));
            price += luggageEntity.getPrice();
        }

        String orderType = "other";
        long amount = (long) price*100;

        String vnp_TxnRef = ConfigVNPay.getRandomNumber(8);

        String vnp_TmnCode = ConfigVNPay.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        String returnUrl = ConfigVNPay.vnp_ReturnUrl;
        returnUrl += "?flightId=" + ticketRequest.getFlightId() + "&seatId=" + seat.getId();

        if(ticketRequest.getLuggageId() != null && ticketRequest.getLuggageId() != 0){
            returnUrl += "&luggageId=" + ticketRequest.getLuggageId();
        }

        returnUrl += "&name=" + ticketRequest.getName() + "&email=" + ticketRequest.getEmail() + "&phone=" + ticketRequest.getPhone();

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity user = userRepository.findByEmail(userDetails.getUsername());

        returnUrl += "&userId=" + user.getId();

        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigVNPay.hmacSHA512(ConfigVNPay.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = ConfigVNPay.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    public void bookTicket(TicketBookingRequest ticketRequest, Long id, Float vnp_Amount) throws Exception {
        UserEntity user = userRepository.findById(id).get();
        FlightEntity flight = flightRepository.findById(ticketRequest.getFlightId()).orElseThrow( ()-> new Exception("Flight not found") );

        SeatEntity seat = seatRepository.findById(ticketRequest.getSeatId()).orElseThrow(() -> new Exception("Seat not found or unavailable"));

        LuggageEntity luggageEntity = null;
        if(ticketRequest.getLuggageId() != null){
            luggageEntity = luggageRepository.findById(ticketRequest.getLuggageId()).orElseThrow(() -> new Exception("Luggage not found"));
        }

        TicketEntity ticketEntity = TicketEntity.builder()
                .flightEntity(flight)
                .userEntity(user)
                .seat(seat)
                .price(vnp_Amount / 100)
                .luggageEntity(luggageEntity)
                .phone(ticketRequest.getPhone())
                .email(ticketRequest.getEmail())
                .name(ticketRequest.getName())
                .createAt(LocalDate.now())
                .build();

        LocalDate today = LocalDate.now();
        BigDecimal ticketRevenue = BigDecimal.valueOf(vnp_Amount / 100);

        Optional<RevenueEntity> optionalRevenue = revenueRepository.findByDate(today);
        if (optionalRevenue.isPresent()) {
            RevenueEntity revenue = optionalRevenue.get();
            revenue.setTotalRevenue(revenue.getTotalRevenue().add(ticketRevenue));
            revenueRepository.save(revenue);
        } else {
            RevenueEntity newRevenue = RevenueEntity.builder()
                    .date(today)
                    .totalRevenue(ticketRevenue)
                    .build();
            revenueRepository.save(newRevenue);
        }
        TicketEntity result = ticketRepository.save(ticketEntity);
        if(result.getId() != null){
            seat.setAvailable(false);
            seatRepository.save(seat);

            TicketBookedInfo bookedInfo = new TicketBookedInfo();
            bookedInfo.setTicketId(result.getId());
            bookedInfo.setPrice(result.getPrice());
            bookedInfo.setSeatNumber(seatRepository.findById(ticketRequest.getSeatId()).get().getSeatNumber());
            bookedInfo.setFlightCode(result.getFlightEntity().getCode());
            bookedInfo.setDepartureTime(result.getFlightEntity().getDepartureTime());
            bookedInfo.setArrivalTime(result.getFlightEntity().getArrivalTime());
            bookedInfo.setArrivalAirportName(airportRepository.findById(result.getFlightEntity().getArrivalId()).get().getName());
            bookedInfo.setDepartureAirportName(airportRepository.findById(result.getFlightEntity().getDepartureId()).get().getName());
            bookedInfo.setAirlineName(result.getFlightEntity().getPlaneEntity().getAirlineEntity().getName());
            sendEmail(bookedInfo, ticketRequest);
        }
    }

    public void sendEmail(TicketBookedInfo ticketBookedInfo, TicketBookingRequest ticket) throws MessagingException {
        Map<String, Object> placeholders = new HashMap<>();
        placeholders.put("name", ticket.getName());
        placeholders.put("ticketId", ticketBookedInfo.getTicketId());
        placeholders.put("price", ticketBookedInfo.getPrice());
        placeholders.put("seatNumber", ticketBookedInfo.getSeatNumber());
        placeholders.put("flightCode", ticketBookedInfo.getFlightCode());
        placeholders.put("arrivalTime", ticketBookedInfo.getArrivalTime());
        placeholders.put("departureTime", ticketBookedInfo.getDepartureTime());
        placeholders.put("arrivalAirportName", ticketBookedInfo.getArrivalAirportName());
        placeholders.put("departureAirportName", ticketBookedInfo.getDepartureAirportName());
        placeholders.put("airlineName", ticketBookedInfo.getAirlineName());

        MailBody mailBody = MailBody.builder()
                .to(ticket.getEmail())
                .subject("Your Ticket Purchase Confirmation")
                .props(placeholders)
                .build();
        emailService.sendHtmlMail(mailBody, "email_template_ticketpurchase");
    }
}
