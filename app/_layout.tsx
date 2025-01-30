import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4c669f' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        // headerShown: false,
        headerTitle: 'Gas by Gas'
      }}
    />
  );
}
