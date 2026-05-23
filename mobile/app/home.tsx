import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const courses = [
    { icon: '📱', title: 'Expo Deep Dive', progress: 50, color: '#43e97b' },
    { icon: '☁️', title: 'AWS for App Devs', progress: 25, color: '#38f9d7' },
    { icon: '⚛️', title: 'React Native Avançado', progress: 10, color: '#a78bfa' },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#010d19', '#021a2e', '#010d19']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

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
            <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── STATS ROW ── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>Sequência</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>Lv 12</Text>
              <Text style={styles.statLabel}>Nível</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💎</Text>
              <Text style={styles.statValue}>540</Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
          </View>

          {/* ── DAILY GOAL ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <Text style={styles.sectionCardTitle}>Meta Diária</Text>
              <Text style={styles.sectionCardBadge}>30 / 50 XP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: '60%' }]}
              />
            </View>
            <Text style={styles.progressHint}>Faltam 20 XP para completar sua meta de hoje 🎯</Text>
          </View>

          {/* ── UP NEXT ── */}
          <View style={styles.upNextCard}>
            <View style={styles.upNextTop}>
              <View style={styles.upNextIconWrap}>
                <Text style={styles.upNextIcon}>📘</Text>
              </View>
              <View style={styles.upNextBadge}>
                <Text style={styles.upNextBadgeText}>UP NEXT</Text>
              </View>
            </View>
            <Text style={styles.upNextTitle}>React Native Basics</Text>
            <Text style={styles.upNextDesc}>
              Domine os conceitos de components, state e props para construir sua primeira interface mobile.
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={{ marginTop: 18 }}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continuar Aprendendo →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── YOUR COURSES ── */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Seus Cursos</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sectionSeeAll}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.coursesList}>
              {courses.map((course, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.courseCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.courseLeft}>
                    <View style={[styles.courseIconWrap, { borderColor: course.color + '40' }]}>
                      <Text style={styles.courseIcon}>{course.icon}</Text>
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <View style={styles.courseProgressBg}>
                        <View
                          style={[
                            styles.courseProgressFill,
                            { width: `${course.progress}%`, backgroundColor: course.color },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.coursePercent, { color: course.color }]}>
                    {course.progress}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── ACHIEVEMENTS ── */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
              {[
                { icon: '🏆', label: 'Primeira Aula' },
                { icon: '🔥', label: '7 Dias Seguidos' },
                { icon: '⚡', label: 'Velocista' },
                { icon: '🎯', label: 'Meta Batida' },
              ].map((item, i) => (
                <View key={i} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{item.icon}</Text>
                  <Text style={styles.achievementLabel}>{item.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* ── BOTTOM NAV ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIconActive}>🏠</Text>
            <Text style={styles.navLabelActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>📚</Text>
            <Text style={styles.navLabel}>Cursos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>🏅</Text>
            <Text style={styles.navLabel}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 13,
    color: '#5a7a8a',
    fontWeight: '500',
    marginBottom: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  avatarButton: {
    borderRadius: 999,
    shadowColor: '#43e97b',
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
    color: '#010d19',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#5a7a8a',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  // Section card (daily goal)
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionCardBadge: {
    fontSize: 12,
    color: '#43e97b',
    fontWeight: '700',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressHint: {
    fontSize: 12,
    color: '#5a7a8a',
    lineHeight: 18,
  },

  // Up Next
  upNextCard: {
    backgroundColor: 'rgba(67, 233, 123, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 20,
    padding: 20,
  },
  upNextTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
  upNextIcon: {
    fontSize: 24,
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
    color: '#43e97b',
    letterSpacing: 1.5,
  },
  upNextTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  upNextDesc: {
    fontSize: 14,
    color: '#5a7a8a',
    lineHeight: 22,
  },
  continueButton: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#010d19',
    letterSpacing: 0.5,
  },

  // Sections
  section: {
    gap: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionSeeAll: {
    fontSize: 13,
    color: '#43e97b',
    fontWeight: '600',
  },

  // Courses
  coursesList: {
    gap: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 14,
  },
  courseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
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
  courseIcon: {
    fontSize: 20,
  },
  courseInfo: {
    flex: 1,
    gap: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  courseProgressBg: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  coursePercent: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
  },

  // Achievements
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 90,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementLabel: {
    fontSize: 11,
    color: '#8ab0c0',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#021a2e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.4,
  },
  navIconActive: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: '#3a5a6a',
    fontWeight: '600',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#43e97b',
    fontWeight: '700',
  },
});