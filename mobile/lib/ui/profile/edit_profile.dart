import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:mobile/data/model/profile_request.dart';
import 'package:mobile/data/model/user_response.dart';
import 'package:mobile/data/repository/token_repository.dart';
import 'package:mobile/main.dart';
import 'package:mobile/ui/profile/user_view_model.dart';

class EditProfile extends StatefulWidget {
  final UserResponse userResponse;

  const EditProfile({required this.userResponse, super.key});

  @override
  State<EditProfile> createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _dateOfBirthController;
  late TextEditingController _addressController;
  final _formKey = GlobalKey<FormState>();
  late UserViewModel userViewModel;
  late ProfileRequest profileRequest;
  bool _isEditable = true;
  String? _errorMessage;
  bool isLoading = false;
  TokenRepository tokenRepository = TokenRepository();

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.userResponse.fullName);
    _emailController = TextEditingController(text: widget.userResponse.email);
    _phoneController = TextEditingController(text: widget.userResponse.phoneNumber);
    _dateOfBirthController = TextEditingController(text: DateFormat('dd-MM-yyyy').format(widget.userResponse.dateOfBirth!));
    _addressController = TextEditingController(text: widget.userResponse.address);
    userViewModel = UserViewModel();
  }

  Future<String?> updateUserProfile() async {
    profileRequest = ProfileRequest(
      fullName: _nameController.text,
      email: _emailController.text,
      phoneNumber: _phoneController.text,
      dateOfBirth: _dateOfBirthController.text,
      address: _addressController.text,
    );

    try {
      String? message = await userViewModel.updateProfile(profileRequest);
      Fluttertoast.showToast(
        msg: message.toString(),
        toastLength: Toast.LENGTH_LONG,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 18.0,
      );

      setState(() {
        _isEditable = true;
      });

    } catch (e) {
      _errorMessage = await e.toString().replaceFirst('Exception: ', '');

      Fluttertoast.showToast(
        msg: _errorMessage.toString(),
        toastLength: Toast.LENGTH_LONG,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 18.0,
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    DateTime? selectedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (selectedDate != null) {
      setState(() {
        _dateOfBirthController.text = DateFormat('dd-MM-yyyy').format(selectedDate);
      });
    }
  }

  void _logout(BuildContext context) async {
    await tokenRepository.deleteToken();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => MyApp()),
    ); // Example navigation
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _nameController,
                  readOnly: _isEditable,
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    labelStyle: TextStyle(color: Colors.black, fontSize: 18),
                    hintStyle: TextStyle(color: Colors.white),
                    filled: true,
                    fillColor: Color(0xfff5f5f5),
                    // Màu nền của TextFormField
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xfff5f5f5),
                        width: 1.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xff5e5959),
                        width: 2.0,
                      ),
                    ),
                  ),
                  style: const TextStyle(color: Colors.black),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your full name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),
                TextFormField(
                  controller: _emailController,
                  readOnly: true,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    labelStyle: TextStyle(color: Colors.black, fontSize: 18),
                    hintStyle: TextStyle(color: Colors.white),
                    filled: true,
                    fillColor: Color(0xfff5f5f5),
                    // Màu nền của TextFormField
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xfff5f5f5),
                        width: 1.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xff5e5959),
                        width: 2.0,
                      ),
                    ),
                  ),
                  style: const TextStyle(color: Colors.black),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),
                TextFormField(
                  controller: _phoneController,
                  readOnly: _isEditable,
                  decoration: const InputDecoration(
                    labelText: 'Phone',
                    labelStyle: TextStyle(color: Colors.black, fontSize: 18),
                    hintStyle: TextStyle(color: Colors.white),
                    filled: true,
                    fillColor: Color(0xfff5f5f5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xfff5f5f5),
                        width: 1.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xff5e5959),
                        width: 2.0,
                      ),
                    ),
                  ),
                  style: const TextStyle(color: Colors.black),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the phone number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),
                TextFormField(
                  controller: _addressController,
                  readOnly: _isEditable,
                  decoration: const InputDecoration(
                    labelText: 'Address',
                    labelStyle: TextStyle(color: Colors.black, fontSize: 18),
                    hintStyle: TextStyle(color: Colors.white),
                    filled: true,
                    fillColor: Color(0xfff5f5f5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xfff5f5f5),
                        width: 1.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(8)),
                      borderSide: BorderSide(
                        color: Color(0xff5e5959),
                        width: 2.0,
                      ),
                    ),
                  ),
                  style: const TextStyle(color: Colors.black),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter address';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),
                GestureDetector(
                  onTap: !_isEditable ? () => _selectDate(context) : null,
                  child: AbsorbPointer(
                    child: TextFormField(
                      controller: _dateOfBirthController,
                      decoration: InputDecoration(
                        labelText: 'Date of Birth',
                        labelStyle: const TextStyle(
                            color: Colors.black, fontSize: 18),
                        hintText: 'YYYY-MM-DD',
                        hintStyle: const TextStyle(color: Colors.white),
                        filled: true,
                        fillColor: const Color(0xfff5f5f5),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(
                            color: Color(0xfff5f5f5),
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
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter date of birth';
                        } else {
                          DateTime dateOfBirth =
                          DateFormat('dd-MM-yyyy').parse(value);
                          int age = DateTime.now().year - dateOfBirth.year;
                          if (age < 13 || age > 80) {
                            return 'Age must be between 13 and 80';
                          }
                        }
                        return null;
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                    width: double.infinity,
                    child: _isEditable
                        ? ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _isEditable = false;
                        });
                      },
                      child: const Text(
                        'Edit Profile',
                        style: TextStyle(color: Colors.white),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xff1A94FF),
                        padding:
                        const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    )
                        : ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState?.validate() ??
                            false) {
                          if (_formKey.currentState?.validate() ??
                              false) {
                            updateUserProfile();
                          }
                        }
                      },
                      child: const Text(
                        'Save',
                        style: TextStyle(color: Colors.white),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xff1A94FF),
                        padding:
                        const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    )),
                const SizedBox(height: 10),
                TextButton(
                  onPressed: () => _logout(context),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 50.0, vertical: 20.0),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                      BorderRadius.circular(10.0), // Rounded corners
                    ),

                    backgroundColor:
                    Colors.transparent, // Transparent background
                  ),
                  child: const Text(
                    'Log Out',
                    style: TextStyle(
                      color: Colors.orange, // Text color
                      fontSize: 18.0, // Text size
                      fontWeight: FontWeight.bold, // Font weight
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
