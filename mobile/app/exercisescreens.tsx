import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Exercise, AnswerResponse,
  getExercisesByLesson, submitAnswer, completeLesson,
} from '@/services/exercisesService';
import { getCourseProgress } from '@/services/coursesService';
import { useAuth } from '@/contexts/AuthContext';

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg: '#010d19', bg2: '#021a2e',
  accent: '#43e97b', accentDim: 'rgba(67,233,123,0.12)', accentBorder: 'rgba(67,233,123,0.3)',
  text: '#ffffff', muted: '#5a7a8a',
  card: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.07)',
  danger: '#ff4d6d', dangerDim: 'rgba(255,77,109,0.12)', dangerBorder: 'rgba(255,77,109,0.3)',
};

// ─── Shared ───────────────────────────────────────────────────────────────────

function TopBar({ step, total, onBack }: { step: number; total: number; onBack: () => void }) {
  const pct = total > 0 ? Math.round((step / total) * 100) : 0;
  return (
    <View style={sh.topBar}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={sh.backBtn}>
        <Text style={sh.backArrow}>‹</Text>
        <Text style={sh.backLabel}>Lição</Text>
      </TouchableOpacity>
      <View style={sh.topBarCenter}>
        <View style={sh.progressBg}>
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[sh.progressFill, { width: `${pct}%` as any }]}
          />
        </View>
      </View>
      <View style={sh.stepBadge}>
        <Text style={sh.stepText}>{step}/{total}</Text>
      </View>
    </View>
  );
}

// ─── Tela de questão com feedback inline ──────────────────────────────────────

