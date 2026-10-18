import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, BadgeCheck, Search, X, MoreVertical, Shield, AlertCircle } from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { conversations, Conversation, Message } from '@/data/profiles';
import {
  fetchMyProfile,
  fetchConversations,
  fetchMessages,
  sendMessage as apiSendMessage,
  blockProfile,
} from '@/lib/api';
import type { DbProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function ChatsScreen() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [convs, setConvs] = useState<Conversation[]>(conversations);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConvMenu, setShowConvMenu] = useState(false);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await fetchMyProfile();
        if (!me) return;
        if (active) setMyProfileId(me.id);
        const dbConvs = await fetchConversations(me.id);
        if (!active || dbConvs.length === 0) return;

        const mapped = await Promise.all(
          dbConvs.map(async (conv) => {
            const otherId = conv.profile_a_id === me.id ? conv.profile_b_id : conv.profile_a_id;
            const { data: otherProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherId)
              .maybeSingle();
            const dbMsgs = await fetchMessages(conv.id);
            const profile = otherProfile as DbProfile | null;
            return {
              id: conv.id,
              profileId: otherId,
              name: profile?.name || 'Unknown',
              photo: profile?.photos?.[0] || '',
              lastMessage: dbMsgs.length > 0 ? dbMsgs[dbMsgs.length - 1].text : 'Start a conversation',
              lastMessageTime: dbMsgs.length > 0
                ? new Date(dbMsgs[dbMsgs.length - 1].created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : '',
              unread: 0,
              messages: dbMsgs.map((m) => ({
                id: m.id,
                senderId: m.sender_id === me.id ? 'me' : otherId,
                text: m.text,
                time: new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
              })),
            } as Conversation;
          })
        );
        if (active) setConvs(mapped);
      } catch {
        // keep seeded conversations as fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const channel = supabase
      .channel(`messages:${activeConv.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConv.id}` },
        (payload) => {
          const newMsg = payload.new as { id: string; sender_id: string; text: string; created_at: string };
          if (myProfileId && newMsg.sender_id === myProfileId) return;
          const msg: Message = {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            text: newMsg.text,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          };
          setActiveConv((prev) =>
            prev ? { ...prev, messages: [...prev.messages, msg], lastMessage: msg.text }
            : null
          );
          setConvs((prev) =>
            prev.map((c) =>
              c.id === activeConv.id
                ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastMessageTime: 'Now' }
                : c
            )
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConv, myProfileId]);

  const handleBlock = useCallback(() => {
    if (!myProfileId || !activeConv) return;
    setShowConvMenu(false);
    blockProfile(myProfileId, activeConv.profileId, 'reported from chat').catch(() => undefined);
    setConvs((prev) => prev.filter((c) => c.id !== activeConv.id));
    setActiveConv(null);
  }, [myProfileId, activeConv]);

  const filteredMessages = convs.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !activeConv) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      time: 'Now',
    };
    setConvs((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              lastMessageTime: 'Now',
              unread: 0,
            }
          : c
      )
    );
    setActiveConv((prev) =>
      prev
        ? { ...prev, messages: [...prev.messages, newMsg], lastMessage: newMsg.text }
        : null
    );
    setInputText('');

    fetchMyProfile().then((me) => {
      if (!me) return;
      apiSendMessage(activeConv.id, me.id, newMsg.text).catch(() => undefined);
    }).catch(() => undefined);
  }, [inputText, activeConv]);

  if (activeConv) {
    return (
      <SafeAreaView style={styles.chatContainer} edges={['top']}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => setActiveConv(null)}
            style={styles.chatBackBtn}
          >
            <ChevronLeft size={24} color={colors.neutral[500]} strokeWidth={2} />
          </TouchableOpacity>
          <Image source={{ uri: activeConv.photo }} style={styles.chatAvatar} />
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatNameRow}>
              <Text style={styles.chatName}>{activeConv.name}</Text>
              <BadgeCheck size={16} color={colors.secondary[500]} strokeWidth={2} />
            </View>
            <Text style={styles.chatStatus}>Active now</Text>
          </View>
          <TouchableOpacity style={styles.chatMenuBtn} onPress={() => setShowConvMenu(true)}>
            <MoreVertical size={20} color={colors.neutral[400]} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showConvMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConvMenu(false)}
        >
          <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowConvMenu(false)}>
            <View style={styles.menuSheet}>
              <TouchableOpacity style={styles.menuItem} onPress={handleBlock}>
                <Shield size={20} color={colors.error[500]} strokeWidth={2} />
                <Text style={styles.menuItemTextDanger}>Block & Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => setShowConvMenu(false)}>
                <AlertCircle size={20} color={colors.neutral[300]} strokeWidth={2} />
                <Text style={styles.menuItemText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <FlatList
          data={activeConv.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item, index }) => {
            const isMe = item.senderId === 'me';
            const showTime =
              index === 0 ||
              activeConv.messages[index - 1].senderId !== item.senderId;
            return (
              <View style={styles.messageGroup}>
                {showTime && <Text style={styles.messageTime}>{item.time}</Text>}
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.messageMe : styles.messageThem,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : styles.messageTextThem,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inputBar}
        >
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor={colors.neutral[100]}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
            ]}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color={colors.neutral[100]} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations..."
          placeholderTextColor={colors.neutral[100]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={16} color={colors.neutral[100]} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {filteredMessages.length === 0 ? (
        <View style={styles.emptyChats}>
          <Text style={styles.emptyChatsTitle}>No conversations found</Text>
          <Text style={styles.emptyChatsText}>
            {searchQuery ? 'Try a different search.' : 'Your matches will appear here.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.convItem}
              activeOpacity={0.7}
              onPress={() => setActiveConv(item)}
            >
              <View style={styles.avatarWrap}>
                <Image source={{ uri: item.photo }} style={styles.convAvatar} />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.convInfo}>
                <View style={styles.convHeader}>
                  <View style={styles.convNameRow}>
                    <Text style={styles.convName}>{item.name}</Text>
                    <BadgeCheck size={14} color={colors.secondary[500]} strokeWidth={2} />
                  </View>
                  <Text style={styles.convTime}>{item.lastMessageTime}</Text>
                </View>
                <View style={styles.convBottom}>
                  <Text
                    style={[
                      styles.convPreview,
                      item.unread > 0 && styles.convPreviewUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.neutral[600],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.neutral[10],
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[500],
    paddingVertical: 0,
  },
  emptyChats: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyChatsTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.neutral[300],
  },
  emptyChatsText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.neutral[100],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[20],
  },
  avatarWrap: {
    position: 'relative',
  },
  convAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.secondary[500],
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  convInfo: {
    flex: 1,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  convName: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.neutral[600],
  },
  convTime: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.neutral[100],
  },
  convBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  convPreview: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.neutral[200],
    flex: 1,
  },
  convPreviewUnread: {
    color: colors.neutral[400],
    fontFamily: fonts.bodySemiBold,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  unreadText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#fff',
  },
  // Chat view
  chatContainer: {
    flex: 1,
    backgroundColor: colors.neutral[10],
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[20],
    gap: spacing.sm,
  },
  chatBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatName: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.neutral[600],
  },
  chatStatus: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.secondary[500],
  },
  messageList: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  messageGroup: {
    maxWidth: '80%',
  },
  messageTime: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.neutral[100],
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  messageBubble: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: 2,
  },
  messageMe: {
    backgroundColor: colors.primary[500],
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageThem: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    ...shadow.sm,
  },
  messageText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextMe: {
    color: '#fff',
  },
  messageTextThem: {
    color: colors.neutral[500],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[20],
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.neutral[10],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.neutral[600],
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.neutral[40],
  },
  chatMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.xl,
    marginHorizontal: spacing.lg,
    ...shadow.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuItemText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.neutral[500],
  },
  menuItemTextDanger: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.error[500],
  },
});
