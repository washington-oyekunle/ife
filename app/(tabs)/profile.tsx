import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
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
  Check,
  X,
  Plus,
} from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { interestOptions } from '@/data/profiles';
import { fetchMyProfile, updateProfile } from '@/lib/api';
import type { DbProfile } from '@/lib/types';

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState(
    'https://images.pexels.com/photos/37038761/pexels-photo-37038761.jpeg?auto=compress&cs=tinysrgb&h=400&w=400'
  );
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(
    'Designer by day, jollof critic by night. I love old soul music, weekend markets, and conversations that go deep quickly.'
  );
  const [interests, setInterests] = useState(['Art', 'Music', 'Cooking', 'Travel', 'Fashion']);
  const [promptAnswer, setPromptAnswer] = useState(
    "Jollof at my mom's, a gallery opening, and dancing to Fela until midnight."
  );
  const [profileName, setProfileName] = useState('Amara');
  const [profileAge, setProfileAge] = useState('26');
  const [profileCity, setProfileCity] = useState('Lagos, Nigeria');
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMyProfile()
      .then((me) => {
        if (!me || !active) return;
        const p = me as DbProfile;
        setMyProfileId(p.id);
        setProfileName(p.name);
        setProfileAge(String(p.age));
        setProfileCity(`${p.city}, ${p.country}`);
        if (p.bio) setBio(p.bio);
        if (p.interests.length > 0) setInterests(p.interests);
        if (p.photos.length > 0) setAvatarUri(p.photos[0]);
        if (p.prompts.length > 0) setPromptAnswer(p.prompts[0].answer);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const pickAvatar = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to change your picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 8
          ? [...prev, interest]
          : prev
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {editing ? (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                setEditing(false);
                if (myProfileId) {
                  updateProfile(myProfileId, {
                    bio,
                    interests,
                    prompts: [{ question: 'My ideal weekend looks like...', answer: promptAnswer }],
                  } as Partial<DbProfile>).catch(() => undefined);
                }
              }}
            >
              <Check size={20} color={colors.secondary[600]} strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.settingsBtn}>
              <Settings size={22} color={colors.neutral[400]} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn} onPress={pickAvatar}>
              <Camera size={16} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profileName}</Text>
            <Text style={styles.age}>{profileAge}</Text>
            <BadgeCheck size={22} color={colors.secondary[500]} strokeWidth={2} />
          </View>
          <Text style={styles.location}>{profileCity}</Text>

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
            {editing ? (
              <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditing(false)}>
                <X size={15} color={colors.error[500]} strokeWidth={2} />
                <Text style={styles.cancelEditText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                <Edit3 size={15} color={colors.primary[600]} strokeWidth={2} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {editing ? (
            <TextInput
              style={[styles.bio, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
              maxLength={300}
              autoFocus
            />
          ) : (
            <Text style={styles.bio}>{bio}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          {editing ? (
            <View style={styles.interestsEditContainer}>
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    style={[styles.interestTagEdit, selected && styles.interestTagEditSelected]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text
                      style={[
                        styles.interestTextEdit,
                        selected && styles.interestTextEditSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.interestsContainer}>
              {interests.map((interest) => (
                <View key={interest} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prompts</Text>
          <View style={styles.promptCard}>
            <Text style={styles.promptQ}>My ideal weekend looks like...</Text>
            {editing ? (
              <TextInput
                style={[styles.promptA, styles.promptInput]}
                value={promptAnswer}
                onChangeText={setPromptAnswer}
                multiline
                textAlignVertical="top"
                maxLength={200}
              />
            ) : (
              <Text style={styles.promptA}>{promptAnswer}</Text>
            )}
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
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  saveBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.secondary[600],
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
  cancelEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelEditText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.error[500],
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[400],
    lineHeight: 23,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestsEditContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
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
  interestTagEdit: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[20],
    borderWidth: 1.5,
    borderColor: colors.neutral[40],
  },
  interestTagEditSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  interestTextEdit: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.neutral[400],
  },
  interestTextEditSelected: {
    color: colors.primary[700],
    fontFamily: fonts.bodySemiBold,
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
  promptInput: {
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.neutral[10],
    minHeight: 80,
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
