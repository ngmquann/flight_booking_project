import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile/data/model/airport_response.dart';

abstract class AirportRepository {
  Future<AirportResponse> getAirport(int id);
}

class AirportRepositoryImpl implements AirportRepository {
  @override
  Future<AirportResponse> getAirport(int id) async {
    String url = 'http://10.0.2.2:8081/api/airport/' + id.toString();
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      if (jsonData != null) {
        return AirportResponse.fromJson(jsonData);
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }
}