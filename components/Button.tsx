import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors, fonts, borderRadius, spacing, shadow } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        size === 'lg' && styles.large,
        size === 'md' && styles.medium,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        isOutline && styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary[500]} />
      ) : (
        <Text
          style={[
            styles.label,
            size === 'lg' && styles.labelLarge,
            size === 'md' && styles.labelMedium,
            isPrimary && styles.labelPrimary,
            isSecondary && styles.labelSecondary,
            isGhost && styles.labelGhost,
            isOutline && styles.labelOutline,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary[500],
    ...shadow.sm,
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
  fontSize: 16,
    lineHeight: 22,
  },
  labelLarge: {
    fontSize: 17,
  },
  labelMedium: {
    fontSize: 15,
  },
  labelPrimary: {
    color: '#fff',
  },
  labelSecondary: {
    color: '#fff',
  },
  labelGhost: {
    color: colors.primary[600],
  },
  labelOutline: {
    color: colors.primary[600],
  },
});


