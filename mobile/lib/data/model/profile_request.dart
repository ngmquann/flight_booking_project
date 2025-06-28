class ProfileRequest{
  String fullName;
  String email;
  String phoneNumber;
  String address;
  String dateOfBirth;

  ProfileRequest({
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.address,
    required this.dateOfBirth,
  });

  factory ProfileRequest.fromJson(Map<String, dynamic> json) {
    return ProfileRequest(
      fullName: json["fullName"],
      email: json["email"],
      phoneNumber: json["phoneNumber"],
      address: json["address"],
      dateOfBirth: json["dateOfBirth"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "fullName": fullName,
      "email": email,
      "phoneNumber": phoneNumber,
      "address": address,
      "dateOfBirth": dateOfBirth,
    };
  }
}