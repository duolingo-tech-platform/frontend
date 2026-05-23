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

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'fraca';
    if (password.length < 10) return 'média';
    return 'forte';
  };

  const strengthColor = () => {
    const s = passwordStrength();

    if (s === 'fraca') return '#ff4d4d';
    if (s === 'média') return '#ffaa00';
    if (s === 'forte') return '#43e97b';

    return 'transparent';
  };

  const strengthWidth = () => {
    const s = passwordStrength();

    if (s === 'fraca') return '33%';
    if (s === 'média') return '66%';
    if (s === 'forte') return '100%';

    return '0%';
  };

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
              <Text style={styles.eyebrow}>CRIE SUA CONTA</Text>

              <Text style={styles.title}>
                Comece sua{'\n'}
                <Text style={styles.titleHighlight}>jornada.</Text>
              </Text>

              <Text style={styles.subtitle}>
                Junte-se a mais de 12 mil alunos aprendendo
                tecnologia.
              </Text>
            </View>

            {/* Pills */}
            <View style={styles.pillsRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  🚀 Grátis para começar
                </Text>
              </View>

              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  🎮 Gamificado
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  Nome completo
                </Text>

                <View
                  style={[
                    styles.inputContainer,
                    nameFocused &&
                      styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>👤</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    placeholderTextColor="#2a4a5a"
                    autoCapitalize="words"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>E-mail</Text>

                <View
                  style={[
                    styles.inputContainer,
                    emailFocused &&
                      styles.inputContainerFocused,
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
                <Text style={styles.inputLabel}>Senha</Text>

                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused &&
                      styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#2a4a5a"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() =>
                      setPasswordFocused(true)
                    }
                    onBlur={() =>
                      setPasswordFocused(false)
                    }
                  />

                  <TouchableOpacity
                    onPress={() =>
                      setPasswordVisible(
                        !passwordVisible
                      )
                    }
                    activeOpacity={0.7}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {passwordVisible
                        ? '🙈'
                        : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Strength */}
                {password.length > 0 && (
                  <View
                    style={styles.strengthContainer}
                  >
                    <View
                      style={styles.strengthBarBg}
                    >
                      <View
                        style={[
                          styles.strengthBarFill,
                          {
                            width: strengthWidth(),
                            backgroundColor:
                              strengthColor(),
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.strengthLabel,
                        {
                          color: strengthColor(),
                        },
                      ]}
                    >
                      Senha {passwordStrength()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  Confirmar senha
                </Text>

                <View
                  style={[
                    styles.inputContainer,
                    confirmFocused &&
                      styles.inputContainerFocused,

                    confirmPassword.length > 0 &&
                      confirmPassword !==
                        password &&
                      styles.inputContainerError,
                  ]}
                >
                  <Text style={styles.inputIcon}>
                    🔐
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Repita sua senha"
                    placeholderTextColor="#2a4a5a"
                    secureTextEntry={!confirmVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() =>
                      setConfirmFocused(true)
                    }
                    onBlur={() =>
                      setConfirmFocused(false)
                    }
                  />

                  <TouchableOpacity
                    onPress={() =>
                      setConfirmVisible(
                        !confirmVisible
                      )
                    }
                    activeOpacity={0.7}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {confirmVisible
                        ? '🙈'
                        : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {confirmPassword.length > 0 &&
                  confirmPassword !== password && (
                    <Text style={styles.errorText}>
                      As senhas não coincidem
                    </Text>
                  )}
              </View>

              {/* Terms */}
              <TouchableOpacity
                style={styles.termsRow}
                activeOpacity={0.7}
                onPress={() =>
                  setTermsAccepted(
                    !termsAccepted
                  )
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    termsAccepted &&
                      styles.checkboxChecked,
                  ]}
                >
                  {termsAccepted && (
                    <Text style={styles.checkmark}>
                      ✓
                    </Text>
                  )}
                </View>

                <Text style={styles.termsText}>
                  Concordo com os{' '}
                  <Text style={styles.termsLink}>
                    Termos de Uso
                  </Text>{' '}
                  e{' '}
                  <Text style={styles.termsLink}>
                    Política de Privacidade
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {/* REGISTER BUTTON */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={{ width: '100%' }}
                onPress={() =>
                  router.push('/login')
                }
              >
                <LinearGradient
                  colors={[
                    '#43e97b',
                    '#38f9d7',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButton}
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    CRIAR MINHA CONTA
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* LOGIN */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>
                  Já tem uma conta?{' '}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push('/login')
                  }
                >
                  <Text style={styles.loginLink}>
                    Entrar
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
    gap: 28,
  },

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
    borderColor:
      'rgba(67, 233, 123, 0.15)',
    backgroundColor:
      'rgba(67, 233, 123, 0.04)',
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
    borderColor:
      'rgba(255,255,255,0.06)',
  },

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

  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  pill: {
    backgroundColor:
      'rgba(67, 233, 123, 0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(67, 233, 123, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pillText: {
    color: '#43e97b',
    fontSize: 12,
    fontWeight: '600',
  },

  form: {
    width: '100%',
    gap: 18,
  },

  inputWrapper: {
    gap: 8,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8ab0c0',
    letterSpacing: 0.3,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    gap: 10,
  },

  inputContainerFocused: {
    borderColor:
      'rgba(67, 233, 123, 0.5)',
    backgroundColor:
      'rgba(67, 233, 123, 0.04)',
  },

  inputContainerError: {
    borderColor:
      'rgba(255, 77, 77, 0.5)',
    backgroundColor:
      'rgba(255, 77, 77, 0.04)',
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

  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },

  strengthBarBg: {
    flex: 1,
    height: 4,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },

  strengthBarFill: {
    height: '100%',
    borderRadius: 999,
  },

  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    width: 80,
    textAlign: 'right',
  },

  errorText: {
    fontSize: 12,
    color: '#ff4d4d',
    fontWeight: '500',
    marginTop: 2,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor:
      'rgba(255,255,255,0.2)',
    backgroundColor:
      'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: '#43e97b',
    borderColor: '#43e97b',
  },

  checkmark: {
    fontSize: 13,
    color: '#010d19',
    fontWeight: '800',
  },

  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#5a7a8a',
    lineHeight: 20,
  },

  termsLink: {
    color: '#43e97b',
    fontWeight: '600',
  },

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

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  loginText: {
    fontSize: 14,
    color: '#5a7a8a',
  },

  loginLink: {
    fontSize: 14,
    color: '#43e97b',
    fontWeight: '700',
  },
});