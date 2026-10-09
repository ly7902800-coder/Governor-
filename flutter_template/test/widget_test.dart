import 'package:flutter_test/flutter_test.dart';
import 'package:cloud_flutter_studio_starter/main.dart';

void main() {
  testWidgets('shows the Governor Studio starter screen', (WidgetTester tester) async {
    await tester.pumpWidget(const StudioStarterApp());

    expect(find.text('Built in Governor Studio'), findsOneWidget);
    expect(find.text('Governor Starter App'), findsOneWidget);
  });
}
