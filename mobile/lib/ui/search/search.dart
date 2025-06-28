import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/data/model/flight_request.dart';
import 'package:mobile/data/model/flight_response.dart';
import 'package:mobile/data/repository/flight_repository.dart';
import 'package:mobile/data/repository/token_repository.dart';
import 'package:mobile/ui/booking/booking_page.dart';
import 'package:mobile/ui/login/login_page.dart';
import 'package:mobile/ui/search/date_selection.dart';

class SearchPage extends StatefulWidget {
  int departureAirport;
  int arrivalAirport;
  String departureTime;
  String seatClass;
  String departCode;
  String arriCode;

  SearchPage({
    required this.departureAirport,
    required this.arrivalAirport,
    required this.departureTime,
    required this.seatClass,
    required this.departCode,
    required this.arriCode,
    super.key,
  });

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  Future<List<FlightResponse>>? flights;
  List<String> dateNumbers = [];
  List<String> weekdays = [];
  late int selectedDateIndex;
  late String parseDate;

  @override
  void initState() {
    super.initState();

    DateTime departureDate = DateTime.parse(widget.departureTime);
    DateTime today = DateTime.now();
    parseDate = DateFormat('dd-MM-yyyy').format(departureDate);

    today = DateTime(today.year, today.month, today.day);
    departureDate =
        DateTime(departureDate.year, departureDate.month, departureDate.day);

    List<String> newDateNumbers = [];
    List<String> newWeekdays = [];

    int daysToShow = 7;
    for (int i = 0; i < daysToShow; i++) {
      DateTime currentDate = today.add(Duration(days: i));

      String formattedDate =
          "${currentDate.day.toString().padLeft(2, '0')}/${currentDate.month.toString().padLeft(2, '0')}";

      String weekday = _getWeekdayAbbreviation(currentDate.weekday);

      newDateNumbers.add(formattedDate);
      newWeekdays.add(weekday);
    }

    selectedDateIndex = newDateNumbers.indexOf(
        "${departureDate.day.toString().padLeft(2, '0')}/${departureDate.month.toString().padLeft(2, '0')}");

    if (selectedDateIndex == -1) {
      selectedDateIndex = 0;
    }

    dateNumbers = newDateNumbers;
    weekdays = newWeekdays;

    FlightRequest flightRequest = FlightRequest(
      departureAirport: widget.departureAirport,
      arrivalAirport: widget.arrivalAirport,
      departureTime: parseDate,
      seatClass: widget.seatClass,
    );
    flights = FlightRepositoryImpl().searchFlight(flightRequest);
  }

  String _getWeekdayAbbreviation(int weekday) {
    switch (weekday) {
      case DateTime.monday:
        return 'MON';
      case DateTime.tuesday:
        return 'TUE';
      case DateTime.wednesday:
        return 'WED';
      case DateTime.thursday:
        return 'THU';
      case DateTime.friday:
        return 'FRI';
      case DateTime.saturday:
        return 'SAT';
      case DateTime.sunday:
        return 'SUN';
      default:
        return '';
    }
  }

  void _handleBook(int id, String seatClass, double price) async {
    TokenRepository tokenRepository = TokenRepository();
    String? token = await tokenRepository.getToken();

    if (token == null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => LoginPage(),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BookingPage(
            id: id,
            seatClass: seatClass,
            price: price,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff1A94FF),
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          "Chuyen di ${widget.departCode} - ${widget.arriCode}",
          style: const TextStyle(
              color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      backgroundColor: const Color(0xffF5F5FA),
      body: Column(
        children: [
          DateSelection(
            dateNumbers: dateNumbers,
            weekdays: weekdays,
            selectedDateIndex: selectedDateIndex,
            onDateSelected: (index) {
              setState(() {
                selectedDateIndex = index;
                String newDate =
                    "${dateNumbers[selectedDateIndex].replaceAll('/', '-')}-2024";
                FlightRequest newFlight = FlightRequest(
                  departureAirport: widget.departureAirport,
                  arrivalAirport: widget.arrivalAirport,
                  departureTime: newDate,
                  seatClass: widget.seatClass,
                );
                flights = FlightRepositoryImpl().searchFlight(newFlight);
              });
            },
          ),
          // FutureBuilder chỉ wrap phần content cần thay đổi
          Expanded(
            child: FutureBuilder<List<FlightResponse>>(
              future: flights,
              builder: (BuildContext context,
                  AsyncSnapshot<List<FlightResponse>> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data == null) {
                  return const Center(child: Text('No data available'));
                }

                final flight = snapshot.data;

                if (flight == null || flight.isEmpty) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/images/not_found.png'),
                      const Text(
                        "Không tìm thấy chuyến bay",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const Text(
                        "Xin vui lòng chọn tìm kiếm khác",
                        style: TextStyle(fontSize: 14),
                      ),
                    ],
                  );
                }

                return SingleChildScrollView(
                  child: ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: flight.length,
                    itemBuilder: (BuildContext context, int index) {
                      final item = flight[index];
                      
                      // Uint8List _bytes =
                      //     const Base64Decoder().convert(item.logoAirline.substring(23));

                      String base64Image = item.logoAirline;
                      Uint8List bytes = const Base64Decoder().convert(base64Image.split(',').last);
                      return Container(
                        padding: const EdgeInsets.all(16.0),
                        margin: const EdgeInsets.only(
                            top: 16.0, left: 10.0, right: 10.0, bottom: 16.0),
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12.0),
                            color: Colors.white,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.2),
                                blurRadius: 6.0,
                                offset: const Offset(0, 3),
                              ),
                            ]),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "${item.departureTime!.hour.toString().padLeft(2, '0')}:${item.departureTime!.minute.toString().padLeft(2, '0')}",
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(widget.departCode),
                                  ],
                                ),
                                const Column(
                                  children: [
                                    Icon(Icons.arrow_right_alt_outlined),
                                    Text('Bay thẳng'),
                                  ],
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      "${item.arrivalTime!.hour.toString().padLeft(2, '0')}:${item.arrivalTime!.minute.toString().padLeft(2, '0')}",
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(widget.arriCode),
                                  ],
                                ),
                                Text(
                                  "${NumberFormat('#,###', 'vi_VN').format(widget.seatClass == "Business Class" ? item.busPrice : item.ecoPrice)} đ",
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            Divider(
                              thickness: 1,
                              height: 24,
                              color: Colors.grey[300],
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Image.memory(
                                      bytes,
                                      width: 50,
                                      height: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                        "${item.airline} - ${widget.seatClass.replaceAll("Class", "")}"),
                                  ],
                                ),
                                ElevatedButton(
                                  onPressed: () =>
                                      _handleBook(item.id, widget.seatClass, widget.seatClass == "Business Class" ? item.busPrice : item.ecoPrice),
                                  style: ButtonStyle(
                                      shape: MaterialStateProperty.all<
                                              RoundedRectangleBorder>(
                                          RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                              side: const BorderSide(
                                                  color: Color(0xff1A94FF)))),
                                      backgroundColor:
                                          MaterialStateProperty.all<Color>(
                                              const Color(0xff1A94FF))),
                                  child: const Text(
                                    "Book now",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
