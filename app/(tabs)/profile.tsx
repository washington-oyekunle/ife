import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  BadgeCheck,
  Sparkles,
  Camera,
  Heart,
  Edit3,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Settings size={22} color={colors.neutral[400]} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/37038761/pexels-photo-37038761.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Camera size={16} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Amara</Text>
            <Text style={styles.age}>26</Text>
            <BadgeCheck size={22} color={colors.secondary[500]} strokeWidth={2} />
          </View>
          <Text style={styles.location}>Lagos, Nigeria</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>94%</Text>
              <Text style={styles.statLabel}>Profile</Text>
            </View>
          </View>
        </View>

        <View style={styles.completionCard}>
          <View style={styles.completionIcon}>
            <Sparkles size={20} color={colors.accent[600]} strokeWidth={2} />
          </View>
          <View style={styles.completionInfo}>
            <Text style={styles.completionTitle}>Profile almost complete!</Text>
            <Text style={styles.completionText}>
              Add a voice note and verify your selfie to get 3x more matches.
            </Text>
          </View>
          <ChevronRight size={20} color={colors.neutral[100]} strokeWidth={2} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About me</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Edit3 size={15} color={colors.primary[600]} strokeWidth={2} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bio}>
            Designer by day, jollof critic by night. I love old soul music,
            weekend markets, and conversations that go deep quickly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {['Art', 'Music', 'Cooking', 'Travel', 'Fashion'].map((interest) => (
              <View key={interest} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prompts</Text>
          <View style={styles.promptCard}>
            <Text style={styles.promptQ}>My ideal weekend looks like...</Text>
            <Text style={styles.promptA}>
              Jollof at my mom's, a gallery opening, and dancing to Fela until midnight.
            </Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsRow}>
            <Shield size={20} color={colors.neutral[300]} strokeWidth={2} />
            <Text style={styles.settingsRowText}>Safety & Privacy</Text>
            <ChevronRight size={18} color={colors.neutral[100]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <Bell size={20} color={colors.neutral[300]} strokeWidth={2} />
            <Text style={styles.settingsRowText}>Notifications</Text>
            <ChevronRight size={18} color={colors.neutral[100]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <Heart size={20} color={colors.neutral[300]} strokeWidth={2} />
            <Text style={styles.settingsRowText}>ife Premium</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Upgrade</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <HelpCircle size={20} color={colors.neutral[300]} strokeWidth={2} />
            <Text style={styles.settingsRowText}>Help & Support</Text>
            <ChevronRight size={18} color={colors.neutral[100]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingsRow, styles.settingsLastRow]}>
            <LogOut size={20} color={colors.error[500]} strokeWidth={2} />
            <Text style={[styles.settingsRowText, { color: colors.error[500] }]}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>ife v1.0.0</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.neutral[600],
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadow.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    resizeMode: 'cover',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    color: colors.neutral[600],
  },
  age: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.neutral[200],
  },
  location: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.neutral[200],
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.primary[600],
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[100],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral[30],
  },
  completionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.accent[50],
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  completionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionInfo: {
    flex: 1,
  },
  completionTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.neutral[500],
  },
  completionText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral[200],
    marginTop: 2,
    lineHeight: 19,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.neutral[500],
    marginBottom: spacing.sm,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[600],
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[400],
    lineHeight: 23,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestTag: {
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  interestText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[700],
  },
  promptCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  promptQ: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  promptA: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[400],
    lineHeight: 23,
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[20],
  },
  settingsLastRow: {
    borderBottomWidth: 0,
  },
  settingsRowText: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.neutral[400],
  },
  premiumBadge: {
    backgroundColor: colors.accent[500],
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
  },
  premiumText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.neutral[700],
  },
  version: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[100],
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
});
