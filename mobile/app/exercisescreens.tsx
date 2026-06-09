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

// ─── Tela de questão ──────────────────────────────────────────────────────────

function TelaQuestao({
  exercise, step, total, onAnswer, onBack,
}: {
  exercise: Exercise;
  step: number;
  total: number;
  onAnswer: (optionId: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
      <TopBar step={step} total={total} onBack={onBack} />

      <View style={sh.badge}>
        <Text style={sh.badgeText}>🎯 Questão {step} de {total}</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={sh.eyebrow}>PERGUNTA</Text>
        <Text style={sh.title}>{exercise.question}</Text>
      </View>

      <View style={sh.optionsList}>
        {exercise.options.map((opt, i) => (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.8}
            onPress={() => setSelected(opt.id)}
            style={[sh.option, selected === opt.id && sh.optionSelected]}
          >
            <View style={[sh.optionBubble, selected === opt.id && sh.optionBubbleSelected]}>
              <Text style={[sh.optionBubbleText, selected === opt.id && sh.optionBubbleTextSelected]}>
                {letters[i] ?? String(i + 1)}
              </Text>
            </View>
            <Text style={[sh.optionText, selected === opt.id && sh.optionTextSelected]}>
              {opt.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={selected ? 0.85 : 1}
        style={{ width: '100%', opacity: selected ? 1 : 0.4 }}
        onPress={selected ? () => onAnswer(selected) : undefined}
      >
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sh.primaryBtn}
        >
          <Text style={sh.primaryBtnText}>CONFIRMAR RESPOSTA →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Tela de feedback ─────────────────────────────────────────────────────────

function TelaFeedback({
  result, isLast, onNext,
}: {
  result: AnswerResponse;
  isLast: boolean;
  onNext: () => void;
}) {
  const ok = result.isCorrect;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>

      <View style={{ alignItems: 'center', gap: 14, marginTop: 40 }}>
        <View style={[sh.feedbackCircle, {
          backgroundColor: ok ? C.accentDim : C.dangerDim,
          borderColor: ok ? C.accentBorder : C.dangerBorder,
        }]}>
          <Text style={[sh.feedbackIcon, { color: ok ? C.accent : C.danger }]}>
            {ok ? '✓' : '✗'}
          </Text>
        </View>

        <Text style={[sh.eyebrow, { color: ok ? C.accent : C.danger }]}>
          {ok ? 'RESPOSTA CORRETA!' : 'RESPOSTA INCORRETA'}
        </Text>

        <Text style={sh.title}>
          {ok ? 'Excelente ' : 'Quase '}
          <Text style={{ color: ok ? C.accent : C.danger }}>
            {ok ? 'raciocínio!' : 'lá!'}
          </Text>
        </Text>
      </View>

      <View style={sh.card}>
        <Text style={[sh.eyebrow, { textAlign: 'left', marginBottom: 8 }]}>
          {ok ? '🏆 RESULTADO' : '💡 TENTE NOVAMENTE'}
        </Text>
        <Text style={sh.cardDesc}>{result.message}</Text>

        {ok && (
          <View style={sh.xpRow}>
            <Text style={sh.xpLabel}>Total XP:</Text>
            <Text style={sh.xpValue}>{result.xp} XP</Text>
          </View>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={onNext}>
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sh.primaryBtn}
        >
          <Text style={sh.primaryBtnText}>
            {isLast ? 'VER RESULTADO →' : 'PRÓXIMA QUESTÃO →'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'question' | 'feedback' | 'submitting' | 'error';

export default function ExerciseNavigator() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [lastResult, setLastResult] = useState<AnswerResponse | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
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
        console.error('[exercisescreens] erro:', err?.message, lessonId);
        setPhase('error');
        setErrorMsg(err?.message ?? 'Erro ao carregar exercícios.');
      });
  }, [lessonId]);

  async function handleAnswer(optionId: string) {
    if (!exercises[index]) return;
    setPhase('submitting');
    try {
      const result = await submitAnswer(exercises[index].id, optionId);
      setLastResult(result);
      if (result.isCorrect) setCorrectCount((c) => c + 1);
      setTotalXp(result.xp);
      setPhase('feedback');
    } catch {
      setPhase('question');
    }
  }

  async function handleNext() {
    const isLast = index >= exercises.length - 1;
    if (isLast) {
      if (lessonId) {
        try { await completeLesson(lessonId); } catch { /* non-blocking */ }
      }
      router.replace({
        pathname: '/resultsummary',
        params: { correct: correctCount, total: exercises.length, xp: totalXp },
      });
    } else {
      setIndex((i) => i + 1);
      setPhase('question');
    }
  }

  const back = () => {
    if (index === 0) router.back();
    else { setIndex((i) => i - 1); setPhase('question'); }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        {(phase === 'loading' || phase === 'submitting') && (
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

        {phase === 'question' && exercises[index] && (
          <TelaQuestao
            exercise={exercises[index]}
            step={index + 1}
            total={exercises.length}
            onAnswer={handleAnswer}
            onBack={back}
          />
        )}

        {phase === 'feedback' && lastResult && (
          <TelaFeedback
            result={lastResult}
            isLast={index >= exercises.length - 1}
            onNext={handleNext}
          />
        )}
      </LinearGradient>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sh = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40, gap: 20, alignItems: 'center' },

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
  optionBubble: { width: 28, height: 28, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: C.cardBorder, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionBubbleSelected: { backgroundColor: C.accent, borderColor: C.accent },
  optionBubbleText: { fontSize: 11, fontWeight: '700', color: C.muted },
  optionBubbleTextSelected: { color: C.bg },
  optionText: { fontSize: 13, color: C.muted, lineHeight: 20, flex: 1 },
  optionTextSelected: { color: C.text },

  feedbackCircle: { width: 90, height: 90, borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  feedbackIcon: { fontSize: 40, fontWeight: '800' },

  card: { width: '100%', backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 16, padding: 18, gap: 8 },
  cardDesc: { fontSize: 13, color: C.muted, lineHeight: 21 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.cardBorder },
  xpLabel: { fontSize: 12, color: C.muted, fontWeight: '600' },
  xpValue: { fontSize: 16, fontWeight: '800', color: C.accent },

  primaryBtn: { width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#43e97b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#010d19', letterSpacing: 1 },
  secondaryBtn: { width: '100%', height: 42, borderRadius: 12, borderWidth: 1, borderColor: C.accentBorder, backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: C.accent, letterSpacing: 0.5 },
});
