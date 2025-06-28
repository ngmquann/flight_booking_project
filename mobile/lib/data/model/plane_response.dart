class PlaneResponse{
  int id;
  int ecoClass;
  int busClass;
  String name;

  PlaneResponse({required this.id, required this.name, required this.ecoClass, required this.busClass});

  factory PlaneResponse.fromJson(Map<String, dynamic> json) {
    return PlaneResponse(
      id: json['id'],
      name: json['name'],
      ecoClass: json['ecoClass'],
      busClass: json['busClass'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'ecoClass': ecoClass,
      'busClass': busClass,
    };
  }
}