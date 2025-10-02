
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { colors } from '../../styles/commonStyles';

const tabs: TabBarItem[] = [
  {
    name: '(home)',
    title: 'Accueil',
    icon: 'home',
    route: '/(tabs)/(home)',
  },
  {
    name: 'jobs',
    title: 'Emplois',
    icon: 'work',
    route: '/(tabs)/jobs',
  },
  {
    name: 'formations',
    title: 'Formations',
    icon: 'school',
    route: '/(tabs)/formations',
  },
  {
    name: 'messages',
    title: 'Messages',
    icon: 'chat',
    route: '/(tabs)/messages',
  },
  {
    name: 'profile',
    title: 'Profil',
    icon: 'person',
    route: '/(tabs)/profile',
  },
];

export default function TabLayout() {
  if (Platform.OS === 'web') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="jobs" />
        <Stack.Screen name="formations" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="profile" />
      </Stack>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="jobs" />
        <Stack.Screen name="formations" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
