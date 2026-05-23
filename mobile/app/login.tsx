import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={['#010d19', '#021a2e', '#010d19']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%' }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.glowRing}>
                <View style={styles.logoBackground}>
                  <Image
                    source={require('@/assets/images/icon_duolingotech.png')}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.eyebrow}>BEM-VINDO DE VOLTA</Text>

              <Text style={styles.title}>
                Continue sua{'\n'}
                <Text style={styles.titleHighlight}>jornada.</Text>
              </Text>

              <Text style={styles.subtitle}>
                Faça login para retomar de onde parou.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>E-mail</Text>

                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>✉️</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#2a4a5a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Senha</Text>

                  {/* FORGOT PASSWORD */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push('/forgotpassword')}
                  >
                    <Text style={styles.forgotLink}>
                      Esqueci minha senha
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#2a4a5a"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      setPasswordVisible(!passwordVisible)
                    }
                    activeOpacity={0.7}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {passwordVisible ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {/* LOGIN BUTTON */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={{ width: '100%' }}
                onPress={() => router.push('/home')}
              >
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>
                    ENTRAR
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Register */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>
                  Não tem conta?{' '}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/register')}
                >
                  <Text style={styles.registerLink}>
                    Criar agora
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 32,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
  },

  glowRing: {
    width: 140,
    height: 140,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.15)',
    backgroundColor: 'rgba(67, 233, 123, 0.04)',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },

  logoBackground: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // Header
  header: {
    alignItems: 'center',
    width: '100%',
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#43e97b',
    letterSpacing: 2.5,
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 10,
  },

  titleHighlight: {
    color: '#43e97b',
  },

  subtitle: {
    fontSize: 14,
    color: '#5a7a8a',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form
  form: {
    width: '100%',
    gap: 20,
  },

  inputWrapper: {
    gap: 8,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8ab0c0',
    letterSpacing: 0.3,
  },

  forgotLink: {
    fontSize: 12,
    color: '#43e97b',
    fontWeight: '500',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    gap: 10,
  },

  inputContainerFocused: {
    borderColor: 'rgba(67, 233, 123, 0.5)',
    backgroundColor: 'rgba(67, 233, 123, 0.04)',
  },

  inputIcon: {
    fontSize: 16,
  },

  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '400',
  },

  eyeButton: {
    padding: 4,
  },

  eyeIcon: {
    fontSize: 16,
  },

  // Actions
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#010d19',
    letterSpacing: 1.5,
  },

  // Register
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  registerText: {
    fontSize: 14,
    color: '#5a7a8a',
  },

  registerLink: {
    fontSize: 14,
    color: '#43e97b',
    fontWeight: '700',
  },
});