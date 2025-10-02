
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useColorScheme,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, spacing, typography } from '../styles/commonStyles';
import { OfflineManager } from '../utils/offlineManager';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [slideAnim] = useState(new Animated.Value(-50));
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  useEffect(() => {
    const removeListener = OfflineManager.addNetworkListener((online) => {
      setIsOnline(online);
      
      if (!online) {
        // Show offline banner
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Hide offline banner
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    return removeListener;
  }, []);

  if (isOnline) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.error,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <IconSymbol name="wifi-off" size={16} color="#FFFFFF" />
      <Text style={styles.text}>
        Pas de connexion Internet
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 1000,
    gap: spacing.xs,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
