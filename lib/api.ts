import { supabase } from './supabase';
import type { DbProfile, DbSwipe, DbConversation, DbMessage } from './types';
import type { ValuesAnswers } from '@/data/values';

// ---- Profile queries ----

export async function fetchDiscoverProfiles(currentProfileId?: string): Promise<DbProfile[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_me', false)
    .order('created_at', { ascending: false });

  if (currentProfileId) {
    query = query.neq('id', currentProfileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as DbProfile[];
}

export async function fetchMyProfile(): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_me', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

export async function fetchMatchProfiles(myProfileId: string): Promise<DbProfile[]> {
  // Get profile IDs that I liked AND who liked me back
  const { data: mySwipes, error: swipesErr } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', myProfileId)
    .eq('action', 'like');
  if (swipesErr) throw swipesErr;

  const likedIds = (mySwipes || []).map((s: { swiped_id: string }) => s.swiped_id);
  if (likedIds.length === 0) return [];

  const { data: theirSwipes, error: theirErr } = await supabase
    .from('swipes')
    .select('swiper_id')
    .eq('swiped_id', myProfileId)
    .eq('action', 'like')
    .in('swiper_id', likedIds);
  if (theirErr) throw theirErr;

  const mutualIds = (theirSwipes || []).map((s: { swiper_id: string }) => s.swiper_id);
  if (mutualIds.length === 0) return [];

  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .in('id', mutualIds);
  if (profErr) throw profErr;

  return (profiles || []) as DbProfile[];
}

export async function createProfile(profile: {
  name: string;
  age: number;
  city: string;
  country?: string;
  occupation?: string;
  education?: string;
  bio?: string;
  photos: string[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  valuesAnswers: ValuesAnswers;
  verified?: boolean;
}): Promise<DbProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      name: profile.name,
      age: profile.age,
      city: profile.city,
      country: profile.country || 'Nigeria',
      occupation: profile.occupation || null,
      education: profile.education || null,
      bio: profile.bio || null,
      photos: profile.photos,
      interests: profile.interests,
      prompts: profile.prompts,
      values_answers: profile.valuesAnswers,
      verified: profile.verified ?? false,
      is_me: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

export async function updateProfile(id: string, updates: Partial<DbProfile>): Promise<DbProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

// ---- Swipe queries ----

export async function recordSwipe(swiperId: string, swipedId: string, action: 'like' | 'pass' | 'superlike'): Promise<void> {
  const { error } = await supabase
    .from('swipes')
    .upsert({ swiper_id: swiperId, swiped_id: swipedId, action }, { onConflict: 'swiper_id,swiped_id' });
  if (error) throw error;
}

export async function fetchSwipedIds(swiperId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', swiperId);
  if (error) throw error;
  return (data || []).map((s: { swiped_id: string }) => s.swiped_id);
}

// ---- Conversation queries ----

export async function fetchConversations(myProfileId: string): Promise<DbConversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`profile_a_id.eq.${myProfileId},profile_b_id.eq.${myProfileId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbConversation[];
}

export async function getOrCreateConversation(profileAId: string, profileBId: string): Promise<DbConversation> {
  const [first, second] = profileAId < profileBId ? [profileAId, profileBId] : [profileBId, profileAId];

  const { data: existing, error: findErr } = await supabase
    .from('conversations')
    .select('*')
    .eq('profile_a_id', first)
    .eq('profile_b_id', second)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing as DbConversation;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ profile_a_id: first, profile_b_id: second })
    .select()
    .single();
  if (error) throw error;
  return data as DbConversation;
}

// ---- Message queries ----

export async function fetchMessages(conversationId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as DbMessage[];
}

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<DbMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, text })
    .select()
    .single();
  if (error) throw error;
  return data as DbMessage;
}

// ---- Storage ----

export async function uploadProfilePhoto(uri: string, profileId: string): Promise<string> {
  const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${profileId}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, blob, { contentType: `image/${ext}`, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadVerificationSelfie(uri: string, profileId: string): Promise<string> {
  const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${profileId}/selfie.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('verification')
    .upload(fileName, blob, { contentType: `image/${ext}`, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from('verification').getPublicUrl(fileName);
  return data.publicUrl;
}
