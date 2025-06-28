import 'package:book_my_seat/book_my_seat.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:mobile/ui/booking/seat_number.dart';

class SeatSelectionPage extends StatefulWidget {
  const SeatSelectionPage({super.key});

  @override
  State<SeatSelectionPage> createState() => _SeatSelectionPageState();
}

class _SeatSelectionPageState extends State<SeatSelectionPage> {
  Set<SeatNumber> selectedSeats = {};
  late List<int> splitIndices;
  late List<List<SeatState>> currentSeatsState;
  Set<String> quantitySeat = Set();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    currentSeatsState = [[]];
    _initializeSeats();
  }

  void _initializeSeats() {
    int splitInterval = (3 /
        (3))
        .floor();
    int remainingSeats = 3 %
        (3);

    splitIndices = [];
    int currentPosition = splitInterval;

    for (int i = 0; i < 3; i++) {
      splitIndices.add(currentPosition + i + 1);
      currentPosition += splitInterval + (remainingSeats > 0 ? 1 : 0);
      remainingSeats =
      remainingSeats > 0 ? remainingSeats - 1 : remainingSeats;
    }

    currentSeatsState = List.generate(
      9,
          (row) => List.generate(
        3 +
            3,
            (col) {
          if (splitIndices.contains(col)) {
            return SeatState.empty;
          }

          int adjustedCol =
              col - splitIndices.where((index) => index <= col).length;
          String seatLabel =
              '${String.fromCharCode(65 + row)}${adjustedCol + 1}';

          return SeatState.unselected;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff1A94FF),
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          "Seat selection",
          style: TextStyle(
              color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      backgroundColor: const Color(0xffF5F5FA),
      body: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(
              height: 50,
            ),
            Flexible(
              child: SizedBox(
                width: double.maxFinite,
                height: 500,
                child: SeatLayoutWidget(
                  onSeatStateChanged: (rowI, colI, seatState) {
                    if (seatState == SeatState.selected &&
                        quantitySeat.length > 1) {
                      Fluttertoast.showToast(
                        msg:
                        'You can only select a maximum of 8 seats!',
                        toastLength: Toast.LENGTH_LONG,
                        gravity: ToastGravity.TOP,
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 16.0,
                      );
                      return;
                    } else {
                      double price = 1000000;
                      String seatLabel =
                          '${String.fromCharCode(65 + rowI)}${colI + 1}';

                      setState(() {
                        if (seatState == SeatState.selected &&
                            quantitySeat.length == 1) {
                          // paymentRequest.totalPrice =
                          //     (paymentRequest.totalPrice ?? 0) +
                          //         price;
                          quantitySeat.add(seatLabel);
                        } else {
                          // if ((paymentRequest.totalPrice ?? 0) >=
                          //     price) {
                          //   paymentRequest.totalPrice =
                          //       (paymentRequest.totalPrice ?? 0) -
                          //           price;
                          // } else {
                          //   paymentRequest.totalPrice = 0.0;
                          // }
                          quantitySeat.remove(seatLabel);
                        }
                      });
                    }
                  },
                  stateModel: SeatLayoutStateModel(
                    rows: 9, // 7 rows
                    cols: 6, // 3 seats + 2 aisles
                    seatSvgSize: 45,
                    pathSelectedSeat: 'assets/seat_state/seat_selected.svg',
                    pathDisabledSeat: 'assets/seat_state/seat_disabled.svg',
                    pathSoldSeat: 'assets/seat_state/seat_sold.svg',
                    pathUnSelectedSeat: 'assets/seat_state/seat_unselected.svg',
                    currentSeatsState: currentSeatsState,
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 15,
                        height: 15,
                        color: Colors.grey.shade700,
                      ),
                      const SizedBox(width: 2),
                      const Text('Disabled')
                    ],
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 15,
                        height: 15,
                        color: Colors.lightBlueAccent,
                      ),
                      const SizedBox(width: 2),
                      const Text('Sold')
                    ],
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 15,
                        height: 15,
                        decoration: BoxDecoration(border: Border.all(color: const Color(0xff0FFF50))),
                      ),
                      const SizedBox(width: 2),
                      const Text('Available')
                    ],
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 15,
                        height: 15,
                        color: const Color(0xff0FFF50),
                      ),
                      const SizedBox(width: 2),
                      const Text('Selected by you')
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 12,
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {});
              },
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.resolveWith((states) => const Color(0xFFfc4c4e)),
              ),
              child: const Text('Show my selected seat numbers'),
            ),
            const SizedBox(height: 12),
            Text(selectedSeats.join(" , "))
          ],
        ),
      ),
    );
  }
}

