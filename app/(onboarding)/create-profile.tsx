import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera, Check, ImagePlus, X } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { interestOptions, promptQuestions } from '@/data/profiles';

const TOTAL_STEPS = 5;

export default function CreateProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [promptAnswer, setPromptAnswer] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const pickPhoto = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0 && photos.length < 4) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  }, [photos.length]);

  const takeSelfie = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take a selfie.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      Alert.alert('Verified!', 'Your selfie has been captured for verification.');
    }
  }, []);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 6
          ? [...prev, interest]
          : prev
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const canProceed = () => {
    if (step === 0) return name.trim() && age.trim() && city.trim();
    return true;
  };

  return (
    <LinearGradient
      colors={[colors.primary[50], '#fff']}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.neutral[500]} />
          </TouchableOpacity>
          <ProgressBar current={step + 1} total={TOTAL_STEPS} />
          <View style={styles.backSpacer} />
        </View>

        <Text style={styles.stepCount}>
          Step {step + 1} of {TOTAL_STEPS}
        </Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <View>
              <Text style={styles.heading}>Let's start with you</Text>
              <Text style={styles.subheading}>
                Tell us a bit about who you are.
              </Text>

              <View style={styles.photoRow}>
                {photos.length > 0 ? (
                  <View style={styles.photoGrid}>
                    {photos.map((uri, i) => (
                      <View key={i} style={styles.photoSlot}>
                        <Image source={{ uri }} style={styles.photoImg} />
                        <TouchableOpacity
                          style={styles.photoRemove}
                          onPress={() => removePhoto(i)}
                        >
                          <X size={14} color="#fff" strokeWidth={3} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {photos.length < 4 && (
                      <TouchableOpacity style={styles.addPhotoSlot} onPress={pickPhoto}>
                        <ImagePlus size={22} color={colors.primary[500]} strokeWidth={2} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View style={styles.photoUploader}>
                    <TouchableOpacity style={styles.mainPhoto} onPress={pickPhoto}>
                      <Camera size={32} color={colors.neutral[100]} strokeWidth={1.5} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addPhotoBtn} onPress={pickPhoto}>
                      <ImagePlus size={20} color={colors.primary[500]} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.hint}>
                {photos.length > 0
                  ? `${photos.length}/4 photos added`
                  : 'Add at least 2 photos. A clear face photo works best.'}
              </Text>

              <Text style={styles.inputLabel}>Your name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Amara"
                placeholderTextColor={colors.neutral[50]}
              />

              <Text style={styles.inputLabel}>Your age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 26"
                keyboardType="numeric"
                placeholderTextColor={colors.neutral[50]}
                maxLength={2}
              />

              <Text style={styles.inputLabel}>Your city</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Lagos, Nigeria"
                placeholderTextColor={colors.neutral[50]}
              />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.heading}>What makes you, you?</Text>
              <Text style={styles.subheading}>
                Pick up to 6 interests that define you.
              </Text>
              <View style={styles.chipsContainer}>
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    selected={interests.includes(interest)}
                    onPress={() => toggleInterest(interest)}
                  />
                ))}
              </View>
              <Text style={styles.selectionCount}>
                {interests.length}/6 selected
              </Text>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.heading}>Your story</Text>
              <Text style={styles.subheading}>
                Write a short bio that shows who you are. Authenticity wins.
              </Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="I'm a designer who loves jollof, jazz, and deep conversations..."
                placeholderTextColor={colors.neutral[50]}
                multiline
                textAlignVertical="top"
                maxLength={300}
              />
              <Text style={styles.selectionCount}>
                {bio.length}/300
              </Text>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.heading}>Pick a prompt</Text>
              <Text style={styles.subheading}>
                Answer one question that helps people get to know you.
              </Text>
              <View style={styles.promptsContainer}>
                {promptQuestions.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedPrompt(i)}
                    style={[
                      styles.promptCard,
                      selectedPrompt === i && styles.promptCardSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.promptQuestion,
                        selectedPrompt === i && styles.promptQuestionSelected,
                      ]}
                    >
                      {q}
                    </Text>
                    {selectedPrompt === i && (
                      <View style={styles.promptCheck}>
                        <Check size={16} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>Your answer</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={promptAnswer}
                onChangeText={setPromptAnswer}
                placeholder="Share something real..."
                placeholderTextColor={colors.neutral[50]}
                multiline
                textAlignVertical="top"
                maxLength={200}
              />
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.heading}>Verify yourself</Text>
              <Text style={styles.subheading}>
                Take a quick selfie so we know you're real. This stays private.
              </Text>
              <View style={styles.verifyContainer}>
                <View style={styles.verifyCircle}>
                  <Camera size={48} color={colors.primary[500]} strokeWidth={1.5} />
                </View>
                <Text style={styles.verifyText}>
                  Tap to take a selfie. We'll compare it to your photos to confirm
                  it's really you.
                </Text>
                <TouchableOpacity style={styles.verifyBtn} onPress={takeSelfie}>
                  <Text style={styles.verifyBtnText}>Take selfie</Text>
                </TouchableOpacity>
                <Text style={styles.hint}>
                  Verification helps keep ife authentic. Your selfie is never shared.
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Your profile summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Name</Text>
                  <Text style={styles.summaryValue}>{name || '—'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Age</Text>
                  <Text style={styles.summaryValue}>{age || '—'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>City</Text>
                  <Text style={styles.summaryValue}>{city || '—'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Interests</Text>
                  <Text style={styles.summaryValue}>{interests.length} selected</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Photos</Text>
                  <Text style={styles.summaryValue}>{photos.length} added</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={step === TOTAL_STEPS - 1 ? 'Start discovering' : 'Continue'}
            onPress={handleNext}
            disabled={!canProceed()}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    ...shadow.sm,
  },
  backSpacer: {
    width: 40,
  },
  stepCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.neutral[100],
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.neutral[600],
    lineHeight: 34,
  },
  subheading: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[200],
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  photoUploader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  mainPhoto: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[20],
    borderWidth: 2,
    borderColor: colors.primary[100],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBtn: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    borderWidth: 1.5,
    borderColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRow: {
    marginBottom: spacing.sm,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoSlot: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    borderWidth: 1.5,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral[100],
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.neutral[400],
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.neutral[40],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[600],
  },
  bioInput: {
    height: 120,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectionCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.neutral[100],
    marginTop: spacing.sm,
  },
  promptsContainer: {
    gap: spacing.sm,
  },
  promptCard: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.neutral[40],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  promptQuestion: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.neutral[400],
    flex: 1,
  },
  promptQuestionSelected: {
    color: colors.primary[700],
  },
  promptCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  verifyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  verifyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  verifyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[300],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  verifyBtn: {
    backgroundColor: colors.neutral[600],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  verifyBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    ...shadow.sm,
  },
  summaryTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.neutral[500],
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.neutral[200],
  },
  summaryValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.neutral[500],
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
