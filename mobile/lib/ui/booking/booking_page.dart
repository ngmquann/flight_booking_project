import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/data/model/info_booking_response.dart';
import 'package:mobile/data/model/ticket_request.dart';
import 'package:mobile/data/repository/token_repository.dart';
import 'package:mobile/ui/booking/booking_view_model.dart';
import 'package:mobile/ui/booking/transaction_success.dart';
import 'package:mobile/ui/vnpay_checkout_view/payment_service.dart';

class BookingPage extends StatefulWidget {
  int id;
  String seatClass;
  double price;
  BookingPage({
    required this.id,
    required this.seatClass,
    required this.price,
    super.key,
  });

  @override
  State<BookingPage> createState() => _BookingPageState();
}

class _BookingPageState extends State<BookingPage> {
  final _formKey = GlobalKey<FormState>();
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();

  String? seatId;
  String? luggageId;
  double priceLuggage = 0;
  String _selectedPaymentMethod = "";

  late Future<InfoBookingResponse?> _info;

  @override
  void initState() {
    super.initState();
    _info = BookingViewModel().getInfoBooking(widget.id, widget.seatClass);
  }

  @override
  Widget build(BuildContext context) {
    TokenRepository tokenRepository = TokenRepository();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff1A94FF),
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          "Booking page",
          style: TextStyle(
              color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      backgroundColor: const Color(0xffF5F5FA),
      body: FutureBuilder<InfoBookingResponse?>(
        future: _info,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text('No data available'));
          } else {
            var listSeat = snapshot.data!.seatList;
            var listLuggage = snapshot.data!.luggageList;

            return SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Container(
                  margin: const EdgeInsets.all(20.0),
                  padding: const EdgeInsets.all(12.0),
                  height: 590,
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
                      TextFormField(
                        controller: nameController,
                        decoration: InputDecoration(
                          labelText: "Name",
                          labelStyle: const TextStyle(
                              color: Colors.black, fontSize: 18),
                          hintStyle: const TextStyle(color: Colors.white),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xffF5F5FA),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xff5e5959),
                              width: 2.0,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      TextFormField(
                        controller: emailController,
                        decoration: InputDecoration(
                          labelText: "Email",
                          labelStyle: const TextStyle(
                              color: Colors.black, fontSize: 18),
                          hintStyle: const TextStyle(color: Colors.white),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xffF5F5FA),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xff5e5959),
                              width: 2.0,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      TextFormField(
                        controller: phoneController,
                        decoration: InputDecoration(
                          labelText: "Phone number",
                          labelStyle: const TextStyle(
                              color: Colors.black, fontSize: 18),
                          hintStyle: const TextStyle(color: Colors.white),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xffF5F5FA),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xff5e5959),
                              width: 2.0,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your phone number';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      DropdownButtonFormField<String>(
                        value: seatId,
                        decoration: InputDecoration(
                          labelText: 'Seat number',
                          labelStyle: const TextStyle(
                              color: Colors.black, fontSize: 18),
                          hintText: 'Select Gender',
                          hintStyle: const TextStyle(color: Colors.white),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xffF5F5FA),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xff5e5959),
                              width: 2.0,
                            ),
                          ),
                        ),
                        style: const TextStyle(color: Colors.black),
                        dropdownColor: Colors.white,
                        items: listSeat.map<DropdownMenuItem<String>>((value) {
                          return DropdownMenuItem<String>(
                            value: value.id.toString(),
                            child: Text(value.seatNumber),
                          );
                        }).toList(),
                        onChanged: (String? value) {
                          setState(() {
                            seatId = value!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select your seat';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      DropdownButtonFormField<String>(
                        value: luggageId,
                        decoration: InputDecoration(
                          labelText: 'Luggage',
                          labelStyle: const TextStyle(
                              color: Colors.black, fontSize: 18),
                          hintText: 'Luggage',
                          hintStyle: const TextStyle(color: Colors.white),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xffF5F5FA),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xff5e5959),
                              width: 2.0,
                            ),
                          ),
                        ),
                        style: const TextStyle(color: Colors.black),
                        dropdownColor: Colors.white,
                        items:
                            listLuggage.map<DropdownMenuItem<String>>((value) {
                          return DropdownMenuItem<String>(
                            value: value.id.toString(),
                            child: Text(
                                "${value.weight} kg - ${NumberFormat('#,###', 'vi_VN').format(value.price)}VND"),
                          );
                        }).toList(),
                        onChanged: (String? value) {
                          final selectedLuggage = listLuggage.firstWhere(
                            (lug) => lug.id.toString() == value,
                            orElse: () => listLuggage.first,
                          );
                          setState(() {
                            luggageId = value!;
                            priceLuggage = selectedLuggage.price;
                          });
                        },
                      ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      const Divider(),
                      const Text(
                        "Payment Information",
                        style: TextStyle(
                            fontWeight: FontWeight.w500, color: Colors.black),
                      ),
                      RadioListTile(
                        title: Row(
                          children: [
                            Image.asset(
                              'assets/images/Icon-VNPAY-QR.jpg',
                              width: 30,
                              height: 30,
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              "VNPAY",
                              style: TextStyle(color: Colors.black),
                            ),
                          ],
                        ),
                        value: "VNPAY",
                        groupValue: _selectedPaymentMethod,
                        onChanged: (value) {
                          setState(() {
                            _selectedPaymentMethod = value.toString();
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
        },
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            spreadRadius: 5,
          ),
        ]),
        child: BottomAppBar(
          height: 115,
          color: Colors.white,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Total price",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    "${NumberFormat('#,###', 'vi_VN').format(widget.price + priceLuggage)} đ",
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Color(0xff1A94FF),
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 10,
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (!_formKey.currentState!.validate()) {
                      return;
                    }

                    if (_selectedPaymentMethod.isEmpty ||
                        _selectedPaymentMethod == "") {
                      Fluttertoast.showToast(
                        msg: "Please select payment method",
                        toastLength: Toast.LENGTH_LONG,
                        gravity: ToastGravity.TOP,
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 18.0,
                      );
                    }
                    Navigator.of(context).push(MaterialPageRoute(
                      builder: (BuildContext context) => PaymentService(
                        ticketRequest: TicketRequest(
                          seatId: int.parse(seatId!),
                          seatClass: widget.seatClass,
                          flightId: widget.id,
                          luggageId: luggageId == null ? null : int.parse(luggageId!),
                          name: nameController.text,
                          phone: phoneController.text,
                          email: emailController.text,
                        ),
                        onSuccess: (Map params) async {
                          try {
                            var token = await tokenRepository.getToken();
                            final response = await http.get(
                              Uri.parse(params['url']),
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer $token'
                              },
                            );

                            if (response.statusCode == 200) {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => TransactionSuccessPage()
                                ),
                              );
                            } else {
                              // Xử lý lỗi khi gọi API xác nhận thanh toán
                              Fluttertoast.showToast(
                                msg: "Thanh toán không thành công",
                                toastLength: Toast.LENGTH_LONG,
                                backgroundColor: Colors.red,
                              );
                            }
                          } catch (e) {
                            print('Error confirming payment: $e');
                            Fluttertoast.showToast(
                              msg: "Có lỗi xảy ra",
                              toastLength: Toast.LENGTH_LONG,
                              backgroundColor: Colors.red,
                            );
                          }
                        },
                        onError: (error) {
                          log("onError: $error");
                          Navigator.pop(context);
                        },
                        onCancel: () {
                          print('cancelled:');
                          Navigator.pop(context);
                        },
                      ),
                    ));
                  },
                  style: ButtonStyle(
                    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                        side: const BorderSide(
                          color: Color(0xff1A94FF),
                        ),
                      ),
                    ),
                    backgroundColor: MaterialStateProperty.all<Color>(
                      const Color(0xff1A94FF),
                    ),
                  ),
                  child: const Text(
                    "Payment",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
