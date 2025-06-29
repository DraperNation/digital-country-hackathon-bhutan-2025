import 'package:flutter/material.dart';
import 'home_screen.dart';

class NameAnimationScreen extends StatefulWidget {
  final String fullName;   // e.g. "Wasim Bijili"
  final String email;      // <- NEW: e-mail to pass on

  const NameAnimationScreen({
    super.key,
    required this.fullName,
    required this.email,
  });

  @override
  State<NameAnimationScreen> createState() => _NameAnimationScreenState();
}

class _NameAnimationScreenState extends State<NameAnimationScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double>   _opacity;

  String get _firstName {
    final parts = widget.fullName.trim().split(' ');
    return parts.isNotEmpty ? parts.first : widget.fullName;
  }

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    // Fade-in ➜ hold ➜ fade-out
    _opacity = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 1,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 0.5),
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 0.0)
            .chain(CurveTween(curve: Curves.easeIn)),
        weight: 1,
      ),
    ]).animate(_controller);

    _controller
      ..forward()
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed && mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (_) => HomeScreen(email: widget.email), // <- pass along!
            ),
          );
        }
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: scheme.background,
      body: Center(
        child: FadeTransition(
          opacity: _opacity,
          child: Text(
            'Hello $_firstName',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: scheme.onBackground,
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
