import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, borderRadius, spacing } from '@/constants/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[20],
    borderWidth: 1,
    borderColor: colors.neutral[40],
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.neutral[400],
  },
  labelSelected: {
    color: colors.primary[700],
    fontFamily: fonts.bodySemiBold,
  },
});
