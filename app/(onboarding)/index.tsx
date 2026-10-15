import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Heart, Shield, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors, fonts, spacing, borderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.primary[50], colors.accent[50], '#fff']}
      style={styles.container}
    >
      <View style={styles.heroImageContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/9838564/pexels-photo-9838564.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
          }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,248,232,0.6)', colors.accent[50]]}
          style={styles.heroFade}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.logo}>ife</Text>
        <Text style={styles.tagline}>Love, rooted in authenticity.</Text>

        <View style={styles.pillars}>
          <View style={styles.pillar}>
            <View style={styles.pillarIcon}>
              <Shield size={22} color={colors.secondary[600]} strokeWidth={2} />
            </View>
            <Text style={styles.pillarTitle}>Verified</Text>
            <Text style={styles.pillarText}>Real people, real intentions</Text>
          </View>
          <View style={styles.pillar}>
            <View style={styles.pillarIcon}>
              <Sparkles size={22} color={colors.accent[600]} strokeWidth={2} />
            </View>
            <Text style={styles.pillarTitle}>Compatible</Text>
            <Text style={styles.pillarText}>Matched on values</Text>
          </View>
          <View style={styles.pillar}>
            <View style={styles.pillarIcon}>
              <Heart size={22} color={colors.primary[500]} strokeWidth={2} />
            </View>
            <Text style={styles.pillarTitle}>Connection</Text>
            <Text style={styles.pillarText}>Conversations that matter</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Create your profile"
          onPress={() => router.push('/(onboarding)/create-profile')}
        />
        <Button
          label="I already have an account"
          variant="ghost"
          size="md"
          onPress={() => router.push('/(tabs)')}
        />
        <Text style={styles.terms}>
          By continuing you agree to ife's Terms & Privacy Policy.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImageContainer: {
    height: 320,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    fontFamily: fonts.headingBold,
    fontSize: 56,
    color: colors.primary[600],
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.neutral[300],
    marginTop: spacing.xs,
  },
  pillars: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  pillar: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pillarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[10],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  pillarTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.neutral[500],
  },
  pillarText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[200],
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl + 20,
    gap: spacing.sm,
  },
  terms: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[100],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
