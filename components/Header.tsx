
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './IconSymbol';
import { colors, spacing, typography } from '../styles/commonStyles';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
}

export default function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor,
}: HeaderProps) {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor || themeColors.background}
      />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: backgroundColor || themeColors.background },
        ]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {leftIcon && onLeftPress && (
              <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                <IconSymbol
                  name={leftIcon as any}
                  size={24}
                  color={themeColors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {title}
            </Text>
          </View>
          
          <View style={styles.rightSection}>
            {rightIcon && onRightPress && (
              <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                <IconSymbol
                  name={rightIcon as any}
                  size={24}
                  color={themeColors.text}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    padding: spacing.sm,
    margin: -spacing.sm,
  },
});
