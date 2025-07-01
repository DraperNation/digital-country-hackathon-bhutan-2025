import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'name_animation_screen.dart';

const _darkPurple = Color(0xFF8464B7);

class EnterUserInfoScreen extends StatefulWidget {
  final String email;
  const EnterUserInfoScreen({super.key, required this.email});

  @override
  State<EnterUserInfoScreen> createState() => _EnterUserInfoScreenState();
}

class _EnterUserInfoScreenState extends State<EnterUserInfoScreen> {
  final TextEditingController _nameController = TextEditingController();
  String _name = '';
  String? _accountType;
  String? _errorText;
  bool _isSaving = false;

  final List<String> _accountTypes = ['Personal', 'Business', 'Government'];

  bool get _isFormValid => _name.trim().isNotEmpty && _accountType != null;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _showNameDialog() async {
    _nameController.text = _name;
    await showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Name Dialog',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, anim1, anim2) {
        return AlertDialog(
          title: const Text('Enter your Name'),
          content: TextField(
            controller: _nameController,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(hintText: 'John Doe'),
          ),
          actions: [
            TextButton(
              onPressed: () {
                setState(() => _name = _nameController.text.trim());
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

  Future<void> _saveInfo() async {
    if (!_isFormValid) return;

    setState(() {
      _isSaving = true;
      _errorText = null;
    });

    try {
      final res = await http.post(
        Uri.parse(
          'http://IP_ADDRESS:8000/store-user-info',
        ),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email_id': widget.email,
          'name': _name,
          'account_type': _accountType,
        }),
      );

      if (res.statusCode != 200) {
        throw Exception('Bad status: ${res.statusCode}');
      }

      if (!mounted) return;

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (_) => NameAnimationScreen(
            fullName: _name,
            email: widget.email,
          ),
        ),
            (_) => false,
      );
    } catch (_) {
      setState(() => _errorText = 'Could not save your info. Please try again.');
    } finally {
      setState(() => _isSaving = false);
    }
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
              Text(
                'Complete your profile.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: _darkPurple,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 48),

              Text(
                'Name',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: scheme.onBackground.withOpacity(0.60)),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      _name.isNotEmpty ? _name : 'No name entered',
                      style: TextStyle(
                        fontSize: 18,
                        color: _name.isNotEmpty
                            ? scheme.onBackground
                            : scheme.onBackground.withOpacity(0.5),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: _darkPurple),
                    onPressed: _showNameDialog,
                  ),
                ],
              ),

              const SizedBox(height: 32),
              Text(
                'Account Type',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: scheme.onBackground.withOpacity(0.60)),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  border: UnderlineInputBorder(),
                  isDense: true,
                ),
                value: _accountType,
                items: _accountTypes
                    .map((type) => DropdownMenuItem(
                  value: type,
                  child: Text(type),
                ))
                    .toList(),
                onChanged: (val) => setState(() => _accountType = val),
              ),

              if (_errorText != null) ...[
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    _errorText!,
                    style: TextStyle(color: Colors.red.shade400),
                  ),
                ),
              ],

              const Spacer(),

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
                  onPressed: (_isFormValid && !_isSaving) ? _saveInfo : null,
                  child: _isSaving
                      ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                      : const Text('Finish'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
