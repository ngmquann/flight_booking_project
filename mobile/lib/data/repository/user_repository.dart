import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/data/model/profile_request.dart';
import 'package:mobile/data/model/user_response.dart';
import 'package:mobile/data/repository/token_repository.dart';

abstract class UserRepository {
  Future<UserResponse> getUserInfo();
  Future<String> updateProfile(ProfileRequest profileRequest);
}

class UserRepositoryImpl implements UserRepository {
  @override
  Future<UserResponse> getUserInfo() async {
    TokenRepository tokenRepository = TokenRepository();
    var token = await tokenRepository.getToken();

    String url = 'http://10.0.2.2:8081/api/user/profile';
    final response = await http.get(Uri.parse(url), headers: {
      'Authorization': 'Bearer $token',
    });
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      if (jsonData != null) {
        return UserResponse.fromJson(jsonData);
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }

  @override
  Future<String> updateProfile(ProfileRequest profileRequest) async {
    TokenRepository tokenRepository = TokenRepository();
    var token = await tokenRepository.getToken();

    String url = 'http://10.0.2.2:8081/api/user/profile';
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode(profileRequest.toJson()),
    );
    if (response.statusCode == 200) {
      if (response.body != null) {
        return response.body;
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }
}
