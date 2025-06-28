import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/data/model/ticket_request.dart';
import 'package:mobile/data/repository/token_repository.dart';

class PaymentService extends StatefulWidget {
  final Function onSuccess, onCancel, onError;
  final TicketRequest ticketRequest;

  const PaymentService({
    required this.ticketRequest,
    required this.onSuccess,
    required this.onError,
    required this.onCancel,
    super.key,
  });

  @override
  State<PaymentService> createState() => _PaymentServiceState();
}

class _PaymentServiceState extends State<PaymentService> {
  InAppWebViewController? webViewController;
  bool isHandled = false;
  TokenRepository tokenRepository = TokenRepository();

  Future<String?> createPayment() async {
    try {
      var token = await tokenRepository.getToken();
      String url = 'http://10.0.2.2:8081/api/payment/create_payment_vnpay';
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          "Content-Type": "application/json"
        },
        body: jsonEncode(widget.ticketRequest.toJson()),
      );

      if (response.statusCode == 200) {
        var responseData = response.body;
        print('Payment URL response: $responseData');
        return responseData;
      } else {
        print('Payment creation failed: ${response.body}');
        widget.onError(
            "Failed to create payment. Status code: ${response.statusCode}");
        return null;
      }
    } catch (e) {
      print('Error creating payment: $e');
      widget.onError("Error: $e");
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("VNPay Payment"),
        centerTitle: true,
      ),
      body: FutureBuilder<String?>(
        future: createPayment(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("An error occurred"));
          } else if (snapshot.hasData && snapshot.data != null) {
            return InAppWebView(
              initialUrlRequest: URLRequest(
                  url: WebUri(snapshot.data!)),
              onWebViewCreated: (controller) {
                webViewController = controller;
              },
              shouldOverrideUrlLoading: (controller, navigationAction) async {
                var uri = navigationAction.request.url;
                if (uri != null) {
                  // Xử lý URL chuyển hướng từ VNPAY
                  if (uri.queryParameters.containsKey("vnp_ResponseCode")) {
                    String responseCode =
                        uri.queryParameters["vnp_ResponseCode"]!;
                    switch (responseCode) {
                      case "00":
                        // Giao dịch thành công
                        widget.onSuccess({"url": uri.toString()});
                        break;
                      case "01":
                        // Giao dịch chưa hoàn tất
                        widget.onError("Transaction not completed");
                        break;
                      case "02":
                        // Giao dịch lỗi
                        widget.onError("Transaction error");
                        break;
                      default:
                        // Các mã lỗi khác
                        widget.onError(
                            "Payment failed with response code: $responseCode");
                    }
                    return NavigationActionPolicy.CANCEL;
                  }

                  // Kiểm tra hủy giao dịch
                  if (uri.queryParameters.containsKey("vnp_TxnRef")) {
                    widget.onCancel();
                    return NavigationActionPolicy.CANCEL;
                  }
                }
                return NavigationActionPolicy.ALLOW;
              },
              initialOptions: InAppWebViewGroupOptions(
                crossPlatform: InAppWebViewOptions(
                  useShouldOverrideUrlLoading: true,
                ),
              ),
              onLoadStart: (controller, url) async {
                if (!isHandled &&
                    url.toString().contains(
                        'http://10.0.2.2:8081/api/payment/v2/booking_vnpay')) {
                  isHandled = true;
                  executePayment(url, context);

                  Navigator.pop(context);
                }
              },
              onLoadStop: (controller, url) async {
                if (!isHandled) {
                  print('Stop loading: ' + url.toString());
                }
              },
              onLoadError: (controller, url, code, message) {
                if (!isHandled) {
                  print('Failed to load: ' +
                      url.toString() +
                      ', Error: ' +
                      message);
                  Navigator.pop(context);
                }
              },
            );
          } else {
            return Center(child: Text("Failed to create payment URL"));
          }
        },
      ),
    );
  }

  void executePayment(Uri? url, BuildContext context) {
    if (url != null) {
      Map<String, String> urlMap = {
        'url': url.toString(),
      };
      widget.onSuccess(urlMap);
    } else {
      widget.onError("Invalid URL");
    }
  }
}
