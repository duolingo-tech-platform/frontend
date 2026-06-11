import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { StatsRow } from '@/components/ui/StatsRow';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { getCourses, getCourseProgress, Course, CourseProgress } from '@/services/coursesService';

const COURSE_ICONS: Record<string, string> = {
  'Expo Deep Dive': '📱',
  'React Native Avançado': '⚛️',
  'AWS para App Devs': '☁️',
};

const COURSE_COLORS: Record<string, string> = {
  'Expo Deep Dive': Colors.accent,
  'React Native Avançado': '#a78bfa',
  'AWS para App Devs': Colors.accentCyan,
};

interface Achievement { icon: string; label: string }

function computeAchievements(
  user: { xp: number; level: number; streak: number } | null,
  progressMap: Record<string, number>,
): Achievement[] {
  if (!user) return [];
  const earned: Achievement[] = [];

  const anyProgress = Object.values(progressMap).some((p) => p > 0);
  if (anyProgress) earned.push({ icon: '🏆', label: 'Primeira Aula' });

  if (user.streak >= 3)  earned.push({ icon: '📅', label: '3 Dias Seguidos' });
  if (user.streak >= 7)  earned.push({ icon: '🔥', label: '7 Dias Seguidos' });
  if (user.streak >= 30) earned.push({ icon: '🌙', label: '30 Dias Seguidos' });

  if (user.xp >= 10)  earned.push({ icon: '⚡', label: 'Primeiros XP' });
  if (user.xp >= 100) earned.push({ icon: '💎', label: '100 XP' });
  if (user.xp >= 500) earned.push({ icon: '🚀', label: '500 XP' });

  const any50 = Object.values(progressMap).some((p) => p >= 50);
  if (any50) earned.push({ icon: '🎯', label: 'Meta Batida' });

  const any100 = Object.values(progressMap).some((p) => p >= 100);
  if (any100) earned.push({ icon: '🎓', label: 'Curso Completo' });

  if (user.level >= 5)  earned.push({ icon: '🌟', label: 'Nível 5' });
  if (user.level >= 10) earned.push({ icon: '👑', label: 'Nível 10' });

  return earned;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia 👋';
  if (h < 18) return 'Boa tarde 👋';
  return 'Boa noite 👋';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loadingCourses, setLoadingCourses] = useState(true);

  const loadData = useCallback(async () => {
    setLoadingCourses(true);
    try {
      await refreshUser();
      const [c, p] = await Promise.all([getCourses(), getCourseProgress()]);
      setCourses(c);
      const map: Record<string, number> = {};
      p.forEach((entry) => { map[entry.courseId] = entry.percent; });
      setProgressMap(map);
    } catch {
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?';

  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>{firstName}</Text>
          </View>

          <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8} onPress={() => router.push('/profilescreens')}>
            <LinearGradient colors={[Colors.accent, Colors.accentCyan]} style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── STATS ── */}
        <StatsRow items={[
          { icon: '🔥', value: String(user?.streak ?? 0),       label: 'Sequência' },
          { icon: '⚡', value: `Lv ${user?.level ?? 0}`,        label: 'Nível' },
          { icon: '💎', value: String(user?.xp ?? 0),           label: 'XP' },
        ]} />

        {/* ── META DIÁRIA ── */}
        <Card padding={18} style={{ gap: 12 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Meta Diária</Text>
            <Text style={styles.accentLabel}>{Math.min(user?.xp ?? 0, 100)} / 100 XP</Text>
          </View>
          <ProgressBar progress={Math.min(user?.xp ?? 0, 100)} height={8} />
          <Text style={styles.hint}>Continue aprendendo para subir de nível 🎯</Text>
        </Card>

        {/* ── UP NEXT ── */}
        {courses.length > 0 && (
          <Card accentColor={Colors.accent} padding={20}>
            <View style={[styles.rowBetween, { marginBottom: 14 }]}>
              <View style={styles.upNextIconWrap}>
                <Text style={{ fontSize: 24 }}>
                  {COURSE_ICONS[courses[0].title] ?? '📘'}
                </Text>
              </View>
              <View style={styles.upNextBadge}>
                <Text style={styles.upNextBadgeText}>UP NEXT</Text>
              </View>
            </View>

            <Text style={styles.upNextTitle}>{courses[0].title}</Text>
            <Text style={styles.hint}>{courses[0].description}</Text>

            <GradientButton
              label="Continuar Aprendendo →"
              onPress={() => router.push({ pathname: '/lessonview', params: { courseId: courses[0].id } })}
              style={{ marginTop: 18 }}
            />
          </Card>
        )}

        {/* ── SEUS CURSOS ── */}
        <View style={{ gap: 14 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Seus Cursos</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/courses')}>
              <Text style={styles.accentLabel}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loadingCourses ? (
            <ActivityIndicator color={Colors.accent} />
          ) : (
            <View style={{ gap: 12 }}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: '/lessonview', params: { courseId: course.id } })}
                >
                  <View style={[styles.courseIconWrap, { borderColor: (COURSE_COLORS[course.title] ?? Colors.accent) + '40' }]}>
                    <Text style={{ fontSize: 20 }}>{COURSE_ICONS[course.title] ?? '📚'}</Text>
                  </View>

                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <ProgressBar progress={progressMap[course.id] ?? 0} height={5} color={COURSE_COLORS[course.title] ?? Colors.accent} />
                  </View>

                  <Text style={[styles.coursePercent, { color: COURSE_COLORS[course.title] ?? Colors.accent }]}>
                    {progressMap[course.id] ?? 0}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── REVISAR ERROS ── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/revision')}
          style={styles.revisionCard}
        >
          <LinearGradient
            colors={['rgba(249,199,79,0.10)', 'rgba(249,199,79,0.05)']}
            style={styles.revisionCardInner}
          >
            <View style={styles.revisionLeft}>
              <View style={styles.revisionIconWrap}>
                <Text style={{ fontSize: 22 }}>🔄</Text>
              </View>
              <View style={{ gap: 3 }}>
                <Text style={styles.revisionTitle}>Revisar Erros</Text>
                <Text style={styles.revisionSub}>Pratique o que você errou</Text>
              </View>
            </View>
            <Text style={styles.revisionArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── CONQUISTAS ── */}
        {(() => {
          const earned = computeAchievements(user, progressMap);
          return (
            <View style={{ gap: 14 }}>
              <Text style={styles.sectionTitle}>Conquistas</Text>
              {earned.length === 0 ? (
                <View style={styles.achievementEmpty}>
                  <Text style={{ fontSize: 28 }}>🔒</Text>
                  <Text style={styles.achievementEmptyText}>
                    Complete uma lição para desbloquear conquistas!
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
                  {earned.map((item, i) => (
                    <View key={i} style={styles.achievementCard}>
                      <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                      <Text style={styles.achievementLabel}>{item.label}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          );
        })()}

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav activeTab="home" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, gap: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: Colors.muted, fontWeight: '500', marginBottom: 2 },
  username: { fontSize: 24, fontWeight: '800', color: Colors.white },
  avatarButton: {
    borderRadius: 999, shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  avatar: { width: 46, height: 46, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800', color: Colors.bg },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.white },
  accentLabel: { fontSize: 13, color: Colors.accent, fontWeight: '700' },
  hint: { fontSize: 12, color: Colors.muted, lineHeight: 18 },

  upNextIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(67, 233, 123, 0.1)',
    borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  upNextBadge: {
    backgroundColor: 'rgba(67, 233, 123, 0.12)',
    borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.3)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999,
  },
  upNextBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.accent, letterSpacing: 1.5 },
  upNextTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 8 },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.white },

  courseCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 16, padding: 14, gap: 14,
  },
  courseIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  courseTitle: { fontSize: 14, fontWeight: '700', color: Colors.white },
  coursePercent: { fontSize: 13, fontWeight: '700', marginLeft: 4 },

  achievementsScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  achievementEmpty: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 16, padding: 16,
  },
  achievementEmptyText: { fontSize: 13, color: Colors.muted, fontWeight: '500', flex: 1 },
  achievementCard: {
    alignItems: 'center', gap: 8,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 16, padding: 16, marginRight: 12, width: 90,
  },
  achievementLabel: { fontSize: 11, color: '#8ab0c0', fontWeight: '600', textAlign: 'center' },

  revisionCard: {
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(249,199,79,0.25)',
  },
  revisionCardInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  revisionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  revisionIconWrap: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: 'rgba(249,199,79,0.12)', borderWidth: 1, borderColor: 'rgba(249,199,79,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  revisionTitle: { fontSize: 15, fontWeight: '800', color: '#f9c74f' },
  revisionSub: { fontSize: 12, color: '#8ab0c0' },
  revisionArrow: { fontSize: 24, color: '#f9c74f', fontWeight: '300' },
});
