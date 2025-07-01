import 'package:flutter/material.dart';

const _darkPurple = Color(0xFF8464B7);

class HomeScreen extends StatefulWidget {
  final String email;
  const HomeScreen({super.key, required this.email});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  final List<_ChatMessage> _messages = [];
  final TextEditingController _chatController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;

    final animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    final message = _ChatMessage(
      text: text.trim(),
      sender: 'You',
      animationController: animationController,
    );

    setState(() => _messages.insert(0, message));

    animationController.forward();
    _chatController.clear();

    // Scroll to bottom after short delay
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        0,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  void dispose() {
    for (var msg in _messages) {
      msg.animationController.dispose();
    }
    _chatController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: scheme.background,
      appBar: AppBar(
        backgroundColor: _darkPurple,
        title: Text('Welcome, ${widget.email.split('@')[0]}',
            style: const TextStyle(color: Colors.white)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              controller: _scrollController,
              itemCount: _messages.length,
              itemBuilder: (_, index) => _messages[index],
            ),
          ),
          const Divider(height: 1),
          _buildChatInput(scheme),
        ],
      ),
    );
  }

  Widget _buildChatInput(ColorScheme scheme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      color: scheme.surface,
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _chatController,
              textCapitalization: TextCapitalization.sentences,
              style: TextStyle(color: scheme.onBackground),
              decoration: InputDecoration(
                hintText: 'Type a message',
                hintStyle: TextStyle(
                  color: scheme.onBackground.withOpacity(0.4),
                ),
                border: InputBorder.none,
              ),
              onSubmitted: _sendMessage,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send_rounded, color: _darkPurple),
            onPressed: () => _sendMessage(_chatController.text),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage extends StatelessWidget {
  final String text;
  final String sender;
  final AnimationController animationController;

  const _ChatMessage({
    required this.text,
    required this.sender,
    required this.animationController,
  });

  @override
  Widget build(BuildContext context) {
    final isUser = sender == 'You';
    final color = isUser ? _darkPurple : Colors.grey.shade300;
    final textColor = isUser ? Colors.white : Colors.black87;

    return SizeTransition(
      sizeFactor:
      CurvedAnimation(parent: animationController, curve: Curves.easeOut),
      axisAlignment: 0.0,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          mainAxisAlignment:
          isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
          children: [
            Flexible(
              child: Container(
                padding:
                const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                margin: isUser
                    ? const EdgeInsets.only(left: 50)
                    : const EdgeInsets.only(right: 50),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  text,
                  style: TextStyle(color: textColor, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
