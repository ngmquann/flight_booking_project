import 'package:flutter/material.dart';

class DateSelection extends StatelessWidget {
  final List<String> dateNumbers;
  final List<String> weekdays;
  final int selectedDateIndex;
  final Function(int) onDateSelected;

  const DateSelection({
    required this.dateNumbers,
    required this.weekdays,
    required this.selectedDateIndex,
    required this.onDateSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      decoration: const BoxDecoration(
        color: Colors.white
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: dateNumbers.length,
        itemBuilder: (context, index) {
          return Row(
            children: [
              GestureDetector(
                onTap: () => onDateSelected(index),
                child: Container(
                  width: 120,
                  alignment: Alignment.center,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  margin: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: selectedDateIndex == index
                        ? const Color(0xff1A94FF)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        weekdays[index],
                        style: TextStyle(
                          color: selectedDateIndex == index
                              ? Colors.white
                              : Colors.black,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        dateNumbers[index],
                        style: TextStyle(
                          color: selectedDateIndex == index
                              ? Colors.white
                              : Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Add a VerticalDivider after each item except the last one
              if (index < dateNumbers.length - 1)
                const VerticalDivider(
                  color: Colors.grey,
                  width: 10,
                  thickness: 1,
                  indent: 20,
                  endIndent: 20,
                ),
            ],
          );
        },
      ),
    );

  }
}
