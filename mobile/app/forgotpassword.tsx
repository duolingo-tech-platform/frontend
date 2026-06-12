import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { forgotPassword, verifyResetCode, resetPassword } from '@/services/authService';

type Step = 'email' | 'code' | 'newPassword' | 'success';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [demoCode, setDemoCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const codeRef0 = useRef<TextInput>(null);
  const codeRef1 = useRef<TextInput>(null);
  const codeRef2 = useRef<TextInput>(null);
  const codeRef3 = useRef<TextInput>(null);
  const codeRefs = [codeRef0, codeRef1, codeRef2, codeRef3];

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 3) codeRefs[index + 1]?.current?.focus();
  };

  const strengthLevel = password.length === 0 ? null : password.length < 6 ? 'fraca' : password.length < 10 ? 'média' : 'forte';
  const strengthColor = strengthLevel === 'fraca' ? '#ff4d4d' : strengthLevel === 'média' ? '#ffaa00' : '#43e97b';
  const strengthWidth = strengthLevel === 'fraca' ? '33%' : strengthLevel === 'média' ? '66%' : '100%';

  async function handleSendCode() {
    if (!email.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const res = await forgotPassword(email.trim());
      if (res.code) setDemoCode(res.code);
      setStep('code');
    } catch (e: any) { setError(e.message ?? 'Erro ao enviar código.'); }
    finally { setLoading(false); }
  }

  async function handleVerifyCode() {
    const entered = code.join('');
    if (entered.length < 4 || loading) return;
    setLoading(true); setError('');
    try {
      await verifyResetCode(email.trim(), entered);
      setStep('newPassword');
    } catch (e: any) { setError(e.message ?? 'Código inválido.'); }
    finally { setLoading(false); }
  }

  async function handleResetPassword() {
    if (!password || password !== confirmPassword || loading) return;
    setLoading(true); setError('');
    try {
      await resetPassword(email.trim(), code.join(''), password);
      setStep('success');
    } catch (e: any) { setError(e.message ?? 'Erro ao redefinir senha.'); }
    finally { setLoading(false); }
  }

  const stepIndex = { email: 0, code: 1, newPassword: 2, success: 3 };
  const progress = ((stepIndex[step] + 1) / 4) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#010d19', '#021a2e', '#010d19']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBg}>
                <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressLabel}>Passo {stepIndex[step] + 1} de 4</Text>
            </View>

            {/* ── STEP EMAIL ── */}
            {step === 'email' && (
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
                  <Text style={styles.title}>Esqueceu sua{'\n'}<Text style={styles.titleHighlight}>senha?</Text></Text>
                  <Text style={styles.subtitle}>Digite seu e-mail e enviaremos um código de verificação.</Text>
                </View>
                <View style={styles.form}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>E-mail cadastrado</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputIcon}>✉️</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        placeholderTextColor="#2a4a5a"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>
                </View>
                {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
                <View style={styles.actions}>
                  <TouchableOpacity
                    activeOpacity={loading || !email.trim() ? 1 : 0.85}
                    style={{ width: '100%', opacity: loading || !email.trim() ? 0.5 : 1 }}
                    onPress={handleSendCode}
                  >
                    <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
                      {loading ? <ActivityIndicator color="#010d19" /> : <Text style={styles.primaryButtonText}>ENVIAR CÓDIGO</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/login')}>
                    <Text style={styles.backLink}>← Voltar para o login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ── STEP CODE ── */}
            {step === 'code' && (
              <>
                <View style={styles.header}>
                  <Text style={styles.eyebrow}>VERIFICAÇÃO</Text>
                  <Text style={styles.title}>Digite o{'\n'}<Text style={styles.titleHighlight}>código.</Text></Text>
                  <Text style={styles.subtitle}>
                    Enviado para{' '}
                    <Text style={styles.subtitleHighlight}>{email}</Text>
                  </Text>
                </View>

                {demoCode ? (
                  <View style={styles.demoCodeBox}>
                    <Text style={styles.demoCodeLabel}>Modo demo — seu código é</Text>
                    <View style={styles.demoCodeDigits}>
                      {demoCode.split('').map((d, i) => (
                        <View key={i} style={styles.demoDigitBox}>
                          <Text style={styles.demoDigitText}>{d}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                <View style={styles.codeRow}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={codeRefs[index]}
                      style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                      value={digit}
                      onChangeText={(v) => handleCodeChange(v, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>

                {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
                <View style={styles.actions}>
                  <TouchableOpacity
                    activeOpacity={loading || code.join('').length < 4 ? 1 : 0.85}
                    style={{ width: '100%', opacity: loading || code.join('').length < 4 ? 0.5 : 1 }}
                    onPress={handleVerifyCode}
                  >
                    <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
                      {loading ? <ActivityIndicator color="#010d19" /> : <Text style={styles.primaryButtonText}>VERIFICAR CÓDIGO</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('email')}>
                    <Text style={styles.backLink}>← Voltar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ── STEP NEW PASSWORD ── */}
            {step === 'newPassword' && (
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
                  <Text style={styles.title}>Crie uma senha{'\n'}<Text style={styles.titleHighlight}>segura.</Text></Text>
                  <Text style={styles.subtitle}>Sua nova senha deve ser diferente das anteriores.</Text>
                </View>
                <View style={styles.form}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Nova senha</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputIcon}>🔒</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#2a4a5a"
                        secureTextEntry={!passwordVisible}
                        value={password}
                        onChangeText={setPassword}
                        autoCorrect={false}
                      />
                      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} activeOpacity={0.7} style={styles.eyeButton}>
                        <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
                      </TouchableOpacity>
                    </View>
                    {password.length > 0 && (
                      <View style={styles.strengthContainer}>
                        <View style={styles.strengthBarBg}>
                          <View style={[styles.strengthBarFill, { width: strengthWidth as any, backgroundColor: strengthColor }]} />
                        </View>
                        <Text style={[styles.strengthLabel, { color: strengthColor }]}>Senha {strengthLevel}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Confirmar nova senha</Text>
                    <View style={[styles.inputContainer, confirmPassword.length > 0 && confirmPassword !== password && styles.inputContainerError]}>
                      <Text style={styles.inputIcon}>🔐</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Repita sua senha"
                        placeholderTextColor="#2a4a5a"
                        secureTextEntry={!confirmVisible}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCorrect={false}
                      />
                      <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} activeOpacity={0.7} style={styles.eyeButton}>
                        <Text style={styles.eyeIcon}>{confirmVisible ? '🙈' : '👁️'}</Text>
                      </TouchableOpacity>
                    </View>
                    {confirmPassword.length > 0 && confirmPassword !== password && (
                      <Text style={styles.errorText}>As senhas não coincidem</Text>
                    )}
                  </View>
                </View>
                {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
                <View style={styles.actions}>
                  <TouchableOpacity
                    activeOpacity={loading || !password || password !== confirmPassword ? 1 : 0.85}
                    style={{ width: '100%', opacity: loading || !password || password !== confirmPassword ? 0.5 : 1 }}
                    onPress={handleResetPassword}
                  >
                    <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
                      {loading ? <ActivityIndicator color="#010d19" /> : <Text style={styles.primaryButtonText}>REDEFINIR SENHA</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('code')}>
                    <Text style={styles.backLink}>← Voltar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ── STEP SUCCESS ── */}
            {step === 'success' && (
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
                  <Text style={styles.title}>Senha{'\n'}<Text style={styles.titleHighlight}>redefinida!</Text></Text>
                  <Text style={styles.subtitle}>Sua senha foi atualizada com sucesso.</Text>
                </View>
                <View style={styles.successCard}>
                  <Text style={styles.successCardIcon}>🛡️</Text>
                  <Text style={styles.successCardText}>Sua conta está protegida. Lembre-se de guardar sua senha em um lugar seguro.</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={() => router.push('/login')}>
                    <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
                      <Text style={styles.primaryButtonText}>IR PARA O LOGIN</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, gap: 32 },

  progressContainer: { width: '100%', gap: 8 },
  progressBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressLabel: { fontSize: 11, color: '#3a5a6a', fontWeight: '600', letterSpacing: 0.5 },

  iconContainer: { alignItems: 'center' },
  glowRing: { width: 140, height: 140, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(67,233,123,0.15)', backgroundColor: 'rgba(67,233,123,0.04)', shadowColor: '#43e97b', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 40, elevation: 20 },
  glowRingSuccess: { borderColor: 'rgba(67,233,123,0.4)', backgroundColor: 'rgba(67,233,123,0.08)' },
  iconBackground: { width: 100, height: 100, borderRadius: 999, backgroundColor: '#0d2137', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  iconBackgroundSuccess: { backgroundColor: 'rgba(67,233,123,0.12)', borderColor: 'rgba(67,233,123,0.3)' },
  stepIcon: { fontSize: 40 },

  header: { alignItems: 'center', width: '100%' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#43e97b', letterSpacing: 2.5, marginBottom: 10 },
  title: { fontSize: 36, fontWeight: '800', color: '#ffffff', textAlign: 'center', lineHeight: 42, marginBottom: 10 },
  titleHighlight: { color: '#43e97b' },
  subtitle: { fontSize: 14, color: '#5a7a8a', textAlign: 'center', lineHeight: 22 },
  subtitleHighlight: { color: '#8ab0c0', fontWeight: '600' },

  demoCodeBox: { width: '100%', backgroundColor: 'rgba(67,233,123,0.05)', borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', gap: 12 },
  demoCodeLabel: { fontSize: 12, color: 'rgba(67,233,123,0.7)', fontWeight: '500', letterSpacing: 0.3 },
  demoCodeDigits: { flexDirection: 'row', gap: 8 },
  demoDigitBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(67,233,123,0.12)', borderWidth: 1, borderColor: 'rgba(67,233,123,0.25)', alignItems: 'center', justifyContent: 'center' },
  demoDigitText: { fontSize: 18, fontWeight: '800', color: '#43e97b' },

  form: { width: '100%', gap: 18 },
  inputWrapper: { gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#8ab0c0', letterSpacing: 0.3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, height: 54, gap: 10 },
  inputContainerError: { borderColor: 'rgba(255,77,77,0.5)', backgroundColor: 'rgba(255,77,77,0.04)' },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, color: '#ffffff', fontSize: 15 },
  eyeButton: { padding: 4 },
  eyeIcon: { fontSize: 16 },
  errorText: { fontSize: 12, color: '#ff4d4d', fontWeight: '500', marginTop: 2 },
  errorMsg: { fontSize: 13, color: '#ff4d4d', fontWeight: '600', textAlign: 'center' },

  strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  strengthBarBg: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' },
  strengthBarFill: { height: '100%', borderRadius: 999 },
  strengthLabel: { fontSize: 11, fontWeight: '600', width: 80, textAlign: 'right' },

  codeRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', width: '100%' },
  codeInput: { width: 58, height: 64, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: 24, fontWeight: '700' },
  codeInputFilled: { borderColor: '#43e97b', backgroundColor: 'rgba(67,233,123,0.08)', shadowColor: '#43e97b', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },

  successCard: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(67,233,123,0.06)', borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)', borderRadius: 16, padding: 18 },
  successCardIcon: { fontSize: 28 },
  successCardText: { flex: 1, fontSize: 13, color: '#8ab0c0', lineHeight: 20 },

  actions: { width: '100%', alignItems: 'center', gap: 16 },
  primaryButton: { width: '100%', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#43e97b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#010d19', letterSpacing: 1.5 },
  backLink: { fontSize: 14, color: '#5a7a8a', fontWeight: '500' },
});
