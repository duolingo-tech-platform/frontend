import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  bg: '#010d19',
  bg2: '#021a2e',
  accent: '#43e97b',
  accentDim: 'rgba(67,233,123,0.12)',
  accentBorder: 'rgba(67,233,123,0.3)',
  text: '#ffffff',
  muted: '#5a7a8a',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.07)',
  danger: '#ff4d6d',
  dangerDim: 'rgba(255,77,109,0.12)',
  dangerBorder: 'rgba(255,77,109,0.3)',
};

// ─── Shared Components ────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <View style={sh.progressBg}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[sh.progressFill, { width: `${pct}%` as any }]}
      />
    </View>
  );
}

function TopBar({
  label, step, total, onBack,
}: { label: string; step: number; total: number; onBack: () => void }) {
  return (
    <View style={sh.topBar}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={sh.backBtn}>
        <Text style={sh.backArrow}>‹</Text>
        <Text style={sh.backLabel}>Lição</Text>
      </TouchableOpacity>
      <View style={sh.topBarCenter}>
        <ProgressBar step={step} total={total} />
      </View>
      <View style={sh.stepBadge}>
        <Text style={sh.stepText}>{step}/{total}</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={sh.statCard}>
      <Text style={sh.statIcon}>{icon}</Text>
      <Text style={sh.statValue}>{value}</Text>
      <Text style={sh.statLabel}>{label}</Text>
    </View>
  );
}

// ─── TELA 1: Múltipla Escolha ─────────────────────────────────────────────────

const MC_OPTIONS = [
  { id: 'a', text: 'Organiza componentes em árvores virtuais para update eficiente do DOM' },
  { id: 'b', text: 'É um banco de dados em memória para armazenar estado global' },
  { id: 'c', text: 'Substitui o JavaScript no navegador com código binário' },
  { id: 'd', text: 'Gerencia requisições HTTP de forma assíncrona' },
];

