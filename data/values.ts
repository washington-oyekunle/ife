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
  sharedValues: string[];
  complementary: string[];
  conflicts: CompatibilityConflict[];
  categoryScores: { category: string; label: string; score: number }[];
};

type CategoryConfig = {
  weight: number;
  penalizeGaps: boolean;
};

const categoryConfig: Record<string, CategoryConfig> = {
  intent: { weight: 1.4, penalizeGaps: true },
  communication: { weight: 1.0, penalizeGaps: false },
  values: { weight: 1.5, penalizeGaps: true },
  lifestyle: { weight: 0.9, penalizeGaps: false },
};

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
  const categoryQuestions: Record<string, string[]> = {};

  valuesQuestions.forEach((q) => {
    if (!categoryQuestions[q.category]) categoryQuestions[q.category] = [];
    categoryQuestions[q.category].push(q.id);
  });

  const categoryScores: { category: string; label: string; score: number }[] = [];
  const sharedValues: string[] = [];
  const complementary: string[] = [];
  const conflicts: CompatibilityConflict[] = [];

  const questionMap = new Map(valuesQuestions.map((q) => [q.id, q]));

  categories.forEach((cat) => {
    const qIds = categoryQuestions[cat] || [];
    const config = categoryConfig[cat] || { weight: 1, penalizeGaps: false };
    let weightedDiffSum = 0;
    let weightTotal = 0;
    let exactMatches = 0;
    let closeMatches = 0;

    qIds.forEach((qId) => {
      const question = questionMap.get(qId);
      if (!question) return;

      const myVal = myAnswers[qId];
      const theirVal = theirAnswers[qId];
      if (myVal === undefined || theirVal === undefined) return;

      const diff = Math.abs(myVal - theirVal);

      const questionWeight = question.isDealbreaker ? 2.0 : 1.0;
      weightedDiffSum += diff * questionWeight;
      weightTotal += 3 * questionWeight;

      if (diff === 0) {
        exactMatches++;
        if (cat === 'values') {
          sharedValues.push(getSharedValueLabel(qId, myVal));
        }
      } else if (diff === 1) {
        closeMatches++;
        if (cat === 'communication') {
          complementary.push('Complementary communication styles');
        }
      } else if (diff >= 2 && cat === 'lifestyle') {
        complementary.push('Different-but-balanced lifestyle rhythms');
      }

      if (question.isDealbreaker && diff >= 2) {
        conflicts.push({
          question: question.question,
          reason: 'Far apart on a dealbreaker question',
          severity: 'dealbreaker',
        });
      } else if (diff >= 3) {
        conflicts.push({
          question: question.question,
          reason: 'Opposite ends of the spectrum',
          severity: 'mismatch',
        });
      } else if (diff === 2 && config.penalizeGaps && question.isDealbreaker) {
        conflicts.push({
          question: question.question,
          reason: 'Notable gap on a key question',
          severity: 'mismatch',
        });
      }
    });

    const score = weightTotal > 0
      ? Math.round(100 - (weightedDiffSum / weightTotal) * 100)
      : 70;

    categoryScores.push({
      category: cat,
      label: categoryLabels[cat],
      score: Math.max(20, Math.min(100, score)),
    });
  });

  const totalWeight = categories.reduce(
    (sum, cat) => sum + (categoryConfig[cat]?.weight || 1),
    0
  );
  const weightedSum = categoryScores.reduce(
    (sum, c) => sum + c.score * (categoryConfig[c.category]?.weight || 1),
    0
  );
  let overall = Math.round(weightedSum / totalWeight);

  const dealbreakerCount = conflicts.filter((c) => c.severity === 'dealbreaker').length;
  overall -= dealbreakerCount * 12;
  overall = Math.max(5, Math.min(100, overall));

  const uniqueShared = [...new Set(sharedValues)].slice(0, 3);
  const uniqueComplementary = [...new Set(complementary)].slice(0, 2);

  if (uniqueShared.length === 0) {
    const valuesScore = categoryScores.find((c) => c.category === 'values');
    if (valuesScore && valuesScore.score >= 70) {
      uniqueShared.push('Shared core values');
    }
  }
  if (uniqueComplementary.length === 0) {
    const commScore = categoryScores.find((c) => c.category === 'communication');
    if (commScore && commScore.score >= 70) {
      uniqueComplementary.push('Thoughtful communicator');
    }
  }

  const topConflicts = conflicts.slice(0, 2);

  return {
    overall,
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
