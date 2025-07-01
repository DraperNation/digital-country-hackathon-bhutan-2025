import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';          // ← Firebase Core
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/get_email_id_screen.dart';
import 'screens/home_screen.dart';

const _kEmailKey     = 'email_id';
const _kThemeModeKey = 'theme_mode';

/// Global notifier so SettingsScreen can toggle the theme on the fly
final themeNotifier = ValueNotifier<ThemeMode>(ThemeMode.system);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ── INITIALIZE FIREBASE ───────────────────────────────────────
  await Firebase.initializeApp();

  // ── LOAD SHARED PREFERENCES ────────────────────────────────────
  final prefs    = await SharedPreferences.getInstance();
  final loggedIn = prefs.getBool('loggedIn') ?? false;
  final email    = prefs.getString(_kEmailKey) ?? '';

  // ── APPLY LAST-SAVED THEME CHOICE ─────────────────────────────
  final storedTheme = prefs.getString(_kThemeModeKey) ?? 'system';
  themeNotifier.value = switch (storedTheme) {
    'light' => ThemeMode.light,
    'dark'  => ThemeMode.dark,
    _       => ThemeMode.system,
  };

  // ── RUN APP ────────────────────────────────────────────────────
  runApp(
    LhadenApp(
      isLoggedIn: loggedIn && email.isNotEmpty,
      savedEmail: email,
    ),
  );
}

class LhadenApp extends StatelessWidget {
  final bool   isLoggedIn;
  final String savedEmail;

  const LhadenApp({
    super.key,
    required this.isLoggedIn,
    required this.savedEmail,
  });

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF8464B7); // signature purple 💜

    // ── DARK PALETTE: pitch-black ─────────────────────────────────
    final darkScheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: Brightness.dark,
    ).copyWith(
      background: Colors.black,
      surface: Colors.black,
      onBackground: Colors.white,
      onSurface: Colors.white,
    );

    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (_, mode, __) {
        return MaterialApp(
          title: 'Lhaden',

          // ── LIGHT THEME ───────────────────────────────────────────
          theme: ThemeData.light(useMaterial3: true)
              .copyWith(colorScheme: ColorScheme.fromSeed(seedColor: seed)),

          // ── DARK THEME ────────────────────────────────────────────
          darkTheme: ThemeData.dark(useMaterial3: true).copyWith(
            colorScheme: darkScheme,
            scaffoldBackgroundColor: Colors.black,
            canvasColor: Colors.black,
            dialogBackgroundColor: Colors.black,
            cardColor: Colors.black,
          ),

          themeMode: mode, // 🌗 Use the selected mode

          // ── PICK THE FIRST SCREEN ────────────────────────────────
          home: isLoggedIn
              ? HomeScreen(email: savedEmail)
              : const GetEmailScreen(),
        );
      },
    );
  }
}
