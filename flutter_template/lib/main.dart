import 'package:flutter/material.dart';

void main() => runApp(const StudioStarterApp());

class StudioStarterApp extends StatelessWidget {
  const StudioStarterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cloud Flutter Studio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7568E8),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const StarterHomePage(),
    );
  }
}

class StarterHomePage extends StatelessWidget {
  const StarterHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Flutter App')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.rocket_launch_rounded,
                size: 64,
                color: Color(0xFF7568E8),
              ),
              const SizedBox(height: 20),
              Text(
                'Built in Cloud Flutter Studio',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'This is a real Flutter starter app. Edit the source and run the cloud APK workflow.',
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
