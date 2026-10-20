export type QuestionOption = {
  label: string;
  value: number;
};

export type ValuesQuestion = {
  id: string;
  category: 'intent' | 'communication' | 'values' | 'lifestyle';
  question: string;
  helperText?: string;
  isDealbreaker?: boolean;
  options: QuestionOption[];
};

export const categoryMeta: Record<string, { label: string; emoji: string }> = {
  intent: { label: 'Relationship Intent', emoji: 'heart' },
  communication: { label: 'Communication Style', emoji: 'chat' },
  values: { label: 'Core Values', emoji: 'scale' },
  lifestyle: { label: 'Lifestyle Pace', emoji: 'zap' },
};

export type ValuesAnswers = Record<string, number>;

export type CompatibilityConflict = {
  question: string;
  reason: string;
  severity: 'dealbreaker' | 'mismatch';
};

export type CompatibilityBreakdown = {
  overall: number;
  coverage: number;
  sharedValues: string[];
  complementary: string[];
  conflicts: CompatibilityConflict[];
  categoryScores: { category: string; label: string; score: number }[];
};

// Category weights balance the overall score; question weights distinguish
// high-impact topics from preferences that are usually easier to negotiate.
const categoryWeights: Record<string, number> = {
  intent: 1.3,
  communication: 1.1,
  values: 1.35,
  lifestyle: 0.8,
};

const questionWeights: Record<string, number> = {
  intent: 1.6,
  timeline: 1.1,
  communication: 1.1,
  attachment: 0.9,
  family: 1.5,
  faith: 1.1,
  ambition: 0.9,
  pace: 0.8,
  social: 0.8,
  dealbreaker: 0.35,
};

const ordinalSimilarity = [100, 78, 50, 20];

export const valuesQuestions: ValuesQuestion[] = [
  {
    id: 'intent',
    category: 'intent',
    question: 'What are you looking for right now?',
    helperText: 'This helps us filter out people who want different things.',
    options: [
      { label: 'Something casual', value: 0 },
      { label: 'Open to seeing where it goes', value: 1 },
      { label: 'A serious relationship', value: 2 },
      { label: 'Marriage-minded', value: 3 },
    ],
  },
  {
    id: 'timeline',
    category: 'intent',
    question: 'How soon do you see yourself settling down?',
    helperText: 'We match people with similar timelines.',
    options: [
      { label: 'Not on my mind yet', value: 0 },
      { label: 'Maybe in a few years', value: 1 },
      { label: 'Within the next 1-2 years', value: 2 },
      { label: 'Ready when the right person comes', value: 3 },
    ],
  },
  {
    id: 'communication',
    category: 'communication',
    question: 'When something bothers you, you tend to...',
    helperText: 'Communication compatibility is one of the strongest predictors of relationship success.',
    options: [
      { label: 'Address it head-on right away', value: 0 },
      { label: 'Think it over, then bring it up', value: 1 },
      { label: 'Show it through actions, not words', value: 2 },
      { label: 'Wait for the right moment', value: 3 },
    ],
  },
  {
    id: 'attachment',
    category: 'communication',
    question: 'In relationships, you need...',
    helperText: 'Matching attachment styles reduces friction down the road.',
    options: [
      { label: 'Lots of together time', value: 0 },
      { label: 'A healthy mix of together & solo time', value: 1 },
      { label: 'Plenty of independence', value: 2 },
      { label: 'To feel deeply connected first', value: 3 },
    ],
  },
  {
    id: 'family',
    category: 'values',
    question: 'How important is having children to you?',
    helperText: 'This is often a make-or-break topic — we take it seriously.',
    options: [
      { label: 'I don\'t want children', value: 0 },
      { label: 'Open to it, not a must', value: 1 },
      { label: 'I\'d like children someday', value: 2 },
      { label: 'Children are a priority', value: 3 },
    ],
  },
  {
    id: 'faith',
    category: 'values',
    question: 'How central is faith/spirituality in your life?',
    helperText: 'Shared faith (or shared openness) deepens connection.',
    options: [
      { label: 'Not important to me', value: 0 },
      { label: 'I\'m spiritual in my own way', value: 1 },
      { label: 'Faith guides my decisions', value: 2 },
      { label: 'It\'s the foundation of my life', value: 3 },
    ],
  },
  {
    id: 'ambition',
    category: 'values',
    question: 'How would you describe your drive?',
    helperText: 'Aligned ambition means fewer conflicts about priorities.',
    options: [
      { label: 'I prioritize balance over hustle', value: 0 },
      { label: 'I\'m ambitious but family comes first', value: 1 },
      { label: 'Career is a big part of my identity', value: 2 },
      { label: 'I\'m building something big', value: 3 },
    ],
  },
  {
    id: 'pace',
    category: 'lifestyle',
    question: 'Your ideal pace of life is...',
    helperText: 'Matching pace means your day-to-day rhythms will flow together.',
    options: [
      { label: 'Slow & steady, enjoy the moment', value: 0 },
      { label: 'Balanced — productive but present', value: 1 },
      { label: 'Busy and active, lots going on', value: 2 },
      { label: 'Go-go-go, always chasing the next thing', value: 3 },
    ],
  },
  {
    id: 'social',
    category: 'lifestyle',
    question: 'Your ideal weekend looks like...',
    helperText: 'Social compatibility affects how you spend your most valuable time.',
    options: [
      { label: 'Quiet time at home', value: 0 },
      { label: 'Small gathering with close friends', value: 1 },
      { label: 'A good mix of going out & staying in', value: 2 },
      { label: 'Out and about, always social', value: 3 },
    ],
  },
  {
    id: 'dealbreaker',
    category: 'values',
    question: 'Which is the biggest deal-breaker for you?',
    helperText: 'We\'ll prioritize filtering out people who clash with this.',
    isDealbreaker: true,
    options: [
      { label: 'Lack of ambition', value: 0 },
      { label: 'Poor communication', value: 1 },
      { label: 'Different life goals', value: 2 },
      { label: 'No shared values', value: 3 },
    ],
  },
];

