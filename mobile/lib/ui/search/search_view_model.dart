import 'package:mobile/data/model/airport_response.dart';
import 'package:mobile/data/repository/airport_repository.dart';

class SearchViewModel {
  final AirportRepositoryImpl airportRepo = AirportRepositoryImpl();

  Future<AirportResponse?> getAirport(int id) async {
    try {
      final result = await airportRepo.getAirport(id);
      return result;
    } catch (e) {
      throw e;
    }
  }
}