function TelaQuestao({
  exercise, step, total, submitting, result, onAnswer, onNext, onBack,
}: {
  exercise: Exercise;
  step: number;
  total: number;
  submitting: boolean;
  result: AnswerResponse | null;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const letters = ['A', 'B', 'C', 'D'];

  const revealed = result !== null;
  const ok = result?.isCorrect ?? false;
  const correctId = result?.correctOptionId ?? '';

  function optionStyle(optId: string) {
    if (!revealed) {
      return selected === optId ? sh.optionSelected : {};
    }
    if (optId === correctId) return sh.optionCorrect;
    if (optId === selected && !ok) return sh.optionWrong;
    return sh.optionDim;
  }

  function optionBubbleStyle(optId: string) {
    if (!revealed) {
      return selected === optId ? sh.optionBubbleSelected : {};
    }
    if (optId === correctId) return sh.optionBubbleCorrect;
    if (optId === selected && !ok) return sh.optionBubbleWrong;
    return {};
  }

  function optionBubbleTextStyle(optId: string) {
    if (!revealed) {
      return selected === optId ? sh.optionBubbleTextSelected : {};
    }
    if (optId === correctId || (optId === selected && !ok)) return sh.optionBubbleTextSelected;
    return {};
  }

  function optionTextStyle(optId: string) {
    if (!revealed) {
      return selected === optId ? sh.optionTextSelected : {};
    }
    if (optId === correctId) return { color: C.accent };
    if (optId === selected && !ok) return { color: C.danger };
    return { color: C.muted, opacity: 0.5 };
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
        <TopBar step={step} total={total} onBack={onBack} />

        <View style={sh.badge}>
          <Text style={sh.badgeText}>🎯 Questão {step} de {total}</Text>
        </View>

        <View style={{ alignItems: 'center', gap: 6, width: '100%' }}>
          <Text style={sh.eyebrow}>PERGUNTA</Text>
          <Text style={sh.title}>{exercise.question}</Text>
        </View>

        {exercise.type === 'true_false' ? (
          <View style={sh.vfRow}>
            {exercise.options.map((opt) => {
              const isV = opt.text === 'Verdadeiro';
              let bg = sh.vfBtn;
              let borderC = 'rgba(255,255,255,0.10)';
              let textC = '#8ab0c0';
              if (!revealed) {
                if (selected === opt.id) { borderC = '#43e97b'; textC = '#43e97b'; }
              } else {
                if (opt.id === correctId) { borderC = '#43e97b'; textC = '#43e97b'; }
                else if (opt.id === selected && !ok) { borderC = '#ff4d6d'; textC = '#ff4d6d'; }
                else { textC = 'rgba(90,122,138,0.4)'; }
              }
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={revealed ? 1 : 0.8}
                  onPress={() => !revealed && setSelected(opt.id)}
                  style={[sh.vfBtn, { borderColor: borderC, backgroundColor: selected === opt.id && !revealed ? 'rgba(67,233,123,0.08)' : 'rgba(255,255,255,0.03)' }]}
                >
                  <Text style={{ fontSize: 28 }}>{isV ? '✓' : '✗'}</Text>
                  <Text style={[sh.vfBtnText, { color: textC }]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={sh.optionsList}>
            {exercise.options.map((opt, i) => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={revealed ? 1 : 0.8}
                onPress={() => !revealed && setSelected(opt.id)}
                style={[sh.option, optionStyle(opt.id)]}
              >
                <View style={[sh.optionBubble, optionBubbleStyle(opt.id)]}>
                  <Text style={[sh.optionBubbleText, optionBubbleTextStyle(opt.id)]}>
                    {letters[i] ?? String(i + 1)}
                  </Text>
                </View>
                <Text style={[sh.optionText, optionTextStyle(opt.id)]}>
                  {opt.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Botão de confirmar — só aparece antes do reveal */}
        {!revealed && (
          <TouchableOpacity
            activeOpacity={selected && !submitting ? 0.85 : 1}
            style={{ width: '100%', opacity: selected && !submitting ? 1 : 0.4 }}
            onPress={selected && !submitting ? () => onAnswer(selected) : undefined}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={sh.primaryBtn}
            >
              {submitting
                ? <ActivityIndicator color={C.bg} />
                : <Text style={sh.primaryBtnText}>CONFIRMAR RESPOSTA →</Text>}
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={{ height: revealed ? 160 : 20 }} />
      </ScrollView>

      {/* Painel de feedback inline — aparece depois do reveal */}
      {revealed && (
        <View style={[sh.feedbackPanel, { borderTopColor: ok ? C.accent : C.danger, backgroundColor: ok ? 'rgba(67,233,123,0.06)' : 'rgba(255,77,109,0.06)' }]}>
          <View style={sh.feedbackRow}>
            <View style={[sh.feedbackIcon, { backgroundColor: ok ? C.accentDim : C.dangerDim, borderColor: ok ? C.accentBorder : C.dangerBorder }]}>
              <Text style={{ fontSize: 20 }}>{ok ? '✓' : '✗'}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[sh.feedbackTitle, { color: ok ? C.accent : C.danger }]}>
                {ok ? 'Resposta correta!' : 'Resposta incorreta'}
              </Text>
              <Text style={sh.feedbackMsg}>{result?.message ?? ''}</Text>
            </View>
            {ok && result && (
              <View style={sh.xpBadge}>
                <Text style={sh.xpBadgeText}>+{result.xp > 0 ? 10 : 0} XP</Text>
              </View>
            )}
          </View>

          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={onNext}>
            <LinearGradient
              colors={ok ? ['#43e97b', '#38f9d7'] : ['#ff4d6d', '#ff8c6b']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={sh.primaryBtn}
            >
              <Text style={sh.primaryBtnText}>PRÓXIMA QUESTÃO →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'question' | 'error' | 'failed';

export default function ExerciseNavigator() {
  const router = useRouter();
  const { lessonId, courseId } = useLocalSearchParams<{ lessonId: string; courseId: string }>();
  const { refreshUser } = useAuth();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!lessonId) { setPhase('error'); setErrorMsg('Lição não encontrada.'); return; }
    getExercisesByLesson(lessonId)
      .then((data) => {
        if (data.length === 0) { setPhase('error'); setErrorMsg('Nenhum exercício nessa lição.'); return; }
        setExercises(data);
        setPhase('question');
      })
      .catch((err: any) => {
        setPhase('error');
        setErrorMsg(err?.message ?? 'Erro ao carregar exercícios.');
      });
  }, [lessonId]);

  async function handleAnswer(optionId: string) {
    if (!exercises[index] || submitting) return;
    setSubmitting(true);
    try {
      const res = await submitAnswer(exercises[index].id, optionId);
      if (res.isCorrect) {
        setCorrectCount((c) => c + 1);
        setEarnedXp((x) => x + 10);
      }
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Erro ao enviar resposta.');
      setPhase('error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    const isLast = index >= exercises.length - 1;
    if (isLast) {
      // RN03 — mínimo 60% para concluir
      const passed = exercises.length === 0 || correctCount / exercises.length >= 0.6;
      if (!passed) {
        setPhase('failed');
        return;
      }
      if (lessonId) {
        try { await completeLesson(lessonId); } catch { /* non-blocking */ }
      }
      await refreshUser().catch(() => {});

      let courseCompleted = false;
      if (courseId) {
        try {
          const progressList = await getCourseProgress();
          const cp = progressList.find((p) => p.courseId === courseId);
          if (cp && cp.percent >= 100) courseCompleted = true;
        } catch { /* non-blocking */ }
      }

      if (courseCompleted) {
        router.replace({
          pathname: '/coursecompletion',
          params: { courseId, xp: earnedXp, correct: correctCount, total: exercises.length },
        });
      } else {
        router.replace({
          pathname: '/resultsummary',
          params: { correct: correctCount, total: exercises.length, xp: earnedXp },
        });
      }
    } else {
      setResult(null);
      setIndex((i) => i + 1);
    }
  }

  const back = () => {
    if (index === 0) router.back();
    else { setResult(null); setIndex((i) => i - 1); }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        {phase === 'loading' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={C.accent} />
          </View>
        )}

        {phase === 'error' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 40 }}>😕</Text>
            <Text style={{ color: C.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{errorMsg}</Text>
            <TouchableOpacity onPress={() => router.back()} style={sh.secondaryBtn}>
              <Text style={sh.secondaryBtnText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'failed' && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
            <Text style={{ fontSize: 52 }}>😅</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#ffffff', textAlign: 'center' }}>
              Quase lá!
            </Text>
            <Text style={{ fontSize: 14, color: '#5a7a8a', textAlign: 'center', lineHeight: 22 }}>
              Você acertou {correctCount} de {exercises.length} questões.{'\n'}
              Precisa de pelo menos 60% para concluir a lição.
            </Text>
            <View style={{ backgroundColor: 'rgba(255,77,109,0.12)', borderWidth: 1, borderColor: 'rgba(255,77,109,0.3)', borderRadius: 16, padding: 20, width: '100%', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 32, fontWeight: '800', color: '#ff4d6d' }}>
                {Math.round((correctCount / exercises.length) * 100)}%
              </Text>
              <Text style={{ fontSize: 12, color: '#5a7a8a' }}>Mínimo necessário: 60%</Text>
            </View>
            <TouchableOpacity
              style={{ width: '100%' }}
              activeOpacity={0.85}
              onPress={() => {
                setIndex(0);
                setResult(null);
                setCorrectCount(0);
                setEarnedXp(0);
                setPhase('question');
              }}
            >
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#010d19', letterSpacing: 1 }}>
                  TENTAR NOVAMENTE
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <Text style={{ fontSize: 13, color: '#5a7a8a', fontWeight: '500' }}>Voltar para a lição</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'question' && exercises[index] && (
          <TelaQuestao
            exercise={exercises[index]}
            step={index + 1}
            total={exercises.length}
            submitting={submitting}
            result={result}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={back}
          />
        )}
      </LinearGradient>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sh = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, gap: 20, alignItems: 'center' },

  topBar: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backArrow: { fontSize: 22, color: C.accent, lineHeight: 24 },
  backLabel: { fontSize: 13, color: C.accent, fontWeight: '600' },
  topBarCenter: { flex: 1 },
  stepBadge: { backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accentBorder, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  stepText: { fontSize: 11, fontWeight: '700', color: C.accent },

  progressBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },

  badge: { backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accentBorder, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '600', color: C.accent, letterSpacing: 0.3 },

  eyebrow: { fontSize: 11, fontWeight: '700', color: C.accent, letterSpacing: 2.5, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: C.text, textAlign: 'center', lineHeight: 28 },

  optionsList: { width: '100%', gap: 10 },
  option: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder },
  optionSelected: { backgroundColor: C.accentDim, borderColor: C.accentBorder },
  optionCorrect: { backgroundColor: 'rgba(67,233,123,0.15)', borderColor: C.accent },
  optionWrong: { backgroundColor: 'rgba(255,77,109,0.15)', borderColor: C.danger },
  optionDim: { opacity: 0.45 },

  optionBubble: { width: 28, height: 28, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: C.cardBorder, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionBubbleSelected: { backgroundColor: C.accent, borderColor: C.accent },
  optionBubbleCorrect: { backgroundColor: C.accent, borderColor: C.accent },
  optionBubbleWrong: { backgroundColor: C.danger, borderColor: C.danger },
  optionBubbleText: { fontSize: 11, fontWeight: '700', color: C.muted },
  optionBubbleTextSelected: { color: C.bg },
  optionText: { fontSize: 13, color: C.muted, lineHeight: 20, flex: 1 },
  optionTextSelected: { color: C.text },

  // Painel de feedback inline
  feedbackPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32,
    borderTopWidth: 2, gap: 14,
  },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feedbackIcon: {
    width: 44, height: 44, borderRadius: 999,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  feedbackTitle: { fontSize: 15, fontWeight: '800' },
  feedbackMsg: { fontSize: 12, color: C.muted, lineHeight: 17 },
  xpBadge: { backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accentBorder, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  xpBadgeText: { fontSize: 12, fontWeight: '800', color: C.accent },

  primaryBtn: { width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#43e97b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#010d19', letterSpacing: 1 },
  secondaryBtn: { width: '100%', height: 42, borderRadius: 12, borderWidth: 1, borderColor: C.accentBorder, backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: C.accent, letterSpacing: 0.5 },

  // V/F layout
  vfRow: { flexDirection: 'row', gap: 14, width: '100%' },
  vfBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 24, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.03)' },
  vfBtnText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
});
