class TicketRequest {
  int seatId;
  String? seatClass;
  int flightId;
  int? luggageId;
  String name;
  String phone;
  String email;

  TicketRequest({
    required this.seatId,
    required this.seatClass,
    required this.flightId,
    required this.luggageId,
    required this.name,
    required this.phone,
    required this.email,
  });

  factory TicketRequest.fromJson(Map<String, dynamic> json) {
    return TicketRequest(
      seatId: json['seat_id'],
      seatClass: json['seatClass'],
      flightId: json['flight_id'],
      luggageId: json['luggage'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'seatId': seatId,
      'seatCLass': seatClass,
      'flightId': flightId,
      'luggageId': luggageId,
      'name': name,
      'phone': phone,
      'email': email,
    };
  }
}
