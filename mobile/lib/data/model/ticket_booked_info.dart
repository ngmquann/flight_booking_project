class TicketBookedInfo {
  int ticketId;
  double price;
  String seatNumber;
  String flightCode;
  DateTime? arrivalTime;
  DateTime? departureTime;
  String arrivalAirportName;
  String departureAirportName;
  String airlineName;
  double luggage;

  TicketBookedInfo({
    required this.ticketId,
    required this.price,
    required this.seatNumber,
    required this.flightCode,
    required this.arrivalTime,
    required this.departureTime,
    required this.arrivalAirportName,
    required this.departureAirportName,
    required this.airlineName,
    required this.luggage,
  });

  factory TicketBookedInfo.fromJson(Map<String, dynamic> json) {
    return TicketBookedInfo(
      ticketId: json["ticketId"],
      price: json["price"],
      seatNumber: json["seatNumber"],
      flightCode: json["flightCode"],
      arrivalTime: json['arrivalTime'] != null ? DateTime.parse(json['arrivalTime']) : null,
      departureTime: json['departureTime'] != null ? DateTime.parse(json['departureTime']) : null,
      arrivalAirportName: json["arrivalAirportName"],
      departureAirportName: json["departureAirportName"],
      airlineName: json["airlineName"],
      luggage: json["luggage"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "ticketId": ticketId,
      "price": price,
      "seatNumber": seatNumber,
      "flightCode": flightCode,
      "arrivalTime": arrivalTime,
      "departureTime": departureTime,
      "arrivalAirportName": arrivalAirportName,
      "departureAirportName": departureAirportName,
      "airlineName": airlineName,
      "luggage": luggage,
    };
  }

  static List<TicketBookedInfo> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => TicketBookedInfo.fromJson(json)).toList();
  }
}