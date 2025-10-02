
import { Button } from "@/components/button";
import { useColorScheme, Alert } from "react-native";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { Stack, router, Redirect } from "expo-router";
import { useNetworkState } from "expo-network";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { SystemBars } from "react-native-edge-to-edge";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useAuthStore } from "../store/userStore";
import NetworkStatus from "../components/NetworkStatus";
import { OfflineManager } from "../utils/offlineManager";
import { ErrorLogger, setupGlobalErrorHandler } from "../utils/errorLogger";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { isConnected } = useNetworkState();
  const colorScheme = useColorScheme();
  
  const { 
    isAuthenticated, 
    hasSeenOnboarding, 
    isLoading, 
    profile,
    checkAuthState 
  } = useAuthStore();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkAuthState();
      OfflineManager.initialize();
      ErrorLogger.initialize();
      setupGlobalErrorHandler();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        "Connexion Internet",
        "Veuillez vérifier votre connexion Internet pour utiliser l'application."
      );
    }
  }, [isConnected]);

  if (!loaded || isLoading) {
    return null;
  }

  // Redirect logic
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // Check if profile is complete
  if (isAuthenticated && profile && (!profile.full_name || !profile.location || !profile.skills || profile.skills.length === 0)) {
    return <Redirect href="/profile/edit" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WidgetProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SystemBars style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="legal" />
            <Stack.Screen name="email-confirmed" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="apply-job" />
            <Stack.Screen name="my-applications" />
            <Stack.Screen name="dev-tools" />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen name="formsheet" options={{ presentation: "formSheet" }} />
            <Stack.Screen name="transparent-modal" options={{ presentation: "transparentModal" }} />
          </Stack>
          <NetworkStatus />
          <StatusBar style="auto" />
        </ThemeProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}
