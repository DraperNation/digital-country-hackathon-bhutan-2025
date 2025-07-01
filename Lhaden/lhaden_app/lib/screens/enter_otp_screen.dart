import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'enter_user_info_screen.dart';
import 'home_screen.dart';

const _darkPurple = Color(0xFF8464B7);
const _kEmailKey = 'email_id';

class EnterOtpScreen extends StatefulWidget {
  final String email;
  const EnterOtpScreen({super.key, required this.email});

  @override
  State<EnterOtpScreen> createState() => _EnterOtpScreenState();
}

class _EnterOtpScreenState extends State<EnterOtpScreen> {
  final _otpController = TextEditingController();
  String _otp = '';
  String? _token;
  String? _errorText;
  Timer? _timer;
  int _secondsLeft = 60;
  bool _isVerifying = false;
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    _sendOtp();
    _startTimer();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    setState(() {
      _isSending = true;
      _errorText = null;
    });

    try {
      final res = await http.post(
        Uri.parse(
            'http://IP_ADDRESS:8000/send-email-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': widget.email}),
      );
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        _token = json['token'];
        _startTimer();
      } else {
        throw Exception('Bad status: ${res.statusCode}');
      }
    } catch (_) {
      setState(() => _errorText = 'Failed to send OTP. Try again.');
    } finally {
      setState(() => _isSending = false);
    }
  }

  Future<void> _verifyOtp(String otp) async {
    setState(() {
      _isVerifying = true;
      _errorText = null;
    });

    try {
      final res = await http.post(
        Uri.parse(
            'http://IP_ADDRESS:8000/verify-email-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': widget.email,
          'otp': otp,
          'token': _token,
        }),
      );

      final data = jsonDecode(res.body);
      if (data['valid'] != true) {
        setState(() => _errorText = 'Invalid OTP, please try again.');
        return;
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('loggedIn', true);
      await prefs.setString(_kEmailKey, widget.email);

      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => data['new_user'] == true
              ? EnterUserInfoScreen(email: widget.email)
              : HomeScreen(email: widget.email),
        ),
      );
    } catch (_) {
      setState(() => _errorText = 'Verification failed, please try again.');
    } finally {
      setState(() => _isVerifying = false);
    }
  }

  void _startTimer() {
    _secondsLeft = 60;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft == 0) {
        t.cancel();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  Future<void> _showOtpDialog() async {
    _otpController.text = _otp;
    await showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'OTP Dialog',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, anim1, anim2) {
        return AlertDialog(
          title: const Text('Enter OTP'),
          content: PinCodeTextField(
            appContext: context,
            length: 6,
            controller: _otpController,
            keyboardType: TextInputType.number,
            animationType: AnimationType.fade,
            textStyle: const TextStyle(fontSize: 20),
            pinTheme: PinTheme(
              shape: PinCodeFieldShape.underline,
              fieldWidth: 40,
              inactiveColor: Colors.grey,
              activeColor: _darkPurple,
              selectedColor: _darkPurple,
            ),
            onChanged: (_) {},
            onCompleted: (_) => FocusScope.of(context).unfocus(),
          ),
          actions: [
            TextButton(
              onPressed: () {
                setState(() => _otp = _otpController.text.trim());
                Navigator.of(context).pop();
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
      transitionBuilder: (context, anim1, anim2, child) {
        return Transform.scale(
          scale: anim1.value,
          child: Opacity(
            opacity: anim1.value,
            child: child,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: scheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IconButton(
                icon: Icon(Icons.arrow_back, color: scheme.onBackground),
                onPressed: () => Navigator.of(context).pop(),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  'Enter your OTP.',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: _darkPurple,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 40),

              Row(
                children: [
                  Expanded(
                    child: Text(
                      _otp.isNotEmpty ? '••••••' : 'No OTP entered',
                      style: TextStyle(
                        fontSize: 20,
                        letterSpacing: 4,
                        color: _otp.isNotEmpty
                            ? scheme.onBackground
                            : scheme.onBackground.withOpacity(0.5),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: _darkPurple),
                    onPressed: _showOtpDialog,
                  ),
                ],
              ),

              if (_errorText != null) ...[
                const SizedBox(height: 8),
                Center(
                  child: Text(
                    _errorText!,
                    style: TextStyle(color: Colors.red.shade400),
                  ),
                ),
              ],

              const SizedBox(height: 40),

              Center(
                child: Column(
                  children: [
                    Text(
                      "Didn't receive OTP yet?",
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onBackground.withOpacity(0.60),
                      ),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: scheme.onBackground,
                        side: BorderSide(color: scheme.onBackground),
                      ),
                      onPressed: (_secondsLeft == 0 && !_isSending)
                          ? () async {
                        await _sendOtp();
                        _startTimer();
                      }
                          : null,
                      child: _isSending
                          ? const SizedBox(
                        height: 16,
                        width: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                          : const Text('Resend'),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${_secondsLeft.toString().padLeft(2, '0')} secs',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onBackground.withOpacity(0.60),
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: _darkPurple,
                    foregroundColor: Colors.white,
                    shape: const StadiumBorder(),
                  ),
                  onPressed: (_otp.length == 6 && !_isVerifying)
                      ? () => _verifyOtp(_otp)
                      : null,
                  child: _isVerifying
                      ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                      : const Text('Verify'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
