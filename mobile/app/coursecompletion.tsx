import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getCourses, Course } from '@/services/coursesService';

export default function CourseCompletionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string; xp: string; correct: string; total: string }>();

  const xp      = parseInt(params.xp      ?? '0', 10);
  const correct = parseInt(params.correct ?? '0', 10);
  const total   = parseInt(params.total   ?? '0', 10);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    getCourses()
      .then((list) => {
        const found = list.find((c) => c.id === params.courseId);
        if (found) setCourse(found);
      })
      .catch(() => {});
  }, [params.courseId]);

  const COURSE_ICONS: Record<string, string> = {
    'Expo Deep Dive': '📱',
    'React Native Avançado': '⚛️',
    'AWS para App Devs': '☁️',
  };
  const courseIcon = course ? (COURSE_ICONS[course.title] ?? '📘') : '🎓';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#010d19" />
      <LinearGradient colors={['#010d19', '#021a2e', '#010d19']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >

          {/* ── TROPHY ── */}
          <View style={styles.trophyOuter}>
            <View style={styles.trophyRing}>
              <View style={styles.trophyInner}>
                <Text style={styles.trophyEmoji}>🏆</Text>
              </View>
            </View>
            <View style={styles.courseIconBadge}>
              <Text style={{ fontSize: 22 }}>{courseIcon}</Text>
            </View>
          </View>

          {/* ── TITLE ── */}
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>PARABÉNS! CURSO CONCLUÍDO!</Text>
            <Text style={styles.title}>
              {course ? course.title : 'Curso'}{'\n'}Completo!
            </Text>
            <Text style={styles.subtitle}>
              Você dominou todo o conteúdo deste curso.{'\n'}Incrível dedicação! 🎉
            </Text>
          </View>

          {/* ── XP CARD ── */}
          <LinearGradient
            colors={['rgba(67,233,123,0.12)', 'rgba(56,249,215,0.08)']}
            style={styles.xpCard}
          >
            <View style={styles.xpLeft}>
              <View style={styles.xpIconWrap}>
                <Text style={{ fontSize: 26 }}>⭐</Text>
              </View>
              <View>
                <Text style={styles.xpValue}>+{xp} XP</Text>
                <Text style={styles.xpLabel}>nesta última lição</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.completedBadge}
            >
              <Text style={styles.completedBadgeText}>100%</Text>
            </LinearGradient>
          </LinearGradient>

          {/* ── STATS ── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { borderColor: 'rgba(67,233,123,0.3)' }]}>
                <Text style={{ fontSize: 22 }}>🎯</Text>
              </View>
              <Text style={styles.statValue}>{correct}/{total}</Text>
              <Text style={styles.statLabel}>Acertos</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { borderColor: 'rgba(251,146,60,0.3)' }]}>
                <Text style={{ fontSize: 22 }}>📊</Text>
              </View>
              <Text style={styles.statValue}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Precisão</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { borderColor: 'rgba(167,139,250,0.3)' }]}>
                <Text style={{ fontSize: 22 }}>🏅</Text>
              </View>
              <Text style={styles.statValue}>+1</Text>
              <Text style={styles.statLabel}>Conquista</Text>
            </View>
          </View>

          {/* ── ACHIEVEMENT UNLOCKED ── */}
          <View style={styles.achievementCard}>
            <View style={styles.achievementLeft}>
              <Text style={{ fontSize: 32 }}>🎓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achievementTitle}>Conquista Desbloqueada</Text>
              <Text style={styles.achievementSub}>Curso Completo — {course?.title ?? ''}</Text>
            </View>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NOVO</Text>
            </View>
          </View>

          {/* ── ACTIONS ── */}
          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ width: '100%' }}
              onPress={() => router.replace('/courses')}
            >
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>VER TODOS OS CURSOS</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace('/home')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Ir para Home</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
    alignItems: 'center', gap: 24,
  },

  trophyOuter: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  trophyRing: {
    width: 180, height: 180, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(249,199,79,0.3)',
    backgroundColor: 'rgba(249,199,79,0.05)',
    shadowColor: '#f9c74f', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 50, elevation: 24,
  },
  trophyInner: {
    width: 140, height: 140, borderRadius: 999,
    backgroundColor: '#0d2137',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  trophyEmoji: { fontSize: 72 },
  courseIconBadge: {
    position: 'absolute', bottom: 4, right: 4,
    width: 48, height: 48, borderRadius: 999,
    backgroundColor: '#0d2137',
    borderWidth: 2, borderColor: 'rgba(67,233,123,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },

  titleBlock: { alignItems: 'center', gap: 8 },
  eyebrow: { fontSize: 10, fontWeight: '700', color: '#f9c74f', letterSpacing: 2.5, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', textAlign: 'center', lineHeight: 40 },
  subtitle: { fontSize: 14, color: '#5a7a8a', textAlign: 'center', lineHeight: 22 },

  xpCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.25)',
    borderRadius: 18, padding: 18,
  },
  xpLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  xpIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(67,233,123,0.1)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  xpValue: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  xpLabel: { fontSize: 12, color: '#5a7a8a', marginTop: 2, fontWeight: '500' },
  completedBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  completedBadgeText: { fontSize: 15, fontWeight: '800', color: '#010d19' },

  statsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  statCard: {
    flex: 1, alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, paddingVertical: 18,
  },
  statIconWrap: {
    width: 48, height: 48, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 17, fontWeight: '800', color: '#ffffff', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#5a7a8a', fontWeight: '600', textAlign: 'center' },

  achievementCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(249,199,79,0.06)',
    borderWidth: 1, borderColor: 'rgba(249,199,79,0.25)',
    borderRadius: 18, padding: 16,
  },
  achievementLeft: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: 'rgba(249,199,79,0.1)',
    borderWidth: 1, borderColor: 'rgba(249,199,79,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  achievementTitle: { fontSize: 13, fontWeight: '700', color: '#f9c74f', marginBottom: 3 },
  achievementSub: { fontSize: 12, color: '#8ab0c0', fontWeight: '500' },
  newBadge: {
    backgroundColor: 'rgba(249,199,79,0.15)',
    borderWidth: 1, borderColor: 'rgba(249,199,79,0.4)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
  },
  newBadgeText: { fontSize: 9, fontWeight: '800', color: '#f9c74f', letterSpacing: 1.5 },

  actions: { width: '100%', gap: 12 },
  primaryButton: {
    width: '100%', height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#43e97b', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#010d19', letterSpacing: 1.5 },
  secondaryButton: {
    width: '100%', height: 48, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: 13, fontWeight: '600', color: '#5a7a8a' },
});
