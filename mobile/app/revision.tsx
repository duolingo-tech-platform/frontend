import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Exercise, AnswerResponse,
  getRevisionExercises, submitAnswer,
} from '@/services/exercisesService';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#010d19', bg2: '#021a2e',
  accent: '#f9c74f', accentDim: 'rgba(249,199,79,0.12)', accentBorder: 'rgba(249,199,79,0.3)',
  text: '#ffffff', muted: '#5a7a8a',
  card: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.07)',
  danger: '#ff4d6d', dangerDim: 'rgba(255,77,109,0.12)', dangerBorder: 'rgba(255,77,109,0.3)',
  green: '#43e97b', greenDim: 'rgba(67,233,123,0.12)', greenBorder: 'rgba(67,233,123,0.3)',
};

type Phase = 'loading' | 'empty' | 'question' | 'done' | 'error';

export default function RevisionScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getRevisionExercises()
      .then((data) => {
        if (data.length === 0) { setPhase('empty'); return; }
        setExercises(data);
        setPhase('question');
      })
      .catch((err: any) => {
        setPhase('error');
        setErrorMsg(err?.message ?? 'Erro ao carregar revisão.');
      });
  }, []);

  async function handleAnswer(optionId: string) {
    if (!exercises[index] || submitting) return;
    setSubmitting(true);
    try {
      const res = await submitAnswer(exercises[index].id, optionId);
      if (res.isCorrect) setCorrectCount((c) => c + 1);
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Erro ao enviar resposta.');
      setPhase('error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (index >= exercises.length - 1) {
      await refreshUser().catch(() => {});
      setPhase('done');
    } else {
      setResult(null);
      setSelected(null);
      setIndex((i) => i + 1);
    }
  }

  const exercise = exercises[index];
  const revealed = result !== null;
  const ok = result?.isCorrect ?? false;
  const correctId = result?.correctOptionId ?? '';
  const letters = ['A', 'B', 'C', 'D'];
  const pct = exercises.length > 0 ? Math.round(((index) / exercises.length) * 100) : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        {/* Loading */}
        {phase === 'loading' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={{ color: C.muted, fontSize: 14 }}>Carregando revisão...</Text>
          </View>
        )}

        {/* Empty */}
        {phase === 'empty' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
            <Text style={{ fontSize: 48 }}>🎉</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, textAlign: 'center' }}>
              Nenhum exercício para revisar!
            </Text>
            <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 22 }}>
              Você acertou todos os exercícios que tentou. Continue praticando!
            </Text>
            <TouchableOpacity onPress={() => router.replace('/home')} style={sh.primaryBtn}>
              <LinearGradient colors={[C.green, '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sh.primaryBtn}>
                <Text style={sh.primaryBtnText}>VOLTAR AO HOME</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Error */}
        {phase === 'error' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 40 }}>😕</Text>
            <Text style={{ color: C.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{errorMsg}</Text>
            <TouchableOpacity onPress={() => router.back()} style={sh.secondaryBtn}>
              <Text style={sh.secondaryBtnText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Done */}
        {phase === 'done' && (
          <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 }}>
            <Text style={{ fontSize: 48 }}>{correctCount === exercises.length ? '🏆' : '📚'}</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.text, textAlign: 'center' }}>
              Revisão Concluída!
            </Text>
            <View style={sh.resultCard}>
              <View style={sh.resultRow}>
                <Text style={sh.resultLabel}>Acertos</Text>
                <Text style={[sh.resultValue, { color: C.green }]}>{correctCount}/{exercises.length}</Text>
              </View>
              <View style={[sh.resultRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 4 }]}>
                <Text style={sh.resultLabel}>Precisão</Text>
                <Text style={[sh.resultValue, { color: C.accent }]}>
                  {exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0}%
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
              {correctCount === exercises.length
                ? 'Perfeito! Você dominou todos os exercícios de revisão.'
                : 'Continue praticando para melhorar seu desempenho!'}
            </Text>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => router.replace('/home')}>
              <LinearGradient colors={[C.green, '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sh.primaryBtn}>
                <Text style={sh.primaryBtnText}>VOLTAR AO HOME</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Question */}
        {phase === 'question' && exercise && (
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
              {/* Top bar */}
              <View style={sh.topBar}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={sh.backBtn}>
                  <Text style={[sh.backArrow, { color: C.accent }]}>‹</Text>
                  <Text style={[sh.backLabel, { color: C.accent }]}>Revisão</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <View style={sh.progressBg}>
                    <View style={[sh.progressFill, { width: `${pct}%` as any, backgroundColor: C.accent }]} />
                  </View>
                </View>
                <View style={[sh.stepBadge, { backgroundColor: C.accentDim, borderColor: C.accentBorder }]}>
                  <Text style={[sh.stepText, { color: C.accent }]}>{index + 1}/{exercises.length}</Text>
                </View>
              </View>

              <View style={[sh.badge, { backgroundColor: C.accentDim, borderColor: C.accentBorder }]}>
                <Text style={[sh.badgeText, { color: C.accent }]}>🔄 Revisão de Erros</Text>
              </View>

              <View style={{ alignItems: 'center', gap: 6, width: '100%' }}>
                <Text style={[sh.eyebrow, { color: C.accent }]}>PERGUNTA</Text>
                <Text style={sh.title}>{exercise.question}</Text>
              </View>

              {/* Options */}
              {exercise.type === 'true_false' ? (
                <View style={sh.vfRow}>
                  {exercise.options.map((opt) => {
                    const isV = opt.text === 'Verdadeiro';
                    let borderC = 'rgba(255,255,255,0.10)';
                    let textC = '#8ab0c0';
                    if (!revealed) {
                      if (selected === opt.id) { borderC = C.accent; textC = C.accent; }
                    } else {
                      if (opt.id === correctId) { borderC = C.green; textC = C.green; }
                      else if (opt.id === selected && !ok) { borderC = C.danger; textC = C.danger; }
                      else { textC = 'rgba(90,122,138,0.4)'; }
                    }
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        activeOpacity={revealed ? 1 : 0.8}
                        onPress={() => !revealed && setSelected(opt.id)}
                        style={[sh.vfBtn, { borderColor: borderC, backgroundColor: selected === opt.id && !revealed ? C.accentDim : 'rgba(255,255,255,0.03)' }]}
                      >
                        <Text style={{ fontSize: 28 }}>{isV ? '✓' : '✗'}</Text>
                        <Text style={[sh.vfBtnText, { color: textC }]}>{opt.text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={sh.optionsList}>
                  {exercise.options.map((opt, i) => {
                    let style = {};
                    let bubbleStyle = {};
                    let bubbleTextStyle = {};
                    let textStyle = {};
                    if (!revealed) {
                      if (selected === opt.id) { style = { backgroundColor: C.accentDim, borderColor: C.accentBorder }; bubbleStyle = { backgroundColor: C.accent, borderColor: C.accent }; bubbleTextStyle = { color: C.bg }; textStyle = { color: C.text }; }
                    } else {
                      if (opt.id === correctId) { style = { backgroundColor: C.greenDim, borderColor: C.green }; bubbleStyle = { backgroundColor: C.green, borderColor: C.green }; bubbleTextStyle = { color: C.bg }; textStyle = { color: C.green }; }
                      else if (opt.id === selected && !ok) { style = { backgroundColor: C.dangerDim, borderColor: C.danger }; bubbleStyle = { backgroundColor: C.danger, borderColor: C.danger }; bubbleTextStyle = { color: '#fff' }; textStyle = { color: C.danger }; }
                      else { style = { opacity: 0.45 }; }
                    }
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        activeOpacity={revealed ? 1 : 0.8}
                        onPress={() => !revealed && setSelected(opt.id)}
                        style={[sh.option, style]}
                      >
                        <View style={[sh.optionBubble, bubbleStyle]}>
                          <Text style={[sh.optionBubbleText, bubbleTextStyle]}>{letters[i] ?? String(i + 1)}</Text>
                        </View>
                        <Text style={[sh.optionText, textStyle]}>{opt.text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {!revealed && (
                <TouchableOpacity
                  activeOpacity={selected && !submitting ? 0.85 : 1}
                  style={{ width: '100%', opacity: selected && !submitting ? 1 : 0.4 }}
                  onPress={selected && !submitting ? () => handleAnswer(selected) : undefined}
                >
                  <LinearGradient
                    colors={[C.accent, '#f4a261']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={sh.primaryBtn}
                  >
                    {submitting ? <ActivityIndicator color={C.bg} /> : <Text style={sh.primaryBtnText}>CONFIRMAR RESPOSTA →</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <View style={{ height: revealed ? 160 : 20 }} />
            </ScrollView>

            {revealed && (
              <View style={[sh.feedbackPanel, { borderTopColor: ok ? C.green : C.danger, backgroundColor: ok ? C.greenDim : C.dangerDim }]}>
                <View style={sh.feedbackRow}>
                  <View style={[sh.feedbackIcon, { backgroundColor: ok ? C.greenDim : C.dangerDim, borderColor: ok ? C.greenBorder : C.dangerBorder }]}>
                    <Text style={{ fontSize: 20 }}>{ok ? '✓' : '✗'}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[sh.feedbackTitle, { color: ok ? C.green : C.danger }]}>
                      {ok ? 'Resposta correta!' : 'Resposta incorreta'}
                    </Text>
                    <Text style={sh.feedbackMsg}>{result?.message ?? ''}</Text>
                  </View>
                  {ok && result && (
                    <View style={[sh.xpBadge, { backgroundColor: C.greenDim, borderColor: C.greenBorder }]}>
                      <Text style={[sh.xpBadgeText, { color: C.green }]}>+10 XP</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={handleNext}>
                  <LinearGradient
                    colors={ok ? [C.green, '#38f9d7'] : [C.danger, '#ff8c6b']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={sh.primaryBtn}
                  >
                    <Text style={sh.primaryBtnText}>
                      {index >= exercises.length - 1 ? 'VER RESULTADO →' : 'PRÓXIMA QUESTÃO →'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </>
  );
}

const sh = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, gap: 20, alignItems: 'center' },

  topBar: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backArrow: { fontSize: 22, lineHeight: 24 },
  backLabel: { fontSize: 13, fontWeight: '600' },
  progressBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  stepBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  stepText: { fontSize: 11, fontWeight: '700' },

  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },

  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#ffffff', textAlign: 'center', lineHeight: 28 },

  optionsList: { width: '100%', gap: 10 },
  option: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  optionBubble: { width: 28, height: 28, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionBubbleText: { fontSize: 11, fontWeight: '700', color: '#5a7a8a' },
  optionText: { fontSize: 13, color: '#5a7a8a', lineHeight: 20, flex: 1 },

  vfRow: { flexDirection: 'row', gap: 14, width: '100%' },
  vfBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 24, borderRadius: 16, borderWidth: 1.5 },
  vfBtnText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  feedbackPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, borderTopWidth: 2, gap: 14 },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feedbackIcon: { width: 44, height: 44, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  feedbackTitle: { fontSize: 15, fontWeight: '800' },
  feedbackMsg: { fontSize: 12, color: '#5a7a8a', lineHeight: 17 },
  xpBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  xpBadgeText: { fontSize: 12, fontWeight: '800' },

  primaryBtn: { width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#010d19', letterSpacing: 1 },
  secondaryBtn: { width: '100%', height: 42, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(67,233,123,0.3)', backgroundColor: 'rgba(67,233,123,0.12)', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: '#43e97b', letterSpacing: 0.5 },

  resultCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, gap: 8 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#5a7a8a', fontWeight: '600' },
  resultValue: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
});
