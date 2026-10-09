# Flutter starter app

This directory is the real Flutter source used by the `Build Flutter APK` GitHub Actions workflow.

- Edit `lib/main.dart` to change the app.
- Dependencies are declared in `pubspec.yaml`.
- The workflow runs `flutter pub get`, `flutter analyze`, and `flutter build apk --release`.
- On success, it uploads `app-release.apk` as the `cloud-flutter-studio-apk` artifact.
