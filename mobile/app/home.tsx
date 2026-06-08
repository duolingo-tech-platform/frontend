import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { StatsRow } from '@/components/ui/StatsRow';
import { Colors } from '@/constants/colors';

const COURSES = [
  { icon: '📱', title: 'Expo Deep Dive',          progress: 50, color: Colors.accent },
  { icon: '☁️', title: 'AWS for App Devs',        progress: 25, color: Colors.accentCyan },
  { icon: '⚛️', title: 'React Native Avançado',   progress: 10, color: '#a78bfa' },
];

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Primeira Aula' },
  { icon: '🔥', label: '7 Dias Seguidos' },
  { icon: '⚡', label: 'Velocista' },
  { icon: '🎯', label: 'Meta Batida' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia 👋</Text>
            <Text style={styles.username}>João Dev</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            activeOpacity={0.8}
            onPress={() => router.push('/profilescreens')}
          >
            <LinearGradient colors={[Colors.accent, Colors.accentCyan]} style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── STATS ── */}
        <StatsRow items={[
          { icon: '🔥', value: '14',    label: 'Sequência' },
          { icon: '⚡', value: 'Lv 12', label: 'Nível' },
          { icon: '💎', value: '540',   label: 'Pontos' },
        ]} />

        {/* ── META DIÁRIA ── */}
        <Card padding={18} style={{ gap: 12 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Meta Diária</Text>
            <Text style={styles.accentLabel}>30 / 50 XP</Text>
          </View>
          <ProgressBar progress={60} height={8} />
          <Text style={styles.hint}>Faltam 20 XP para completar sua meta de hoje 🎯</Text>
        </Card>

        {/* ── UP NEXT ── */}
        <Card accentColor={Colors.accent} padding={20}>
          <View style={[styles.rowBetween, { marginBottom: 14 }]}>
            <View style={styles.upNextIconWrap}>
              <Text style={{ fontSize: 24 }}>📘</Text>
            </View>
            <View style={styles.upNextBadge}>
              <Text style={styles.upNextBadgeText}>UP NEXT</Text>
            </View>
          </View>

          <Text style={styles.upNextTitle}>React Native Basics</Text>
          <Text style={styles.hint}>
            Domine os conceitos de components, state e props para construir sua primeira interface mobile.
          </Text>

          <GradientButton
            label="Continuar Aprendendo →"
            onPress={() => router.push('/lessonview')}
            style={{ marginTop: 18 }}
          />
        </Card>

        {/* ── SEUS CURSOS ── */}
        <View style={{ gap: 14 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Seus Cursos</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/courses')}>
              <Text style={styles.accentLabel}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {COURSES.map((course, i) => (
              <TouchableOpacity
                key={i}
                style={styles.courseCard}
                activeOpacity={0.8}
                onPress={() => router.push('/lessonview')}
              >
                <View style={[styles.courseIconWrap, { borderColor: course.color + '40' }]}>
                  <Text style={{ fontSize: 20 }}>{course.icon}</Text>
                </View>

                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <ProgressBar progress={course.progress} height={5} color={course.color} />
                </View>

                <Text style={[styles.coursePercent, { color: course.color }]}>
                  {course.progress}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── CONQUISTAS ── */}
        <View style={{ gap: 14 }}>
          <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsScroll}
          >
            {ACHIEVEMENTS.map((item, i) => (
              <View key={i} style={styles.achievementCard}>
                <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                <Text style={styles.achievementLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav activeTab="home" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '500',
    marginBottom: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  avatarButton: {
    borderRadius: 999,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.bg,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  accentLabel: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
  },

  upNextIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(67, 233, 123, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upNextBadge: {
    backgroundColor: 'rgba(67, 233, 123, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  upNextBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  upNextTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
  },

  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  courseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  coursePercent: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },

  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 90,
  },
  achievementLabel: {
    fontSize: 11,
    color: '#8ab0c0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
