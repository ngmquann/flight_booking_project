class SeatResponse {
  int id;
  String seatNumber;
  String seatClass;
  double price;

  SeatResponse({
    required this.id,
    required this.seatNumber,
    required this.seatClass,
    required this.price,
  });

  factory SeatResponse.fromJson(Map<String, dynamic> json) {
    return SeatResponse(
      id: json['id'],
      seatNumber: json['seatNumber'],
      seatClass: json['seatClass'],
      price: json['price'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'seatNumber': seatNumber,
      'seatClass': seatClass,
      'price': price,
    };
  }
}