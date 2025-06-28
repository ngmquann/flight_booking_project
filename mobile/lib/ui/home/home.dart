import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/data/model/home_response.dart';
import 'package:mobile/ui/home/home_view_model.dart';
import 'package:mobile/ui/search/search.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _formKey = GlobalKey<FormState>();
  String? departureAirport;
  String? arrivalAirport;
  String? seatClass;
  late String departureCode;
  late String arrivalCode;
  final _dateController = TextEditingController();

  late Future<HomeResponse?> _info;

  @override
  void initState() {
    super.initState();
    _info = HomeViewModel().getHomeInfo();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime now = DateTime.now();
    final DateTime initialDate = now;
    final DateTime firstDate = now;
    final DateTime lastDate = now.add(Duration(days: 365 * 10));

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: firstDate,
      lastDate: lastDate,
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xff12CDD9),
              onPrimary: Colors.white,
              surface: Color(0xff1f1d2b),
              onSurface: Colors.white,
            ),
            dialogBackgroundColor: const Color(0xff1f1d2b),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != initialDate) {
      setState(() {
        _dateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<HomeResponse?>(
      future: _info,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data == null) {
          return const Center(child: Text('No data available'));
        } else {
          var listDepart = snapshot.data!.airportResponses;
          var listArrival = snapshot.data!.airportResponses;

          List<String> listSeat = snapshot.data!.seatClasses;
          return Scaffold(
            backgroundColor: Color(0xfff5f5fa),
            body: CustomScrollView(
              slivers: [
                SliverAppBar(
                  expandedHeight: 150.0,
                  flexibleSpace: FlexibleSpaceBar(
                    stretchModes: const <StretchMode>[
                      StretchMode.zoomBackground,
                      StretchMode.blurBackground,
                    ],
                    background: Image.asset(
                      'assets/images/bg.png',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: Form(
                    key: _formKey,
                    child: Container(
                      margin: const EdgeInsets.all(20.0),
                      padding: const EdgeInsets.all(12.0),
                      height: 500,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8.0),
                          color: Colors.white,
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 10,
                              spreadRadius: 5,
                            ),
                          ]),
                      child: Column(
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.flight_takeoff_outlined),
                              const SizedBox(
                                width: 5.0,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Departure airport",
                                    style: TextStyle(fontSize: 15.0),
                                  ),
                                  SizedBox(
                                    width: 300,
                                    child: DropdownButton<String>(
                                      isExpanded: true,
                                      hint: const Text('Select airport'),
                                      value: departureAirport,
                                      icon: const Icon(Icons.arrow_drop_down),
                                      // elevation: 16,
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500),
                                      onChanged: (String? value) {
                                        final selectedAirport = listDepart.firstWhere(
                                              (airport) => airport.id.toString() == value,
                                          orElse: () => listDepart.first,
                                        );
                                        setState(() {
                                          departureAirport = value!;
                                          departureCode = selectedAirport.code;
                                        });
                                      },
                                      items: listDepart.map<DropdownMenuItem<String>>(
                                          (value) {
                                        return DropdownMenuItem<String>(
                                          value: value.id.toString(),
                                          child: Text(value.name),
                                        );
                                      }).toList(),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 8.0,
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.flight_land_outlined),
                              const SizedBox(
                                width: 5.0,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Arrival airport",
                                    style: TextStyle(fontSize: 15.0),
                                  ),
                                  SizedBox(
                                    width: 300,
                                    child: DropdownButton<String>(
                                      isExpanded: true,
                                      hint: const Text('Select airport'),
                                      value: arrivalAirport,
                                      icon: const Icon(Icons.arrow_drop_down),
                                      // elevation: 16,
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500),
                                      onChanged: (String? value) {
                                        final selectedAirport = listDepart.firstWhere(
                                              (airport) => airport.id.toString() == value,
                                          orElse: () => listDepart.first,
                                        );

                                        setState(() {
                                          arrivalAirport = value!;
                                          arrivalCode = selectedAirport.code;
                                        });
                                      },
                                      items: listArrival.map<DropdownMenuItem<String>>(
                                          (value) {
                                        return DropdownMenuItem<String>(
                                          value: value.id.toString(),
                                          child: Text(value.name),
                                        );
                                      }).toList(),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 8.0,
                          ),
                          Divider(
                            color: Colors.grey.shade300,
                          ),
                          const SizedBox(
                            height: 8.0,
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.calendar_month_outlined),
                              const SizedBox(
                                width: 5.0,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Departure date",
                                    style: TextStyle(fontSize: 15.0),
                                  ),
                                  SizedBox(
                                    width: 300,
                                    child: GestureDetector(
                                      onTap: () => _selectDate(context),
                                      child: AbsorbPointer(
                                        child: TextFormField(
                                          controller: _dateController,
                                          decoration: const InputDecoration(
                                            contentPadding:
                                                EdgeInsets.symmetric(
                                                    vertical: 8.0,
                                                    horizontal: 10.0),
                                            labelStyle: TextStyle(
                                                color: Colors.black,
                                                fontSize: 15),
                                            hintText: 'YYYY-MM-DD',
                                            hintStyle:
                                                TextStyle(color: Colors.grey),
                                            filled: true,
                                            fillColor: Colors.transparent,
                                          ),
                                          style: const TextStyle(
                                              color: Colors.black),
                                          validator: (value) {
                                            if (value == null ||
                                                value.isEmpty) {
                                              return 'Please enter departure date';
                                            }
                                            return null;
                                          },
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 14.0,
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.chair),
                              const SizedBox(
                                width: 5.0,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Seat class",
                                    style: TextStyle(fontSize: 15.0),
                                  ),
                                  SizedBox(
                                    width: 300,
                                    child: DropdownButton<String>(
                                      isExpanded: true,
                                      hint: const Text('Select seat class'),
                                      value: seatClass,
                                      icon: const Icon(Icons.arrow_drop_down),
                                      // elevation: 16,
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500),
                                      onChanged: (String? value) {
                                        setState(() {
                                          seatClass = value!;
                                        });
                                      },
                                      items: listSeat.map<DropdownMenuItem<String>>(
                                              (value) {
                                            return DropdownMenuItem<String>(
                                              value: value,
                                              child: Text(value),
                                            );
                                          }).toList(),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 12.0,
                          ),
                          Divider(
                            color: Colors.grey.shade300,
                          ),
                          const SizedBox(
                            height: 30.0,
                          ),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                if(_formKey.currentState?.validate() ?? false){
                                  if (departureAirport == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Please select a departure airport')),
                                    );
                                    return;
                                  }
                                  if (arrivalAirport == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Please select an arrival airport')),
                                    );
                                    return;
                                  }
                                  if (seatClass == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Please select a seat class')),
                                    );
                                    return;
                                  }

                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => SearchPage(departureAirport: int.parse(departureAirport!), arrivalAirport: int.parse(arrivalAirport!), departureTime: _dateController.text, seatClass: seatClass!, departCode: departureCode, arriCode: arrivalCode,)),
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xff007aff),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: const Text(
                                'Search',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        }
      },
    );
  }
}
