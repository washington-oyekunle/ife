import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, Check, Heart, MessageCircle, Scale, Zap, AlertTriangle } from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { CompatibilityBreakdown } from '@/data/values';

type Props = {
  breakdown: CompatibilityBreakdown;
  matchName?: string;
};

export function CompatibilityBreakdownCard({ breakdown, matchName }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return colors.secondary[500];
    if (score >= 70) return colors.primary[500];
    if (score >= 55) return colors.accent[500];
    return colors.error[500];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'intent':
        return <Heart size={14} color={colors.neutral[300]} strokeWidth={2} />;
      case 'communication':
        return <MessageCircle size={14} color={colors.neutral[300]} strokeWidth={2} />;
      case 'values':
        return <Scale size={14} color={colors.neutral[300]} strokeWidth={2} />;
      case 'lifestyle':
        return <Zap size={14} color={colors.neutral[300]} strokeWidth={2} />;
      default:
        return <Sparkles size={14} color={colors.neutral[300]} strokeWidth={2} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.overallCircle}>
          <Text style={styles.overallScore}>{breakdown.overall}%</Text>
          <Text style={styles.overallLabel}>Overall</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>
            {matchName ? `Compatibility with ${matchName}` : 'Compatibility breakdown'}
          </Text>
          <Text style={styles.subtitle}>
            {breakdown.coverage < 100
              ? `Based on ${breakdown.coverage}% of your answers`
              : 'Based on values, lifestyle & communication'}
          </Text>
        </View>
      </View>

      {breakdown.sharedValues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Shared values</Text>
          {breakdown.sharedValues.map((val, i) => (
            <View key={i} style={styles.tagRow}>
              <View style={styles.tagIcon}>
                <Check size={12} color={colors.secondary[600]} strokeWidth={3} />
              </View>
              <Text style={styles.tagText}>{val}</Text>
            </View>
          ))}
        </View>
      )}

      {breakdown.complementary.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Complementary</Text>
          {breakdown.complementary.map((val, i) => (
            <View key={i} style={styles.tagRow}>
              <View style={styles.tagIconAccent}>
                <Sparkles size={12} color={colors.accent[600]} strokeWidth={2} />
              </View>
              <Text style={styles.tagText}>{val}</Text>
            </View>
          ))}
        </View>
      )}

      {breakdown.conflicts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Points of difference</Text>
          {breakdown.conflicts.map((conflict, i) => (
            <View key={i} style={styles.conflictRow}>
              <View
                style={[
                  styles.conflictIcon,
                  conflict.severity === 'dealbreaker' && styles.conflictIconDealbreaker,
                ]}
              >
                <AlertTriangle
                  size={12}
                  color={conflict.severity === 'dealbreaker' ? colors.error[600] : colors.warning[600]}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.conflictTextWrap}>
                <Text style={styles.conflictQuestion} numberOfLines={1}>
                  {conflict.question}
                </Text>
                <Text style={styles.conflictReason}>{conflict.reason}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.scoresSection}>
        {breakdown.categoryScores.map((cat) => {
          const scoreColor = getScoreColor(cat.score);
          return (
            <View key={cat.category} style={styles.scoreRow}>
              <View style={styles.scoreLabelRow}>
                {getCategoryIcon(cat.category)}
                <Text style={styles.scoreLabel}>{cat.label}</Text>
              </View>
              <View style={styles.scoreBarContainer}>
                <View style={styles.scoreBarTrack}>
                  <View
                    style={[
                      styles.scoreBarFill,
                      { width: `${cat.score}%`, backgroundColor: scoreColor },
                    ]}
                  />
                </View>
                <Text style={[styles.scorePercent, { color: scoreColor }]}>
                  {cat.score}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadow.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  overallCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallScore: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: colors.primary[600],
  },
  overallLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.neutral[200],
    marginTop: 1,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.neutral[500],
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral[100],
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.neutral[300],
    marginBottom: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  tagIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagIconAccent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.neutral[400],
  },
  conflictRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  conflictIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.warning[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  conflictIconDealbreaker: {
    backgroundColor: colors.error[50],
  },
  conflictTextWrap: {
    flex: 1,
  },
  conflictQuestion: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.neutral[400],
  },
  conflictReason: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[200],
    marginTop: 1,
  },
  scoresSection: {
    marginTop: spacing.sm,
    gap: spacing.sm + 2,
  },
  scoreRow: {
    gap: 4,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  scoreLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.neutral[300],
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral[20],
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scorePercent: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    minWidth: 32,
    textAlign: 'right',
  },
});
