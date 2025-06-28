import 'package:mobile/data/model/ticket_booked_info.dart';

class UserResponse {
  String fullName;
  String email;
  String phoneNumber;
  String address;
  DateTime? dateOfBirth;
  List<TicketBookedInfo> bookingList;

  UserResponse({
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.address,
    required this.dateOfBirth,
    required this.bookingList,
  });

  factory UserResponse.fromJson(Map<String, dynamic> json) {
    return UserResponse(
      fullName: json["fullName"],
      email: json["email"],
      phoneNumber: json["phoneNumber"],
      address: json["address"],
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'])
          : null,
      bookingList: List<TicketBookedInfo>.from(
          json['bookingList'].map((x) => TicketBookedInfo.fromJson(x))),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "fullName": fullName,
      "email": email,
      "phoneNumber": phoneNumber,
      "address": address,
      "dateOfBirth": dateOfBirth,
      "bookingList": List<dynamic>.from(bookingList.map((x) => x.toJson())),
    };
  }
}
