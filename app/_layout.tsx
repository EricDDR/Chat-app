import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Bem-vindo' }} />
        <Stack.Screen name="chat" /> 
        <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      </Stack>
    </ThemeProvider>
  );
}