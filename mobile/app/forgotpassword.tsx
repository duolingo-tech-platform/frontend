import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

type Step = 'email' | 'code' | 'newPassword' | 'success';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const codeRefs: any[] = [];

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      codeRefs[index + 1]?.focus();
    }
  };

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

  // ── STEP: EMAIL ──────────────────────────────────────────
  const StepEmail = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.glowRing}>
          <View style={styles.iconBackground}>
            <Text style={styles.stepIcon}>✉️</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>RECUPERAR ACESSO</Text>
        <Text style={styles.title}>
          Esqueceu sua{'\n'}
          <Text style={styles.titleHighlight}>senha?</Text>
        </Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail e enviaremos um código de verificação para você.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>E-mail cadastrado</Text>
          <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
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
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%' }}
          onPress={() => setStep('code')}
        >
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>ENVIAR CÓDIGO</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/login')}>
          <Text style={styles.backLink}>← Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── STEP: CODE ───────────────────────────────────────────
  const StepCode = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.glowRing}>
          <View style={styles.iconBackground}>
            <Text style={styles.stepIcon}>🔑</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>VERIFICAÇÃO</Text>
        <Text style={styles.title}>
          Código{'\n'}
          <Text style={styles.titleHighlight}>enviado.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Insira o código de 4 dígitos enviado para{'\n'}
          <Text style={styles.subtitleHighlight}>{email || 'seu@email.com'}</Text>
        </Text>
      </View>

      <View style={styles.codeRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { codeRefs[index] = ref; }}
            style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
            value={digit}
            onChangeText={(v) => handleCodeChange(v.slice(-1), index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Não recebeu? </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.resendLink}>Reenviar código</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%' }}
          onPress={() => setStep('newPassword')}
        >
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>VERIFICAR CÓDIGO</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('email')}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── STEP: NEW PASSWORD ───────────────────────────────────
  const StepNewPassword = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.glowRing}>
          <View style={styles.iconBackground}>
            <Text style={styles.stepIcon}>🔒</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>NOVA SENHA</Text>
        <Text style={styles.title}>
          Crie uma senha{'\n'}
          <Text style={styles.titleHighlight}>segura.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Sua nova senha deve ser diferente das anteriores.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Nova senha</Text>
          <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#2a4a5a"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              activeOpacity={0.7}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarBg}>
                <View style={[styles.strengthBarFill, { width: strengthWidth(), backgroundColor: strengthColor() }]} />
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColor() }]}>
                Senha {passwordStrength()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Confirmar nova senha</Text>
          <View style={[
            styles.inputContainer,
            confirmFocused && styles.inputContainerFocused,
            confirmPassword.length > 0 && confirmPassword !== password && styles.inputContainerError,
          ]}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita sua senha"
              placeholderTextColor="#2a4a5a"
              secureTextEntry={!confirmVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setConfirmVisible(!confirmVisible)}
              activeOpacity={0.7}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{confirmVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <Text style={styles.errorText}>As senhas não coincidem</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%' }}
          onPress={() => setStep('success')}
        >
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>REDEFINIR SENHA</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('code')}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── STEP: SUCCESS ────────────────────────────────────────
  const StepSuccess = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={[styles.glowRing, styles.glowRingSuccess]}>
          <View style={[styles.iconBackground, styles.iconBackgroundSuccess]}>
            <Text style={styles.stepIcon}>✅</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>TUDO CERTO</Text>
        <Text style={styles.title}>
          Senha{'\n'}
          <Text style={styles.titleHighlight}>redefinida!</Text>
        </Text>
        <Text style={styles.subtitle}>
          Sua senha foi atualizada com sucesso. Agora você pode entrar com sua nova senha.
        </Text>
      </View>

      <View style={styles.successCard}>
        <Text style={styles.successCardIcon}>🛡️</Text>
        <Text style={styles.successCardText}>
          Sua conta está protegida. Lembre-se de guardar sua senha em um lugar seguro.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={() => router.push('/login')}>
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>IR PARA O LOGIN</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── PROGRESS BAR ─────────────────────────────────────────
  const stepIndex = { email: 0, code: 1, newPassword: 2, success: 3 };
  const progress = ((stepIndex[step] + 1) / 4) * 100;

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
            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBg}>
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressLabel}>
                Passo {stepIndex[step] + 1} de 4
              </Text>
            </View>

            {step === 'email'       && <StepEmail />}
            {step === 'code'        && <StepCode />}
            {step === 'newPassword' && <StepNewPassword />}
            {step === 'success'     && <StepSuccess />}

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

  // Progress
  progressContainer: {
    width: '100%',
    gap: 8,
  },
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    fontSize: 11,
    color: '#3a5a6a',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Icon
  iconContainer: {
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
  glowRingSuccess: {
    borderColor: 'rgba(67, 233, 123, 0.4)',
    backgroundColor: 'rgba(67, 233, 123, 0.08)',
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: '#0d2137',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  iconBackgroundSuccess: {
    backgroundColor: 'rgba(67, 233, 123, 0.12)',
    borderColor: 'rgba(67, 233, 123, 0.3)',
  },
  stepIcon: {
    fontSize: 40,
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
  subtitleHighlight: {
    color: '#8ab0c0',
    fontWeight: '600',
  },

  // Form
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
  inputContainerError: {
    borderColor: 'rgba(255, 77, 77, 0.5)',
    backgroundColor: 'rgba(255, 77, 77, 0.04)',
  },
  inputIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4d4d',
    fontWeight: '500',
    marginTop: 2,
  },

  // Strength
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  strengthBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
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

  // Code input
  codeRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    width: '100%',
  },
  codeInput: {
    width: 64,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  codeInputFilled: {
    borderColor: 'rgba(67, 233, 123, 0.5)',
    backgroundColor: 'rgba(67, 233, 123, 0.06)',
  },

  // Resend
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#5a7a8a',
  },
  resendLink: {
    fontSize: 14,
    color: '#43e97b',
    fontWeight: '600',
  },

  // Success card
  successCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(67, 233, 123, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 16,
    padding: 18,
  },
  successCardIcon: {
    fontSize: 28,
  },
  successCardText: {
    flex: 1,
    fontSize: 13,
    color: '#8ab0c0',
    lineHeight: 20,
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
  backLink: {
    fontSize: 14,
    color: '#5a7a8a',
    fontWeight: '500',
  },
});