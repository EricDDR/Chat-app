import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Message = {
  id: string | number;
  sender: string;
  text: string;
  timestamp: string;
  __optimistic?: boolean;
};

type MessageBubbleProps = {
  item: Message;
  isMine: boolean;
  onDelete: (id: string | number) => void;
  isDeleting: boolean;
  theme: 'light' | 'dark'; 
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ item, isMine, onDelete, isDeleting, theme }) => {
  const isDarkTheme = theme === 'dark';

  const formatTime = (ts: string) => {
    if (!ts) return '';
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const bubbleStyle = [
    styles.bubble,
    isMine ? styles.bubbleMe : (isDarkTheme ? styles.bubbleOtherDark : styles.bubbleOther)
  ];
  const senderStyle = [
    styles.sender,
    isMine ? styles.senderMe : (isDarkTheme ? styles.senderOtherDark : styles.senderOther)
  ];
  const msgTextStyle = [
    styles.msgText,
    isMine ? styles.msgTextMe : (isDarkTheme ? styles.msgTextDark : styles.msgTextOther)
  ];
  const timeStyle = [
    styles.time,
    isMine ? styles.timeMe : (isDarkTheme ? styles.timeDark : styles.timeOther)
  ];

  return (
    <View style={[styles.row, isMine ? { justifyContent: 'flex-end' } : {}]}>
      <TouchableOpacity
        onLongPress={() => isMine && onDelete(item.id)}
        activeOpacity={0.7}
        accessibilityLabel={`Mensagem de ${item.sender}. Segure para opções.`}>
        <View style={bubbleStyle}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={isMine ? 'white' : '#4f46e5'} />
          ) : (
            <>
              <Text style={senderStyle}>{item?.sender ?? 'Desconhecido'}</Text>
              <Text style={msgTextStyle}>{item?.text ?? ''}</Text>
              <Text style={timeStyle}>{formatTime(item?.timestamp)}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const API_URL_BASE = 'http://192.168.0.105:8080/messages';

export default function ChatScreen() {
  const { theme } = useTheme(); 
  const isDarkTheme = theme === 'dark';
  
  const params = useLocalSearchParams();
  const userName = params.userName as string;
  
  const navigation = useNavigation();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const listRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    try {
      if (messages.length === 0) setLoadingList(true);
      const res = await fetch(API_URL_BASE);
      if (!res.ok) throw new Error(`GET falhou: ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      arr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(arr);
    } catch (err: any) {
      Alert.alert('Erro ao buscar mensagens', err.message || String(err));
    } finally {
      setLoadingList(false);
    }
  }, [messages.length]);

  const handleDelete = async (messageId: string | number) => {
    Alert.alert('Confirmar Exclusão', 'Você tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: () => {
          setDeletingId(messageId);
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
          setDeletingId(null);
        },
      },
    ]);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const payload = { sender: userName, text: text.trim() };
    setSubmitting(true);
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      ...payload,
      timestamp: new Date().toISOString(),
      __optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const res = await fetch(API_URL_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`POST falhou: ${res.status}`);
      await fetchMessages();
    } catch (err: any) {
      setMessages((prev) => prev.filter((m) => !m.__optimistic));
      Alert.alert('Erro ao enviar', err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 3000);
    return () => clearInterval(id);
  }, []);
  
  useEffect(() => {
    navigation.setOptions({ 
      title: `Chat - ${userName}`,
      headerStyle: {
        backgroundColor: isDarkTheme ? '#1e293b' : 'white', 
      },
      headerTintColor: isDarkTheme ? 'white' : 'black', 
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={{ color: '#4f46e5', marginRight: 10, fontSize: 16 }}>Config.</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName, isDarkTheme]);

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => (
    <MessageBubble
      item={item}
      isMine={item.sender === userName}
      onDelete={handleDelete}
      isDeleting={deletingId === item.id}
      theme={theme}
    />
  );
  
  return (
    <SafeAreaView style={[styles.safe, isDarkTheme && styles.safeDark]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}>
        <View style={styles.container}>
          {loadingList ? (
            <ActivityIndicator style={{ flex: 1 }} color={isDarkTheme ? 'white' : '#4f46e5'}/>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            />
          )}
          <View style={[styles.composerWrap, isDarkTheme && styles.composerWrapDark]}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={isDarkTheme ? '#94a3b8' : '#64748b'}
              style={[styles.composerInput, isDarkTheme && styles.composerInputDark]}
              multiline
            />
            <TouchableOpacity onPress={handleSend} disabled={submitting} style={[styles.sendBtn, submitting && { opacity: 0.6 }]}>
              {submitting ? <ActivityIndicator color="white"/> : <Text style={styles.sendBtnText}>Enviar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  safeDark: { backgroundColor: '#0f172a' },
  container: { flex: 1 },
  listContent: { padding: 12, paddingBottom: 20 },
  row: { width: '100%', marginBottom: 8, flexDirection: 'row' },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
  bubbleMe: { backgroundColor: '#4f46e5' },
  bubbleOther: { backgroundColor: 'white' },
  bubbleOtherDark: { backgroundColor: '#334155' },
  sender: { fontSize: 11, fontWeight: '700' },
  senderMe: { color: '#c7d2fe' },
  senderOther: { color: '#334155' },
  senderOtherDark: { color: '#cbd5e1' },
  msgText: { fontSize: 15 },
  msgTextMe: { color: 'white' },
  msgTextOther: { color: '#0f172a' },
  msgTextDark: { color: 'white' },
  time: { fontSize: 10, alignSelf: 'flex-end' },
  timeMe: { color: '#e2e8f0' },
  timeOther: { color: '#64748b' },
  timeDark: { color: '#94a3b8' },
  composerWrap: {
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 10,
  },
  composerWrapDark: {
    backgroundColor: '#1e293b',
    borderTopColor: '#334155',
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    color: '#0f172a',
  },
  composerInputDark: {
    backgroundColor: '#334155',
    color: 'white',
  },
  sendBtn: { backgroundColor: '#4f46e5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: 'white', fontSize: 14, fontWeight: '700' },
});