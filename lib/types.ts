export type DbProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  occupation: string | null;
  education: string | null;
  bio: string | null;
  photos: string[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  values_answers: Record<string, number>;
  verified: boolean;
  is_me: boolean;
  created_at: string;
};

export type DbSwipe = {
  id: string;
  swiper_id: string;
  swiped_id: string;
  action: 'like' | 'pass' | 'superlike';
  created_at: string;
};

export type DbConversation = {
  id: string;
  profile_a_id: string;
  profile_b_id: string;
  created_at: string;
};

export type DbMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type DbBlock = {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason: string | null;
  created_at: string;
};
