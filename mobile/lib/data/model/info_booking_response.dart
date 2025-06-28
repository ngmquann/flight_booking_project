import 'package:mobile/data/model/luggage_response.dart';
import 'package:mobile/data/model/seat_response.dart';

class InfoBookingResponse{
  List<SeatResponse> seatList;
  List<LuggageResponse> luggageList;

  InfoBookingResponse({
    required this.seatList,
    required this.luggageList,
  });

  factory InfoBookingResponse.fromJson(Map<String, dynamic> json) {
    return InfoBookingResponse(
      seatList: (json['seatList'] as List?)!
          .map((x) => SeatResponse.fromJson(x))
          .toList(),
      luggageList: (json['luggageList'] as List?)!
          .map((item) => LuggageResponse.fromJson(item))
          .toList(),
    );
  }
}