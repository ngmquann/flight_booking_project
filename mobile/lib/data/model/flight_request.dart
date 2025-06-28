class FlightRequest {
  int departureAirport;
  int arrivalAirport;
  String departureTime;
  String seatClass;

  FlightRequest({
    required this.departureAirport,
    required this.arrivalAirport,
    required this.departureTime,
    required this.seatClass,
  });

  factory FlightRequest.fromJson(Map<String, dynamic> json) {
    return FlightRequest(
      departureAirport: json['departureAirport'],
      arrivalAirport: json['arrivalAirport'],
      departureTime: json['departureTime'],
      seatClass: json['seatClass'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'departureAirport': departureAirport,
      'arrivalAirport': arrivalAirport,
      'departureTime': departureTime,
      'seatClass': seatClass,
    };
  }
}
