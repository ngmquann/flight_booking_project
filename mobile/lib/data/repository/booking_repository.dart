import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile/data/model/info_booking_response.dart';
import 'package:mobile/data/repository/token_repository.dart';

abstract class BookingRepository {
  Future<InfoBookingResponse> getInfoBooking(int flightId, String seatClass);
}

class BookingRepositoryImpl implements BookingRepository {
  @override
  Future<InfoBookingResponse> getInfoBooking(
      int flightId, String seatClass) async {
    TokenRepository tokenRepository = TokenRepository();
    var token = await tokenRepository.getToken();
    String url =
        'http://10.0.2.2:8081/api/flight/get-info-flight/${flightId.toString()}/${seatClass}';
    final response = await http.get(Uri.parse(url), headers: {
      'Authorization': 'Bearer $token',
    });
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      if (jsonData != null) {
        return InfoBookingResponse.fromJson(jsonData);
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }
}
