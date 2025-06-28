class LuggageResponse {
  int id;
  String luggageType;
  double weight;
  double price;

  LuggageResponse({
    required this.id,
    required this.luggageType,
    required this.weight,
    required this.price,
  });

  factory LuggageResponse.fromJson(Map<String, dynamic> json) {
    return LuggageResponse(
      id: json['id'],
      luggageType: json['luggageType'],
      weight: json['weight'],
      price: json['price'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'luggageType': luggageType,
      'weight': weight,
      'price': price,
    };
  }
}