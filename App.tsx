import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';

import { getDb } from '@/lib/db/database';
import { preloadAudio } from '@/lib/audio';
import { colors } from '@/theme';
import { LoadingScreen } from '@/components/LoadingScreen';
import type { RootStackParamList } from '@/navigation/types';
import { ProfilesScreen } from '@/screens/ProfilesScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { SemesterScreen } from '@/screens/SemesterScreen';
import { TopicSelectScreen } from '@/screens/TopicSelectScreen';
import { PracticeScreen } from '@/screens/PracticeScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { WheelScreen } from '@/screens/WheelScreen';
import { RewardsScreen } from '@/screens/RewardsScreen';
import { ParentGateScreen } from '@/screens/parent/ParentGateScreen';
import { ParentSettingsScreen } from '@/screens/parent/ParentSettingsScreen';
import { ParentProfilesEditScreen } from '@/screens/parent/ParentProfilesEditScreen';
import { ParentRewardsEditScreen } from '@/screens/parent/ParentRewardsEditScreen';
import { ParentHistoryScreen } from '@/screens/parent/ParentHistoryScreen';
import { ParentWheelConfigScreen } from '@/screens/parent/ParentWheelConfigScreen';
import { ParentPinScreen } from '@/screens/parent/ParentPinScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  useEffect(() => {
    preloadAudio();
    (async () => {
      try {
        await getDb();
      } catch (e) {
        console.error('DB init failed:', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="Profiles"
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTitleStyle: { color: colors.text, fontWeight: '700' },
              headerTintColor: colors.primary,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="Profiles" component={ProfilesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Toán Vui' }} />
            <Stack.Screen name="Semester" component={SemesterScreen} options={{ title: 'Học kỳ' }} />
            <Stack.Screen name="TopicSelect" component={TopicSelectScreen} options={{ title: 'Chọn dạng bài' }} />
            <Stack.Screen
              name="Practice"
              component={PracticeScreen}
              options={{ title: 'Làm bài', headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ title: 'Kết quả', headerBackVisible: false, gestureEnabled: false }}
            />
            <Stack.Screen name="Wheel" component={WheelScreen} options={{ title: 'Vòng quay' }} />
            <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'Đổi quà' }} />
            <Stack.Screen name="ParentGate" component={ParentGateScreen} options={{ title: 'Phụ huynh' }} />
            <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} options={{ title: 'Cài đặt' }} />
            <Stack.Screen name="ParentProfilesEdit" component={ParentProfilesEditScreen} options={{ title: 'Quản lý hồ sơ học sinh' }} />
            <Stack.Screen name="ParentRewardsEdit" component={ParentRewardsEditScreen} options={{ title: 'Quản lý quà' }} />
            <Stack.Screen name="ParentHistory" component={ParentHistoryScreen} options={{ title: 'Lịch sử' }} />
            <Stack.Screen name="ParentWheelConfig" component={ParentWheelConfigScreen} options={{ title: 'Vòng quay' }} />
            <Stack.Screen name="ParentPin" component={ParentPinScreen} options={{ title: 'Đổi PIN' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

