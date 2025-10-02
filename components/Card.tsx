
import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../styles/commonStyles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: boolean;
}

export default function Card({
  children,
  style,
  padding = spacing.md,
  shadow = true,
}: CardProps) {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  const cardStyle = [
    styles.card,
    {
      backgroundColor: themeColors.card,
      padding,
    },
    shadow && shadows.small,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
  },
});
