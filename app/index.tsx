import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleEnterChat = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome para entrar no chat.');
      return;
    }
    
    router.push({
      pathname: '/chat',
      params: { userName: name.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Chat App</Text>
          <Text style={styles.label}>Digite seu nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            style={styles.input}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleEnterChat}
            accessibilityLabel="Entrar no chat">
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  content: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 3 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});