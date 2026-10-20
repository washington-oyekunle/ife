import type { Profile } from './profiles';

/**
 * Rank profiles primarily by values compatibility. When the viewer's interests
 * or a candidate's distance are known, use them as smaller, normalized tie-in
 * signals rather than letting either outweigh core values.
 */
export function rankProfilesByFit<T extends Pick<Profile, 'compatibility' | 'interests' | 'distance'>>(
  profiles: T[],
  viewerInterests: string[] = []
): T[] {
  const normalize = (value: string) => value.trim().toLocaleLowerCase();
  const viewerInterestSet = new Set(viewerInterests.map(normalize).filter(Boolean));

  const metrics = profiles.map((profile, index) => {
    const profileInterestSet = new Set(profile.interests.map(normalize).filter(Boolean));
    const sharedInterestCount = [...viewerInterestSet].filter((interest) => profileInterestSet.has(interest)).length;
    const unionSize = new Set([...viewerInterestSet, ...profileInterestSet]).size;
    const interestSimilarity = unionSize > 0 ? sharedInterestCount / unionSize : 0;
    const hasInterestData = viewerInterestSet.size > 0;
    const hasDistanceData = Number.isFinite(profile.distance) && profile.distance > 0;

    // Secondary signals can add at most 3 points, so they only refine close fits.
    let rankScore = profile.compatibility;
    if (hasInterestData) {
      rankScore += interestSimilarity * 2;
    }
    if (hasDistanceData) {
      const proximityScore = Math.exp(-profile.distance / 50) * 100;
      rankScore += proximityScore * 0.01;
    }

    return {
      profile,
      index,
      rankScore,
      sharedInterestCount,
    };
  });

  return metrics
    .sort((a, b) =>
      b.rankScore - a.rankScore ||
      b.profile.compatibility - a.profile.compatibility ||
      b.sharedInterestCount - a.sharedInterestCount ||
      ((a.profile.distance > 0 && b.profile.distance > 0) ? a.profile.distance - b.profile.distance : 0) ||
      a.index - b.index
    )
    .map(({ profile }) => profile);
}
