class SignUp {
  final String email;
  final String name;
  final String phone;
  final String password;
  final String address;
  final String dob;

  SignUp({
    required this.email,
    required this.name,
    required this.phone,
    required this.address,
    required this.password,
    required this.dob,
  });

  factory SignUp.fromJson(Map<String, dynamic> json) {
    return SignUp(
      email: json['email'],
      name: json['full_name'],
      phone: json['phone_number'],
      address: json['address'],
      password: json['password'],
      dob: json['date_of_birth'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'full_name': name,
      'phone_number': phone,
      'address': address,
      'password': password,
      'date_of_birth': dob,
    };
  }

  @override
  String toString() {
    return 'SignUp(email: $email, name: $name, phone: $phone, address: $address, password: $password, dob: $dob)';
  }
}
