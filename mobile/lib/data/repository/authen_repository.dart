import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile/data/model/login_request.dart';
import 'package:mobile/data/model/login_token.dart';
import 'package:mobile/data/model/sign_up.dart';

abstract class AuthenRepository {
  Future<LoginToken?> signin(LoginRequest loginRequest);

  Future<String?> signup(SignUp signUp);
}

class AuthenRepoImpl implements AuthenRepository {
  @override
  Future<LoginToken?> signin(LoginRequest loginRequest) async {
    const url = 'http://10.0.2.2:8081/api/auth/login';
    final uri = Uri.parse(url);
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(loginRequest.toJson()),
    );
    if (response.statusCode == 200) {
      final bodyContent = utf8.decode(response.bodyBytes);

      var jDe = jsonDecode(bodyContent);
      return LoginToken.fromJson(jDe);
    } else {
      final errorBody = utf8.decode(response.bodyBytes);
      final errorData = jsonDecode(errorBody) as Map<String, dynamic>;
      throw Exception(errorData['message']);
    }
  }

  @override
  Future<String?> signup(SignUp signUp) async {
    const url = 'http://10.0.2.2:8081/api/auth/signup';
    final uri = Uri.parse(url);

    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: jsonEncode(signUp.toJson()),
    );

    if (response.statusCode == 200) {
      final bodyContent = utf8.decode(response.bodyBytes);

      return bodyContent;
    } else {
      final errorBody = utf8.decode(response.bodyBytes);
      final errorData = jsonDecode(errorBody) as Map<String, dynamic>;
      throw Exception(errorData['message']);
    }
  }
}