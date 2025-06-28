class User {
  String? name;
  String email;
  String role;

  User({
    required this.name,
    required this.email,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json["name"],
      email: json["email"],
      role: json["role"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "name": this.name,
      "email": this.email,
      "role": this.role,
    };
  }

  @override
  String toString() {
    return 'User{name: $name, email: $email, role: $role}';
  }
}
