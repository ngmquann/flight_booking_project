class AirportResponse {
  int id;
  String name;
  String location;
  String code;

  AirportResponse({required this.id, required this.name, required this.location, required this.code});

  factory AirportResponse.fromJson(Map<String, dynamic> json) {
    return AirportResponse(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      code: json['code'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'code': code,
    };
  }
}