import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LessonCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ correct: string; total: string; xp: string }>();

  const correct = parseInt(params.correct ?? '0', 10);
  const total   = parseInt(params.total   ?? '0', 10);
  const xp      = parseInt(params.xp      ?? '0', 10);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perfect  = correct === total && total > 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#010d19', '#021a2e', '#010d19']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

        {/* ── MASCOT ── */}
        <View style={styles.mascotContainer}>
          <View style={styles.mascotGlowRing}>
            <View style={styles.mascotBackground}>
              <Text style={styles.mascotEmoji}>{perfect ? '🏆' : '🧑‍💻'}</Text>
            </View>
          </View>
        </View>

        {/* ── TITLE ── */}
        <View style={styles.titleContainer}>
          <Text style={styles.eyebrow}>PARABÉNS!</Text>
          <Text style={styles.title}>Lição Completa!</Text>
          <Text style={styles.subtitle}>
            {perfect
              ? 'Perfeito! Você acertou todas as questões!'
              : 'Você concluiu mais uma etapa da sua jornada.'}
          </Text>
        </View>

        {/* ── XP CARD ── */}
        <View style={styles.xpCard}>
          <View style={styles.xpLeft}>
            <View style={styles.xpIconWrap}>
              <Text style={styles.xpIcon}>⭐</Text>
            </View>
            <View>
              <Text style={styles.xpValue}>+{xp} XP</Text>
              <Text style={styles.xpLabel}>Ganhos nesta lição</Text>
            </View>
          </View>
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.xpBadge}
          >
            <Text style={styles.xpBadgeText}>+XP</Text>
          </LinearGradient>
        </View>

        {/* ── ACHIEVEMENT CARDS ── */}
        <View style={styles.achievementsRow}>
          <View style={styles.achievementCard}>
            <View style={[styles.achievementIconWrap, { borderColor: 'rgba(67,233,123,0.3)' }]}>
              <Text style={styles.achievementIcon}>🎯</Text>
            </View>
            <Text style={styles.achievementTitle}>Acertos</Text>
            <Text style={styles.achievementSub}>{correct}/{total}</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={[styles.achievementIconWrap, { borderColor: 'rgba(251,146,60,0.3)' }]}>
              <Text style={styles.achievementIcon}>📊</Text>
            </View>
            <Text style={styles.achievementTitle}>Precisão</Text>
            <Text style={styles.achievementSub}>{accuracy}%</Text>
          </View>
        </View>

        {/* ── PROGRESS ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Precisão nesta lição</Text>
            <Text style={styles.progressValue}>{accuracy}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${accuracy}%` as any }]}
            />
          </View>
        </View>

        {/* ── ACTIONS ── */}
        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={() => router.replace('/courses')}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>CONTINUAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },

  mascotContainer: { alignItems: 'center' },
  mascotGlowRing: {
    width: 160, height: 160, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.2)',
    backgroundColor: 'rgba(67, 233, 123, 0.05)',
    shadowColor: '#43e97b', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 40, elevation: 20,
  },
  mascotBackground: {
    width: 130, height: 130, borderRadius: 999,
    backgroundColor: '#0d2137', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  mascotEmoji: { fontSize: 64 },

  titleContainer: { alignItems: 'center', gap: 6 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#43e97b', letterSpacing: 2.5 },
  title: { fontSize: 34, fontWeight: '800', color: '#ffffff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#5a7a8a', textAlign: 'center', lineHeight: 22 },

  xpCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(67, 233, 123, 0.05)',
    borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 18, padding: 18,
  },
  xpLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  xpIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(67, 233, 123, 0.1)',
    borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  xpIcon: { fontSize: 22 },
  xpValue: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  xpLabel: { fontSize: 12, color: '#5a7a8a', marginTop: 2, fontWeight: '500' },
  xpBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  xpBadgeText: { fontSize: 13, fontWeight: '800', color: '#010d19' },

  achievementsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  achievementCard: {
    flex: 1, alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, paddingVertical: 18, paddingHorizontal: 12,
  },
  achievementIconWrap: {
    width: 52, height: 52, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  achievementIcon: { fontSize: 26 },
  achievementTitle: { fontSize: 13, fontWeight: '700', color: '#ffffff', textAlign: 'center' },
  achievementSub: { fontSize: 14, color: '#43e97b', fontWeight: '800', textAlign: 'center' },

  progressCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, padding: 18, gap: 12,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontWeight: '600', color: '#8ab0c0' },
  progressValue: { fontSize: 13, fontWeight: '800', color: '#43e97b' },
  progressBarBg: {
    width: '100%', height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 999 },

  actions: { width: '100%', alignItems: 'center', gap: 12 },
  primaryButton: {
    width: '100%', height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#43e97b', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#010d19', letterSpacing: 1.5 },
});