function TelaQuestao({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={sh.screen}
    >
      <TopBar label="REACT NATIVE · MÓDULO 3" step={3} total={8} onBack={onBack} />

      <View style={sh.badge}>
        <Text style={sh.badgeText}>🎯 Questão Conceitual</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={sh.eyebrow}>PERGUNTA</Text>
        <Text style={sh.title}>
          O que é o{' '}
          <Text style={sh.titleHighlight}>Virtual DOM</Text>
          {' '}no React?
        </Text>
      </View>

      <View style={sh.optionsList}>
        {MC_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.8}
            onPress={() => setSelected(opt.id)}
            style={[sh.option, selected === opt.id && sh.optionSelected]}
          >
            <View style={[sh.optionBubble, selected === opt.id && sh.optionBubbleSelected]}>
              <Text style={[sh.optionBubbleText, selected === opt.id && sh.optionBubbleTextSelected]}>
                {opt.id.toUpperCase()}
              </Text>
            </View>
            <Text style={[sh.optionText, selected === opt.id && sh.optionTextSelected]}>
              {opt.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={sh.statsRow}>
        <StatCard icon="⏱️" value="1:45" label="Tempo" />
        <View style={sh.statDivider} />
        <StatCard icon="💡" value="2" label="Dicas" />
        <View style={sh.statDivider} />
        <StatCard icon="⭐" value="+30" label="XP" />
      </View>

      <TouchableOpacity
        activeOpacity={selected ? 0.85 : 1}
        style={{ width: '100%', opacity: selected ? 1 : 0.4 }}
        onPress={selected ? onNext : undefined}
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

// ─── TELA 2: Feedback ─────────────────────────────────────────────────────────

function TelaFeedback({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const isCorrect = true;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 3" step={4} total={8} onBack={onBack} />

      <View style={{ alignItems: 'center', gap: 14 }}>
        <View style={[
          sh.feedbackCircle,
          { backgroundColor: isCorrect ? C.accentDim : C.dangerDim, borderColor: isCorrect ? C.accentBorder : C.dangerBorder },
        ]}>
          <Text style={[sh.feedbackIcon, { color: isCorrect ? C.accent : C.danger }]}>
            {isCorrect ? '✓' : '✗'}
          </Text>
        </View>
        <Text style={[sh.eyebrow, { color: isCorrect ? C.accent : C.danger }]}>
          {isCorrect ? 'RESPOSTA CORRETA!' : 'RESPOSTA ERRADA'}
        </Text>
        <Text style={sh.title}>
          {isCorrect ? 'Excelente ' : 'Quase '}
          <Text style={isCorrect ? sh.titleHighlight : { color: C.danger }}>
            {isCorrect ? 'raciocínio!' : 'lá!'}
          </Text>
        </Text>
      </View>

      <View style={sh.card}>
        <Text style={[sh.eyebrow, { textAlign: 'left', marginBottom: 10 }]}>📖 EXPLICAÇÃO</Text>
        <Text style={sh.cardDesc}>
          O Virtual DOM é uma representação leve do DOM real mantida em memória. O React compara
          o estado anterior com o novo (diffing) e aplica apenas as mudanças necessárias no DOM
          real, tornando as atualizações muito mais eficientes.
        </Text>
      </View>

      <View style={sh.statsRowSmall}>
        <StatCard icon="⭐" value="+30 XP" label="Ganhos" />
        <View style={sh.statDivider} />
        <StatCard icon="🔥" value="6" label="Sequência" />
        <View style={sh.statDivider} />
        <StatCard icon="⚡" value="1:12" label="Tempo" />
      </View>

      <View style={sh.card}>
        <Text style={[sh.eyebrow, { textAlign: 'left', marginBottom: 10 }]}>🔗 CONCEITOS RELACIONADOS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Reconciliation', 'React Fiber', 'Re-render', 'Diffing Algorithm'].map(t => (
            <View key={t} style={sh.chip}>
              <Text style={sh.chipText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={onNext}>
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sh.primaryBtn}
        >
          <Text style={sh.primaryBtnText}>PRÓXIMA QUESTÃO →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── TELA 3: Verdadeiro / Falso ───────────────────────────────────────────────

function TelaVerdadeiroFalso({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 4" step={5} total={8} onBack={onBack} />

      <View style={sh.badge}>
        <Text style={sh.badgeText}>⚡ Verdadeiro ou Falso</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={sh.eyebrow}>AFIRMAÇÃO</Text>
        <Text style={sh.title}>
          É possível usar{' '}
          <Text style={sh.titleHighlight}>Hooks</Text>
          {' '}dentro de loops em React
        </Text>
      </View>

      <View style={sh.card}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={sh.hintIcon}>
            <Text style={{ fontSize: 20 }}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[sh.eyebrow, { textAlign: 'left', marginBottom: 4 }]}>DICA</Text>
            <Text style={sh.cardDesc}>
              Pense nas Regras dos Hooks — React precisa garantir a mesma ordem de chamada em cada render.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
        {[
          { val: 'true', label: 'VERDADEIRO', icon: '✓', color: C.accent, dim: C.accentDim, border: C.accentBorder },
          { val: 'false', label: 'FALSO', icon: '✗', color: C.danger, dim: C.dangerDim, border: C.dangerBorder },
        ].map(({ val, label, icon, color, dim, border }) => (
          <TouchableOpacity
            key={val}
            activeOpacity={0.8}
            onPress={() => setAnswer(val)}
            style={[
              sh.tfButton,
              answer === val && { borderColor: border, backgroundColor: dim },
            ]}
          >
            <View style={[sh.tfIcon, answer === val && { backgroundColor: color, borderColor: color }]}>
              <Text style={[sh.tfIconText, answer === val && { color: C.bg }]}>{icon}</Text>
            </View>
            <Text style={[sh.tfLabel, answer === val && { color }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={sh.statsRow}>
        <StatCard icon="🔥" value="5" label="Sequência" />
        <View style={sh.statDivider} />
        <StatCard icon="⚡" value="+20" label="XP" />
        <View style={sh.statDivider} />
        <StatCard icon="🏆" value="Top 12%" label="Ranking" />
      </View>

      <TouchableOpacity
        activeOpacity={answer ? 0.85 : 1}
        style={{ width: '100%', opacity: answer ? 1 : 0.4 }}
        onPress={answer ? onNext : undefined}
      >
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sh.primaryBtn}
        >
          <Text style={sh.primaryBtnText}>CONFIRMAR →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── TELA 4: Completar Código ─────────────────────────────────────────────────

const CODE_TOKENS = ['useState', 'useEffect', 'props', 'return', 'const', 'async', 'render', 'import'];

function TelaCompletarCodigo({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [blanks, setBlanks] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  const fillBlank = (token: string) => {
    if (Object.values(blanks).includes(token)) {
      setBlanks(prev => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === token) next[k] = '';
        }
        return next;
      });
      return;
    }
    const emptyKey = ['a', 'b', 'c'].find(k => !blanks[k]);
    if (emptyKey) setBlanks(prev => ({ ...prev, [emptyKey]: token }));
  };

  const clearBlank = (key: string) => setBlanks(prev => ({ ...prev, [key]: '' }));

  const filled = Object.values(blanks).filter(Boolean).length;

  function BlankSlot({ k }: { k: string }) {
    return (
      <TouchableOpacity
        onPress={() => blanks[k] ? clearBlank(k) : undefined}
        activeOpacity={blanks[k] ? 0.7 : 1}
        style={[sh.blankSlot, blanks[k] ? sh.blankSlotFilled : null]}
      >
        <Text style={[sh.blankText, blanks[k] ? sh.blankTextFilled : null]}>
          {blanks[k] || '______'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 3" step={6} total={8} onBack={onBack} />

      <View style={sh.badge}>
        <Text style={sh.badgeText}>💻 Complete o Código</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={sh.eyebrow}>DESAFIO</Text>
        <Text style={sh.title}>
          Preencha os{' '}
          <Text style={sh.titleHighlight}>espaços</Text>
          {' '}em branco
        </Text>
        <Text style={sh.subtitle}>Toque nos tokens abaixo para preencher</Text>
      </View>

      <View style={sh.codeCard}>
        <Text style={sh.codeFileName}>Counter.tsx</Text>

        <View style={sh.codeLine}>
          <Text style={sh.kw}>function </Text>
          <Text style={sh.fn}>Counter</Text>
          <Text style={sh.code}>() {'{'}</Text>
        </View>
        <View style={[sh.codeLine, { paddingLeft: 20 }]}>
          <Text style={sh.kw}>const </Text>
          <Text style={sh.code}>[count, setCount] = </Text>
          <BlankSlot k="a" />
          <Text style={sh.code}>(0);</Text>
        </View>
        <View style={[sh.codeLine, { paddingLeft: 20 }]}>
          <BlankSlot k="b" />
          <Text style={sh.code}>{'(() => {'}</Text>
        </View>
        <View style={[sh.codeLine, { paddingLeft: 40 }]}>
          <Text style={sh.prop}>document</Text>
          <Text style={sh.code}>.title = count;</Text>
        </View>
        <View style={[sh.codeLine, { paddingLeft: 20 }]}>
          <Text style={sh.code}>{'}'}, [count]);</Text>
        </View>
        <View style={[sh.codeLine, { paddingLeft: 20, flexWrap: 'wrap' }]}>
          <Text style={sh.kw}>return </Text>
          <Text style={sh.code}>{'<button onClick={'}</Text>
          <BlankSlot k="c" />
          <Text style={sh.code}>{'}>'}</Text>
          <Text style={sh.prop}>count</Text>
          <Text style={sh.code}>{'</button>'}</Text>
        </View>
        <View style={sh.codeLine}>
          <Text style={sh.code}>{'}'}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {CODE_TOKENS.map(t => {
          const used = Object.values(blanks).includes(t);
          return (
            <TouchableOpacity
              key={t}
              activeOpacity={0.7}
              onPress={() => fillBlank(t)}
              style={[sh.token, used && sh.tokenUsed]}
            >
              <Text style={[sh.tokenText, used && sh.tokenTextUsed]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ width: '100%', gap: 10 }}>
        <TouchableOpacity
          activeOpacity={filled === 3 ? 0.85 : 1}
          style={{ width: '100%', opacity: filled === 3 ? 1 : 0.4 }}
          onPress={filled === 3 ? onNext : undefined}
        >
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={sh.primaryBtn}
          >
            <Text style={sh.primaryBtnText}>VERIFICAR CÓDIGO →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setBlanks({ a: '', b: '', c: '' })}
          style={sh.secondaryBtn}
        >
          <Text style={sh.secondaryBtnText}>LIMPAR TUDO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const SCREENS = ['questao', 'feedback', 'verdfalso', 'codigo'] as const;
type ScreenKey = typeof SCREENS[number];

export default function ExerciseNavigator() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  const screen: ScreenKey = SCREENS[idx];

  const next = () => {
    if (idx >= SCREENS.length - 1) {
      router.push('/resultsummary');
    } else {
      setIdx(i => i + 1);
    }
  };

  const back = () => {
    if (idx === 0) router.back();
    else setIdx(i => i - 1);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        {screen === 'questao'   && <TelaQuestao onNext={next} onBack={back} />}
        {screen === 'feedback'  && <TelaFeedback onNext={next} onBack={back} />}
        {screen === 'verdfalso' && <TelaVerdadeiroFalso onNext={next} onBack={back} />}
        {screen === 'codigo'    && <TelaCompletarCodigo onNext={next} onBack={back} />}
      </LinearGradient>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sh = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 20,
    alignItems: 'center',
  },

  // Top bar
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backArrow: { fontSize: 22, color: '#43e97b', lineHeight: 24 },
  backLabel: { fontSize: 13, color: '#43e97b', fontWeight: '600' },
  topBarCenter: { flex: 1 },
  stepBadge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  stepText: { fontSize: 11, fontWeight: '700', color: C.accent },

  // Progress bar
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 999 },

  // Badge
  badge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: C.accent, letterSpacing: 0.3 },

  // Typography
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  titleHighlight: { color: C.accent },
  subtitle: { fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 },

  // Card
  card: {
    width: '100%',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    padding: 18,
  },
  cardDesc: { fontSize: 13, color: C.muted, lineHeight: 21 },

  // Stats
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRowSmall: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: { flex: 1, alignItems: 'center', gap: 3 },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: 15, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 10, color: C.muted, fontWeight: '500' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.07)' },

  // MC Options
  optionsList: { width: '100%', gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  optionSelected: { backgroundColor: C.accentDim, borderColor: C.accentBorder },
  optionBubble: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionBubbleSelected: { backgroundColor: C.accent, borderColor: C.accent },
  optionBubbleText: { fontSize: 11, fontWeight: '700', color: C.muted },
  optionBubbleTextSelected: { color: C.bg },
  optionText: { fontSize: 13, color: C.muted, lineHeight: 20, flex: 1 },
  optionTextSelected: { color: C.text },

  // Feedback
  feedbackCircle: {
    width: 90,
    height: 90,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackIcon: { fontSize: 40, fontWeight: '800' },

  // Chips
  chip: {
    backgroundColor: '#0d2137',
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: { fontSize: 11, fontWeight: '600', color: C.accent },

  // T/F
  tfButton: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.cardBorder,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  tfIcon: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfIconText: { fontSize: 20, fontWeight: '800', color: C.muted },
  tfLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: C.muted },
  hintIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Code
  codeCard: {
    width: '100%',
    backgroundColor: '#0a1929',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 2,
  },
  codeFileName: { fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: '600' },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    minHeight: 28,
  },
  kw: { fontSize: 12, color: '#c586c0', fontFamily: 'monospace' },
  fn: { fontSize: 12, color: '#dcdcaa', fontFamily: 'monospace' },
  code: { fontSize: 12, color: C.text, fontFamily: 'monospace' },
  prop: { fontSize: 12, color: '#9cdcfe', fontFamily: 'monospace' },

  // Blank slots
  blankSlot: {
    minWidth: 80,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(67,233,123,0.4)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginHorizontal: 2,
  },
  blankSlotFilled: {
    backgroundColor: C.accentDim,
    borderColor: C.accent,
    borderStyle: 'solid',
  },
  blankText: { fontSize: 11, color: 'rgba(67,233,123,0.5)', fontFamily: 'monospace', fontWeight: '600' },
  blankTextFilled: { color: C.accent },

  // Tokens
  token: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.accentBorder,
    backgroundColor: C.accentDim,
  },
  tokenUsed: { opacity: 0.35 },
  tokenText: { fontSize: 12, fontWeight: '600', color: C.accent, fontFamily: 'monospace' },
  tokenTextUsed: { color: C.muted },

  // Buttons
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#010d19', letterSpacing: 1 },
  secondaryBtn: {
    width: '100%',
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.accentBorder,
    backgroundColor: C.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: C.accent, letterSpacing: 0.5 },
});
