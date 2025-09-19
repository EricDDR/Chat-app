import React from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const containerStyle = [
    styles.safe,
    isDarkTheme && styles.safeDark,
  ];
  const titleStyle = [
    styles.title,
    isDarkTheme && styles.textDark,
  ];
  const labelStyle = [
    styles.label,
    isDarkTheme && styles.textDark,
  ];

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.container}>
        <Text style={titleStyle}>Configurações</Text>
        <View style={styles.optionRow}>
          <Text style={labelStyle}>Modo Escuro</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#818cf8" }}
            thumbColor={isDarkTheme ? "#4f46e5" : "#f4f3f4"}
            onValueChange={toggleTheme} 
            value={isDarkTheme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  safeDark: { backgroundColor: '#1e293b' }, 
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'black' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  label: { fontSize: 18, color: 'black' },
  textDark: { color: 'white' }, 
});