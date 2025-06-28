import 'package:mobile/data/model/plane_response.dart';

class FlightResponse {
  int id;
  String codeFlight;
  DateTime? departureTime;
  DateTime? arrivalTime;
  String departureAirport;
  String departureLocation;
  String arrivalLocation;
  String arrivalAirport;
  String airline;
  String logoAirline;
  PlaneResponse plane;
  double ecoPrice;
  double busPrice;

  FlightResponse({
    required this.id,
    required this.codeFlight,
    required this.departureTime,
    required this.arrivalTime,
    required this.departureAirport,
    required this.departureLocation,
    required this.arrivalLocation,
    required this.arrivalAirport,
    required this.airline,
    required this.logoAirline,
    required this.plane,
    required this.ecoPrice,
    required this.busPrice,
  });

  factory FlightResponse.fromJson(Map<String, dynamic> json) {
    return FlightResponse(
      id: json['id'],
      codeFlight: json['codeFlight'],
      departureTime: json['departureTime'] != null
          ? DateTime.parse(json['departureTime'])
          : null,
      arrivalTime: json['arrivalTime'] != null
          ? DateTime.parse(json['arrivalTime'])
          : null,
      departureAirport: json['departureAirport'],
      departureLocation: json['departureLocation'],
      arrivalLocation: json['arrivalLocation'],
      arrivalAirport: json['arrivalAirport'],
      airline: json['airline'],
      logoAirline: json['logoAirline'],
      plane: PlaneResponse.fromJson(json['plane']),
      ecoPrice: json['ecoPrice'],
      busPrice: json['busPrice'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'codeFlight': codeFlight,
      'departureTime': departureTime,
      'arrivalTime': arrivalTime,
      'departureAirport': departureAirport,
      'departureLocation': departureLocation,
      'arrivalLocation': arrivalLocation,
      'arrivalAirport': arrivalAirport,
      'airline': airline,
      'logoAirline': logoAirline,
      'plane': plane,
      'ecoPrice': ecoPrice,
      'busPrice': busPrice,
    };
  }

  static List<FlightResponse> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => FlightResponse.fromJson(json)).toList();
  }
}
