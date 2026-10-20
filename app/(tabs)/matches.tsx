import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, BadgeCheck, Sparkles, MessageCircle } from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { matchProfiles, Profile, myValuesAnswers } from '@/data/profiles';
import { calculateCompatibility } from '@/data/values';
import { rankProfilesByFit } from '@/data/matching';
import { fetchMatchProfiles, fetchMyProfile } from '@/lib/api';
import type { DbProfile } from '@/lib/types';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 3) / 2;

function toMatchProfile(profile: DbProfile, myAnswers: typeof myValuesAnswers): Profile {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    city: profile.city,
    country: profile.country,
    occupation: profile.occupation || '',
    education: profile.education || '',
    bio: profile.bio || '',
    photos: profile.photos,
    interests: profile.interests,
    prompts: profile.prompts,
    verified: profile.verified,
    distance: 0,
    compatibility: calculateCompatibility(myAnswers, profile.values_answers).overall,
    valuesAnswers: profile.values_answers,
  };
}

function getDemoMatchProfiles(): Profile[] {
  return rankProfilesByFit(matchProfiles.map((profile) => ({
    ...profile,
    compatibility: calculateCompatibility(myValuesAnswers, profile.valuesAnswers).overall,
  })));
}

export default function MatchesScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>(getDemoMatchProfiles);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyProfile()]).then(async ([me]) => {
      if (!me) return;
      const remoteMatches = await fetchMatchProfiles(me.id);
      if (active && remoteMatches.length > 0) {
        const rankedProfiles = remoteMatches.map((profile) => toMatchProfile(profile, me.values_answers as typeof myValuesAnswers));
        setProfiles(rankProfilesByFit(rankedProfiles, me.interests || []));
      }
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Matches</Text>
          <Text style={styles.subtitle}>
            {profiles.length} people who share your spark
          </Text>
        </View>

        <View style={styles.matchGrid}>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.matchCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/(tabs)/chats`)}
            >
              <Image
                source={{ uri: profile.photos[0] }}
                style={styles.matchPhoto}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.matchGradient}
              >
                <View style={styles.matchInfo}>
                  <View style={styles.matchNameRow}>
                    <Text style={styles.matchName}>{profile.name}</Text>
                    {profile.verified && (
                      <BadgeCheck size={16} color={colors.secondary[400]} strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.matchMeta}>
                    <View style={styles.compatBadge}>
                      <Sparkles size={11} color={colors.accent[500]} strokeWidth={2} />
                      <Text style={styles.compatText}>{profile.compatibility}%</Text>
                    </View>
                    <Text style={styles.matchCity}>{profile.city}</Text>
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.chatBadge}>
                <MessageCircle size={14} color="#fff" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.likesBanner}>
          <View style={styles.likesIcon}>
            <Heart size={28} color={colors.primary[500]} strokeWidth={2} fill={colors.primary[100]} />
          </View>
          <View style={styles.likesText}>
            <Text style={styles.likesTitle}>People who liked you</Text>
            <Text style={styles.likesSub}>See who's already interested</Text>
          </View>
          <View style={styles.likesCount}>
            <Text style={styles.likesCountText}>12</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Sparkles size={20} color={colors.accent[600]} strokeWidth={2} />
          <Text style={styles.tipText}>
            Complete your profile to get 3x more matches. Add a voice note and
            a second prompt to stand out.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[10],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.neutral[600],
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[200],
    marginTop: 2,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  matchCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadow.md,
  },
  matchPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  matchInfo: {
    padding: spacing.md,
  },
  matchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  matchName: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: '#fff',
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  compatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  compatText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#fff',
  },
  matchCity: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
  },
  chatBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  likesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.md,
  },
  likesIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesText: {
    flex: 1,
  },
  likesTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.neutral[500],
  },
  likesSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral[100],
    marginTop: 2,
  },
  likesCount: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesCountText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: '#fff',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
    backgroundColor: colors.accent[50],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.neutral[400],
    lineHeight: 21,
  },
});
