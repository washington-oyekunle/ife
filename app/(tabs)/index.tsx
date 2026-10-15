import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Heart,
  Star,
  MapPin,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
  Check,
} from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { discoverProfiles, Profile, myValuesAnswers } from '@/data/profiles';
import { calculateCompatibility } from '@/data/values';
import { CompatibilityBreakdownCard } from '@/components/CompatibilityBreakdownCard';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.62;

export default function DiscoverScreen() {
  const [profiles, setProfiles] = useState(discoverProfiles);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [superLikedIds, setSuperLikedIds] = useState<string[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [photoIndices, setPhotoIndices] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [appliedDistance, setAppliedDistance] = useState(50);
  const [appliedMinAge, setAppliedMinAge] = useState(18);
  const [appliedMaxAge, setAppliedMaxAge] = useState(45);

  const handleAction = (action: 'pass' | 'like' | 'superlike') => {
    if (profiles.length === 0) return;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (action === 'like') {
        setLikedIds((prev) => [...prev, profiles[0].id]);
        if (profiles[0].compatibility >= 85) {
          setMatchedProfile(profiles[0]);
        }
      } else if (action === 'superlike') {
        setSuperLikedIds((prev) => [...prev, profiles[0].id]);
        setMatchedProfile(profiles[0]);
      }
      setProfiles((prev) => prev.slice(1));
      fadeAnim.setValue(1);
    });
  };

  const current = profiles[0];
  const next = profiles[1];

  const getPhotoIndex = (id: string) => photoIndices[id] ?? 0;
  const setPhotoIndex = (id: string, idx: number) =>
    setPhotoIndices((prev) => ({ ...prev, [id]: idx }));

  const applyFilters = () => {
    setAppliedDistance(maxDistance);
    setAppliedMinAge(minAge);
    setAppliedMaxAge(maxAge);
    setShowFilters(false);
  };

  const renderCard = (profile: Profile, isTop: boolean) => {
    if (!profile) return <View style={styles.emptyCard} />;
    const photoIdx = getPhotoIndex(profile.id);

    return (
      <View style={styles.cardWrapper}>
        <Image
          source={{ uri: profile.photos[photoIdx] }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.85)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.age}>{profile.age}</Text>
                {profile.verified && (
                  <BadgeCheck size={20} color={colors.secondary[400]} strokeWidth={2} />
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={13} color="#fff" opacity={0.85} strokeWidth={2} />
                <Text style={styles.location}>
                  {profile.city}, {profile.country} · {profile.distance}km away
                </Text>
              </View>
              {isTop && (
                <Text style={styles.bio} numberOfLines={2}>
                  {profile.bio}
                </Text>
              )}
            </View>

            <View style={styles.interestRow}>
              {profile.interests.slice(0, 3).map((interest) => (
                <View key={interest} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
              {profile.interests.length > 3 && (
                <Text style={styles.interestMore}>
                  +{profile.interests.length - 3}
                </Text>
              )}
            </View>

            {isTop && (
              <TouchableOpacity
                style={styles.viewProfileBtn}
                onPress={() => setDetailProfile(profile)}
              >
                <Text style={styles.viewProfileText}>View full profile</Text>
              </TouchableOpacity>
            )}

            {!isTop && (
              <View style={styles.compatibilityBadge}>
                <Sparkles size={14} color={colors.accent[500]} strokeWidth={2} />
                <Text style={styles.compatibilityText}>
                  {profile.compatibility}% match
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {isTop && profile.photos.length > 1 && (
          <View style={styles.photoDots}>
            {profile.photos.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.photoDot,
                  idx === photoIdx && styles.photoDotActive,
                ]}
              />
            ))}
          </View>
        )}

        {isTop && (
          <View style={styles.photoNav}>
            <TouchableOpacity
              style={styles.photoNavLeft}
              onPress={() =>
                setPhotoIndex(
                  profile.id,
                  Math.max(0, photoIdx - 1)
                )
              }
            />
            <TouchableOpacity
              style={styles.photoNavRight}
              onPress={() =>
                setPhotoIndex(
                  profile.id,
                  Math.min(profile.photos.length - 1, photoIdx + 1)
                )
              }
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>ife</Text>
        <TouchableOpacity
          style={styles.filterPill}
          onPress={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={16} color={colors.primary[600]} strokeWidth={2} />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {profiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart size={48} color={colors.neutral[40]} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>You're all caught up!</Text>
          <Text style={styles.emptyText}>
            Check back later for more people in your area.
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setProfiles(discoverProfiles);
              setLikedIds([]);
              setSuperLikedIds([]);
            }}
          >
            <Text style={styles.resetBtnText}>Discover again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardStack}>
          <Animated.View style={[styles.cardSlot, { opacity: fadeAnim }]}>
            {next && <View style={styles.cardOffset}>{renderCard(next, false)}</View>}
          </Animated.View>
          <View style={styles.cardSlot}>{renderCard(current, true)}</View>
        </View>
      )}

      {profiles.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.passBtn}
            activeOpacity={0.85}
            onPress={() => handleAction('pass')}
          >
            <X size={28} color={colors.error[500]} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.superLikeBtn}
            activeOpacity={0.85}
            onPress={() => handleAction('superlike')}
          >
            <Star size={24} color={colors.accent[500]} strokeWidth={2} fill={colors.accent[100]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.likeBtn}
            activeOpacity={0.85}
            onPress={() => handleAction('like')}
          >
            <Heart size={28} color="#fff" strokeWidth={2.5} fill="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Match notification */}
      <Modal
        visible={!!matchedProfile}
        animationType="fade"
        transparent
        onRequestClose={() => setMatchedProfile(null)}
      >
        <View style={styles.matchOverlay}>
          <View style={styles.matchCard}>
            <View style={styles.matchIconCircle}>
              <Heart size={40} color="#fff" strokeWidth={2.5} fill="#fff" />
            </View>
            <Text style={styles.matchTitle}>It's a match!</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchedProfile?.name} liked each other
            </Text>
            <Image
              source={{ uri: matchedProfile?.photos[0] }}
              style={styles.matchPhoto}
            />
            <View style={styles.matchActions}>
              <TouchableOpacity
                style={styles.matchKeepSwiping}
                onPress={() => setMatchedProfile(null)}
              >
                <Text style={styles.matchKeepSwipingText}>Keep swiping</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.matchSayHi}
                onPress={() => {
                  setMatchedProfile(null);
                  setDetailProfile(null);
                }}
              >
                <Text style={styles.matchSayHiText}>Say hi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filters modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filterOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={colors.neutral[400]} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>
                Maximum distance: {maxDistance}km
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[10, 25, 50, 100, 200].map((dist) => (
                  <TouchableOpacity
                    key={dist}
                    style={[
                      styles.filterChip,
                      maxDistance === dist && styles.filterChipActive,
                    ]}
                    onPress={() => setMaxDistance(dist)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        maxDistance === dist && styles.filterChipTextActive,
                      ]}
                    >
                      {dist}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Age range: {minAge} - {maxAge}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[18, 22, 25, 30, 35, 40, 45].map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[
                      styles.filterChip,
                      minAge === a && styles.filterChipActive,
                    ]}
                    onPress={() => setMinAge(a)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        minAge === a && styles.filterChipTextActive,
                      ]}
                    >
                      {a}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
                {[25, 30, 35, 40, 45, 50, 55].map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[
                      styles.filterChip,
                      maxAge === a && styles.filterChipActive,
                    ]}
                    onPress={() => setMaxAge(a)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        maxAge === a && styles.filterChipTextActive,
                      ]}
                    >
                      {a}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterApplied}>
              {appliedDistance !== 50 && (
                <View style={styles.appliedPill}>
                  <Text style={styles.appliedPillText}>{appliedDistance}km</Text>
                </View>
              )}
              {(appliedMinAge !== 18 || appliedMaxAge !== 45) && (
                <View style={styles.appliedPill}>
                  <Text style={styles.appliedPillText}>
                    {appliedMinAge}-{appliedMaxAge}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Check size={20} color="#fff" strokeWidth={2.5} />
              <Text style={styles.applyBtnText}>Apply filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detail modal */}
      <Modal
        visible={!!detailProfile}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDetailProfile(null)}
      >
        {detailProfile && (
          <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: detailProfile.photos[0] }}
              style={styles.detailImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.detailImageGradient}
            >
              <TouchableOpacity
                style={styles.detailClose}
                onPress={() => setDetailProfile(null)}
              >
                <X size={24} color="#fff" strokeWidth={2} />
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailName}>{detailProfile.name}</Text>
                <Text style={styles.detailAge}>{detailProfile.age}</Text>
                {detailProfile.verified && (
                  <BadgeCheck size={22} color={colors.secondary[500]} strokeWidth={2} />
                )}
              </View>

              <View style={styles.detailCompatBar}>
                <View style={styles.detailCompatInner}>
                  <Sparkles size={16} color={colors.primary[600]} strokeWidth={2} />
                  <Text style={styles.detailCompatText}>
                    {detailProfile.compatibility}% compatible with you
                  </Text>
                </View>
              </View>

              <View style={styles.detailBreakdownWrap}>
                <CompatibilityBreakdownCard
                  breakdown={calculateCompatibility(myValuesAnswers, detailProfile.valuesAnswers)}
                  matchName={detailProfile.name}
                />
              </View>

              <View style={styles.detailInfoRow}>
                <MapPin size={18} color={colors.neutral[200]} strokeWidth={2} />
                <Text style={styles.detailInfoText}>
                  {detailProfile.city}, {detailProfile.country}
                </Text>
              </View>
              <View style={styles.detailInfoRow}>
                <Briefcase size={18} color={colors.neutral[200]} strokeWidth={2} />
                <Text style={styles.detailInfoText}>{detailProfile.occupation}</Text>
              </View>
              <View style={styles.detailInfoRow}>
                <GraduationCap size={18} color={colors.neutral[200]} strokeWidth={2} />
                <Text style={styles.detailInfoText}>{detailProfile.education}</Text>
              </View>

              <Text style={styles.detailSectionTitle}>About</Text>
              <Text style={styles.detailBio}>{detailProfile.bio}</Text>

              <Text style={styles.detailSectionTitle}>Interests</Text>
              <View style={styles.detailInterests}>
                {detailProfile.interests.map((interest) => (
                  <View key={interest} style={styles.detailInterestTag}>
                    <Text style={styles.detailInterestText}>{interest}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.detailSectionTitle}>Prompts</Text>
              {detailProfile.prompts.map((prompt, i) => (
                <View key={i} style={styles.detailPromptCard}>
                  <Text style={styles.detailPromptQ}>{prompt.question}</Text>
                  <Text style={styles.detailPromptA}>{prompt.answer}</Text>
                </View>
              ))}

              <View style={styles.detailGallery}>
                {detailProfile.photos.slice(1).map((photo, i) => (
                  <Image
                    key={i}
                    source={{ uri: photo }}
                    style={styles.detailGalleryPhoto}
                  />
                ))}
              </View>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={styles.detailPassBtn}
                  onPress={() => {
                    setDetailProfile(null);
                    handleAction('pass');
                  }}
                >
                  <X size={26} color={colors.error[500]} strokeWidth={2.5} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailSuperLikeBtn}
                  onPress={() => {
                    setDetailProfile(null);
                    handleAction('superlike');
                  }}
                >
                  <Star size={24} color={colors.accent[500]} strokeWidth={2} fill={colors.accent[100]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailLikeBtn}
                  onPress={() => {
                    setDetailProfile(null);
                    handleAction('like');
                  }}
                >
                  <Heart size={26} color="#fff" strokeWidth={2.5} fill="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[10],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  logo: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    color: colors.primary[600],
    letterSpacing: -0.5,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  filterText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.primary[700],
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSlot: {
    position: 'absolute',
    width: width - 32,
    height: CARD_HEIGHT,
  },
  cardOffset: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadow.lg,
  },
  emptyCard: {
    display: 'none',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: '#fff',
  },
  age: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#fff',
    opacity: 0.85,
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: spacing.xs + 2,
    lineHeight: 20,
  },
  interestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
  },
  interestText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: '#fff',
  },
  interestMore: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
  },
  viewProfileBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  viewProfileText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: '#fff',
  },
  compatibilityBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 5,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
  },
  compatibilityText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.primary[700],
  },
  photoDots: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: 4,
  },
  photoDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  photoDotActive: {
    backgroundColor: '#fff',
  },
  photoNav: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    bottom: 200,
    flexDirection: 'row',
  },
  photoNavLeft: {
    flex: 1,
  },
  photoNavRight: {
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  passBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[30],
    ...shadow.md,
  },
  superLikeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[30],
    ...shadow.md,
  },
  likeBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.neutral[400],
    marginTop: spacing.lg,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[100],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  resetBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  resetBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#fff',
  },
  // Match overlay
  matchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    width: width - 64,
    ...shadow.lg,
  },
  matchIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  matchTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.primary[600],
  },
  matchSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[200],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  matchPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: spacing.lg,
    resizeMode: 'cover',
  },
  matchActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  matchKeepSwiping: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[20],
  },
  matchKeepSwipingText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.neutral[400],
  },
  matchSayHi: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
  },
  matchSayHiText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#fff',
  },
  // Filter modal
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  filterTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.neutral[600],
  },
  filterGroup: {
    marginBottom: spacing.xl,
  },
  filterLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.neutral[500],
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[20],
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.neutral[300],
  },
  filterChipTextActive: {
    color: colors.primary[700],
    fontFamily: fonts.bodySemiBold,
  },
  filterApplied: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  appliedPill: {
    backgroundColor: colors.primary[100],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  appliedPillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.primary[700],
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
  },
  applyBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#fff',
  },
  // Detail modal
  detailScroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailImage: {
    width: '100%',
    height: 440,
    resizeMode: 'cover',
  },
  detailImageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 440,
  },
  detailClose: {
    position: 'absolute',
    top: spacing.xl + 8,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailName: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    color: colors.neutral[600],
  },
  detailAge: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.neutral[200],
  },
  detailCompatBar: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  detailCompatInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailCompatText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[700],
  },
  detailBreakdownWrap: {
    marginTop: spacing.md,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm + 2,
  },
  detailInfoText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[400],
  },
  detailSectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.neutral[500],
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  detailBio: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[400],
    lineHeight: 24,
  },
  detailInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailInterestTag: {
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  detailInterestText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[700],
  },
  detailPromptCard: {
    backgroundColor: colors.neutral[10],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailPromptQ: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  detailPromptA: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[400],
    lineHeight: 23,
  },
  detailGallery: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  detailGalleryPhoto: {
    flex: 1,
    height: 180,
    borderRadius: borderRadius.lg,
    resizeMode: 'cover',
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  detailPassBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.error[100],
    ...shadow.md,
  },
  detailSuperLikeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[30],
    ...shadow.md,
  },
  detailLikeBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
});
