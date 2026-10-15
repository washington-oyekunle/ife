import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '@/constants/theme';

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const progress = Math.min(current / total, 1);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral[30],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
});
