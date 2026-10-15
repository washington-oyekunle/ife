import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, BadgeCheck } from 'lucide-react-native';
import { colors, fonts, spacing, borderRadius, shadow } from '@/constants/theme';
import { conversations, Conversation, Message } from '@/data/profiles';

export default function ChatsScreen() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Conversation[]>(conversations);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim() || !activeConv) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      time: 'Now',
    };
    setMessages((prev) =>
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
  };

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
        </View>

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
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convItem}
            activeOpacity={0.7}
            onPress={() => setActiveConv(item)}
          >
            <Image source={{ uri: item.photo }} style={styles.convAvatar} />
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
                  style={styles.convPreview}
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
  convAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
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
});
