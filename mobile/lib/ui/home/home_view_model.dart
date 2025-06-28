import 'package:mobile/data/model/home_response.dart';
import 'package:mobile/data/repository/home_repository.dart';

class HomeViewModel {
  final HomeRepositoryImpl homeRepo = HomeRepositoryImpl();

  Future<HomeResponse?> getHomeInfo() async {
    try {
      final result = await homeRepo.getHomeInfo();
      return result;
    } catch (e) {
      throw e;
    }
  }
}