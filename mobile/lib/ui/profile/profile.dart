import 'package:flutter/material.dart';
import 'package:mobile/data/model/user_response.dart';
import 'package:mobile/ui/profile/edit_profile.dart';
import 'package:mobile/ui/profile/transaction_history.dart';
import 'package:mobile/ui/profile/user_view_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  UserResponse? _userProfile;
  bool _isLoading = true;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    try {
      _userProfile = await UserViewModel().getUserInfo();
    } catch (e) {
      debugPrint("Error fetching profile: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff1A94FF),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      backgroundColor: const Color(0xffF5F5FA),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _userProfile == null
          ? const Center(
        child: Text(
          'Error loading profile',
          style: TextStyle(color: Colors.white, fontSize: 16.0),
        ),
      )
          : buildProfileContent(),
    );
  }

  Widget buildProfileContent(){
    return Container(
      color: Colors.white,
      child: Column(
        children: <Widget>[
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              labelColor: const Color(0xff1A94FF),
              unselectedLabelColor: Colors.grey,
              indicatorColor: const Color(0xff1A94FF),
              tabs: const [
                Tab(icon: Icon(Icons.info), text: 'Information'),
                Tab(icon: Icon(Icons.history), text: 'Transaction History'),
              ],
            ),
          ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _userProfile != null
                    ? EditProfile(userResponse: _userProfile!)
                    : const Center(child: CircularProgressIndicator()),
                _userProfile!.bookingList != null &&
                    _userProfile!.bookingList.isNotEmpty
                    ? TransactionHistoryPage(
                  bookingList: _userProfile!.bookingList,
                )
                    : const Center(
                  child: Text(
                    'No transactions available',
                    style:
                    TextStyle(color: Colors.white, fontSize: 16.0),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 10,
          ),
        ],
      ),
    );
  }
}
