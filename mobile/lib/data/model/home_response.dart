import 'package:mobile/data/model/airport_response.dart';

class HomeResponse {
  List<AirportResponse> airportResponses;
  List<String> seatClasses;

  HomeResponse({
    required this.airportResponses,
    required this.seatClasses,
  });

  factory HomeResponse.fromJson(Map<String, dynamic> json) {
    return HomeResponse(
      airportResponses: (json['airportResponses'] as List?)!
          .map((x) => AirportResponse.fromJson(x))
          .toList(),
      seatClasses: (json['seatClasses'] as List?)!
          .map((item) => item as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'airportResponses': airportResponses.map((x) => x.toJson()).toList(),
      'seatClasses': seatClasses,
    };
  }
}
