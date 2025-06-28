import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/data/model/home_response.dart';

abstract class HomeRepository {
  Future<HomeResponse> getHomeInfo();
}

class HomeRepositoryImpl implements HomeRepository{
  @override
  Future<HomeResponse> getHomeInfo() async{
    String url = 'http://10.0.2.2:8081/api/home';
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      if (jsonData != null) {
        return HomeResponse.fromJson(jsonData);
      } else {
        throw Exception('Unexpected JSON structure');
      }
    } else {
      throw Exception('Failed to load API');
    }
  }
}