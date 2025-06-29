import 'package:flutter/material.dart';
import 'enter_otp_screen.dart';

const _darkPurple = Color(0xFF8464B7);

class GetEmailScreen extends StatefulWidget {
  const GetEmailScreen({super.key});

  @override
  State<GetEmailScreen> createState() => _GetEmailScreenState();
}

class _GetEmailScreenState extends State<GetEmailScreen> {
  final _emailController = TextEditingController();
  bool _agreed = false;
  String _email = '';

  bool get _hasEmail => _email.trim().isNotEmpty;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  bool _isValidEmail(String email) {
    final regex = RegExp(r'^[\w.\-]+@([\w\-]+\.)+\w{2,4}$');
    return regex.hasMatch(email.trim());
  }

  Future<void> _showEmailDialog() async {
    _emailController.text = _email;
    await showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Email Dialog',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, anim1, anim2) {
        return AlertDialog(
          title: const Text('Enter your Email'),
          content: TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              hintText: 'you@example.com',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                setState(() => _email = _emailController.text.trim());
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
              const SizedBox(height: 40),

              Text(
                'Enter your email ID.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: _darkPurple,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 48),

              Row(
                children: [
                  Expanded(
                    child: Text(
                      _hasEmail ? _email : 'No email provided',
                      style: TextStyle(
                        fontSize: 16,
                        color: _hasEmail
                            ? scheme.onBackground
                            : scheme.onBackground.withOpacity(0.5),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: _darkPurple),
                    onPressed: _showEmailDialog,
                  ),
                ],
              ),
              const Spacer(),

              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Checkbox(
                    value: _agreed,
                    activeColor: _darkPurple,
                    checkColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                    onChanged: (v) => setState(() => _agreed = v ?? false),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Click on agree to accept the Lhaden Terms & Conditions and Privacy Policy *',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onBackground.withOpacity(0.80),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: _darkPurple,
                    foregroundColor: Colors.white,
                    shape: const StadiumBorder(),
                    textStyle: const TextStyle(
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                  onPressed: (_agreed && _isValidEmail(_email))
                      ? () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => EnterOtpScreen(email: _email),
                      ),
                    );
                  }
                      : null,
                  child: const Text('Agree & Continue'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