export const categoryLabels: Record<string, string> = {
  intent: 'Relationship Intent',
  communication: 'Communication Style',
  values: 'Core Values',
  lifestyle: 'Lifestyle Pace',
};

const categoryIcons: Record<string, string> = {
  intent: 'Relationship Intent',
  communication: 'Communication Style',
  values: 'Core Values',
  lifestyle: 'Lifestyle Pace',
};

export function calculateCompatibility(
  myAnswers: ValuesAnswers,
  theirAnswers: ValuesAnswers
): CompatibilityBreakdown {
  const categories = ['intent', 'communication', 'values', 'lifestyle'] as const;
  const categoryScores: { category: string; label: string; score: number }[] = [];
  const sharedValues: string[] = [];
  const complementary: string[] = [];
  const conflicts: CompatibilityConflict[] = [];
  const categoryCoverage: Record<string, number> = {};

  categories.forEach((cat) => {
    const questions = valuesQuestions.filter((question) => question.category === cat);
    let possibleWeight = 0;
    let answeredWeight = 0;
    let weightedScore = 0;

    questions.forEach((question) => {
      const questionWeight = questionWeights[question.id] ?? 1;
      possibleWeight += questionWeight;
      const myVal = myAnswers?.[question.id];
      const theirVal = theirAnswers?.[question.id];
      const maxValue = question.options.length - 1;
      const myAnswered = Number.isInteger(myVal) && myVal! >= 0 && myVal! <= maxValue;
      const theirAnswered = Number.isInteger(theirVal) && theirVal! >= 0 && theirVal! <= maxValue;
      if (!myAnswered || !theirAnswered) return;

      answeredWeight += questionWeight;
      const diff = Math.abs(myVal! - theirVal!);
      // A dealbreaker response is a category, not an ordered scale.
      const questionScore = question.id === 'dealbreaker'
        ? (diff === 0 ? 100 : 70)
        : ordinalSimilarity[diff];
      weightedScore += questionScore * questionWeight;

      if (diff === 0 && ['intent', 'family', 'faith', 'ambition', 'dealbreaker'].includes(question.id)) {
        sharedValues.push(getSharedValueLabel(question.id, myVal!));
      }
      if (cat === 'lifestyle' && diff === 1) {
        complementary.push(question.id === 'pace'
          ? 'Close on preferred life pace'
          : 'Similar social rhythms');
      }

      const highStakes = question.id === 'intent' || question.id === 'family';
      if ((highStakes && diff >= 2) || (!highStakes && question.id !== 'dealbreaker' && diff === 3)) {
        const myLabel = question.options.find((option) => option.value === myVal)?.label;
        const theirLabel = question.options.find((option) => option.value === theirVal)?.label;
        conflicts.push({
          question: question.question,
          reason: `You selected “${myLabel}”; they selected “${theirLabel}”.`,
          severity: highStakes && diff === 3 ? 'dealbreaker' : 'mismatch',
        });
      }
    });

    const coverage = possibleWeight > 0 ? answeredWeight / possibleWeight : 0;
    categoryCoverage[cat] = coverage;
    categoryScores.push({
      category: cat,
      label: categoryLabels[cat],
      score: answeredWeight > 0 ? Math.round(weightedScore / answeredWeight) : 50,
    });
  });

  const totalCategoryWeight = categories.reduce((sum, cat) => sum + categoryWeights[cat], 0);
  const answeredCategoryWeight = categories.reduce(
    (sum, cat) => sum + categoryWeights[cat] * categoryCoverage[cat],
    0
  );
  const weightedKnownScore = categoryScores.reduce(
    (sum, category) => sum + category.score * categoryWeights[category.category] * categoryCoverage[category.category],
    0
  );
  const knownScore = answeredCategoryWeight > 0 ? weightedKnownScore / answeredCategoryWeight : 50;
  const coverage = totalCategoryWeight > 0 ? answeredCategoryWeight / totalCategoryWeight : 0;
  let overall = Math.round(50 + (knownScore - 50) * coverage);
  const highStakesConflicts = conflicts.filter((conflict) => conflict.severity === 'dealbreaker').length;
  overall = Math.max(0, Math.min(100, overall - Math.min(10, highStakesConflicts * 5)));

  const uniqueShared = [...new Set(sharedValues)].slice(0, 3);
  const uniqueComplementary = [...new Set(complementary)].slice(0, 2);
  if (uniqueShared.length === 0) {
    const valuesScore = categoryScores.find((category) => category.category === 'values');
    if (valuesScore && valuesScore.score >= 80 && categoryCoverage.values >= 0.5) {
      uniqueShared.push('Strong alignment on core values');
    }
  }

  const topConflicts = conflicts
    .sort((a, b) => (a.severity === 'dealbreaker' ? -1 : 0) - (b.severity === 'dealbreaker' ? -1 : 0))
    .slice(0, 2);

  return {
    overall,
    coverage: Math.round(coverage * 100),
    sharedValues: uniqueShared,
    complementary: uniqueComplementary,
    conflicts: topConflicts,
    categoryScores,
  };
}

function getSharedValueLabel(questionId: string, value: number): string {
  const labels: Record<string, string[]> = {
    family: ['No kids — aligned', 'Open to kids — aligned', 'Wants kids — aligned', 'Family-first — aligned'],
    faith: ['Secular — aligned', 'Spiritual — aligned', 'Faith-guided — aligned', 'Faith-centered — aligned'],
    ambition: ['Balance-first — aligned', 'Ambitious & family-oriented — aligned', 'Career-driven — aligned', 'Builder mindset — aligned'],
    intent: ['Casual — aligned', 'Open — aligned', 'Serious — aligned', 'Marriage-minded — aligned'],
    dealbreaker: ['Values ambition', 'Values communication', 'Values aligned goals', 'Values shared principles'],
  };
  const arr = labels[questionId];
  return arr ? arr[value] : 'Aligned on values';
}
