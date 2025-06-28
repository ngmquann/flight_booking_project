import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile/data/model/flight_request.dart';
import 'package:mobile/data/model/flight_response.dart';

abstract class FlightRepository {
  Future<List<FlightResponse>> searchFlight(FlightRequest flightRequest);
}

class FlightRepositoryImpl implements FlightRepository {
  @override
  Future<List<FlightResponse>> searchFlight(FlightRequest flightRequest) async {
    String url = 'http://10.0.2.2:8081/api/flight/search';
    final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(flightRequest.toJson()),
    );
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      if (jsonData != null) {
        return FlightResponse.fromJsonList(jsonData);
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }
}