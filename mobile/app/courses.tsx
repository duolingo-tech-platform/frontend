import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type CourseCategory = 'Todos' | 'Mobile' | 'Cloud' | 'Em Breve';

interface Course {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  lessons: number;
  duration: string;
  progress: number; // 0 = não iniciado, 1-99 = em progresso, 100 = concluído
  locked: boolean;
  category: 'Mobile' | 'Cloud' | 'Em Breve';
  accentColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_COURSES: Course[] = [
  {
    id: 1,
    icon: '📱',
    title: 'Expo Deep Dive',
    subtitle: 'Fundamentos, navegação, APIs e build',
    tag: 'Popular',
    tagColor: '#43e97b',
    lessons: 32,
    duration: '6h',
    progress: 50,
    locked: false,
    category: 'Mobile',
    accentColor: '#43e97b',
  },
  {
    id: 2,
    icon: '⚛️',
    title: 'React Native Avançado',
    subtitle: 'Animações, performance e arquitetura',
    tag: 'Novo',
    tagColor: '#a78bfa',
    lessons: 28,
    duration: '5h',
    progress: 10,
    locked: false,
    category: 'Mobile',
    accentColor: '#a78bfa',
  },
  {
    id: 3,
    icon: '☁️',
    title: 'AWS para App Devs',
    subtitle: 'Lambda, DynamoDB, S3 e API Gateway',
    tag: 'Destaque',
    tagColor: '#38f9d7',
    lessons: 40,
    duration: '8h',
    progress: 25,
    locked: false,
    category: 'Cloud',
    accentColor: '#38f9d7',
  },
  {
    id: 4,
    icon: '🔐',
    title: 'Autenticação com Cognito',
    subtitle: 'JWT, OAuth 2.0 e boas práticas',
    tag: 'Cloud',
    tagColor: '#fb923c',
    lessons: 18,
    duration: '3h',
    progress: 0,
    locked: false,
    category: 'Cloud',
    accentColor: '#fb923c',
  },
  {
    id: 5,
    icon: '🗄️',
    title: 'DynamoDB na Prática',
    subtitle: 'Modelagem NoSQL e queries eficientes',
    tag: 'Cloud',
    tagColor: '#38f9d7',
    lessons: 22,
    duration: '4h',
    progress: 0,
    locked: true,
    category: 'Cloud',
    accentColor: '#38f9d7',
  },
  {
    id: 6,
    icon: '🤖',
    title: 'IA no Mobile',
    subtitle: 'Integração com modelos de linguagem',
    tag: 'Em Breve',
    tagColor: '#64748b',
    lessons: 0,
    duration: '—',
    progress: 0,
    locked: true,
    category: 'Em Breve',
    accentColor: '#64748b',
  },
];

const CATEGORIES: CourseCategory[] = ['Todos', 'Mobile', 'Cloud', 'Em Breve'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function progressLabel(p: number, locked: boolean): string {
  if (locked) return 'Bloqueado';
  if (p === 0) return 'Iniciar';
  if (p === 100) return 'Concluído';
  return `${p}% concluído`;
}

function progressLabelColor(p: number, locked: boolean, accent: string): string {
  if (locked) return '#3a5a6a';
  if (p === 0) return '#5a7a8a';
  if (p === 100) return '#43e97b';
  return accent;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturedCourseCard({ course, onPress }: { course: Course; onPress?: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.featuredCard} onPress={onPress}>
      <LinearGradient
        colors={[course.accentColor + '18', course.accentColor + '06']}
        style={styles.featuredGradient}
      >
        {/* Top row */}
        <View style={styles.featuredTop}>
          <View style={[styles.featuredIconWrap, { borderColor: course.accentColor + '40' }]}>
            <Text style={styles.featuredIcon}>{course.icon}</Text>
          </View>
          <View style={[styles.tagBadge, { backgroundColor: course.accentColor + '20', borderColor: course.accentColor + '50' }]}>
            <Text style={[styles.tagBadgeText, { color: course.accentColor }]}>{course.tag}</Text>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.featuredTitle}>{course.title}</Text>
        <Text style={styles.featuredSubtitle}>{course.subtitle}</Text>

        {/* Meta */}
        <View style={styles.featuredMeta}>
          <Text style={styles.metaItem}>📚 {course.lessons} aulas</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>⏱️ {course.duration}</Text>
        </View>

        {/* Progress bar */}
        {course.progress > 0 && (
          <View style={styles.featuredProgressRow}>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={[course.accentColor, course.accentColor + 'aa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${course.progress}%` as any }]}
              />
            </View>
            <Text style={[styles.progressPct, { color: course.accentColor }]}>{course.progress}%</Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity activeOpacity={0.85} style={{ marginTop: 16 }} onPress={onPress}>
          <LinearGradient
            colors={[course.accentColor, course.accentColor + 'cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featuredButton}
          >
            <Text style={styles.featuredButtonText}>
              {course.progress > 0 ? 'Continuar →' : 'Começar →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function CourseCard({ course, onPress }: { course: Course; onPress?: () => void }) {
  const isLocked = course.locked;

  return (
    <TouchableOpacity
      activeOpacity={isLocked ? 1 : 0.8}
      style={[styles.courseCard, isLocked && styles.courseCardLocked]}
      onPress={isLocked ? undefined : onPress}
    >
      {/* Left: icon */}
      <View style={[
        styles.courseIconWrap,
        { borderColor: isLocked ? 'rgba(255,255,255,0.06)' : course.accentColor + '40' },
      ]}>
        <Text style={[styles.courseIcon, isLocked && { opacity: 0.3 }]}>
          {isLocked ? '🔒' : course.icon}
        </Text>
      </View>

      {/* Center: info */}
      <View style={styles.courseInfo}>
        <View style={styles.courseTitleRow}>
          <Text style={[styles.courseTitle, isLocked && styles.textMuted]} numberOfLines={1}>
            {course.title}
          </Text>
          <View style={[
            styles.tagBadgeSmall,
            {
              backgroundColor: isLocked ? 'rgba(255,255,255,0.04)' : course.accentColor + '18',
              borderColor: isLocked ? 'rgba(255,255,255,0.07)' : course.accentColor + '40',
            },
          ]}>
            <Text style={[styles.tagBadgeSmallText, { color: isLocked ? '#3a5a6a' : course.accentColor }]}>
              {course.tag}
            </Text>
          </View>
        </View>

        <Text style={styles.courseSubtitle} numberOfLines={1}>{course.subtitle}</Text>

        {/* Progress bar (only if started) */}
        {course.progress > 0 && !isLocked && (
          <View style={styles.courseProgressBg}>
            <View style={[styles.courseProgressFill, {
              width: `${course.progress}%` as any,
              backgroundColor: course.accentColor,
            }]} />
          </View>
        )}

        {/* Meta */}
        <View style={styles.courseMeta}>
          {!isLocked && (
            <Text style={styles.courseMetaText}>
              {course.lessons} aulas · {course.duration}
            </Text>
          )}
          <Text style={[
            styles.courseStatusLabel,
            { color: progressLabelColor(course.progress, isLocked, course.accentColor) },
          ]}>
            {progressLabel(course.progress, isLocked)}
          </Text>
        </View>
      </View>

      {/* Right: chevron */}
      {!isLocked && (
        <Text style={styles.courseChevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CoursesScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('Todos');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = ALL_COURSES.filter((c) => {
    const matchCat = activeCategory === 'Todos' || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Featured = first in-progress course (or first unlocked if none in progress)
  const featured = filtered.find((c) => c.progress > 0 && c.progress < 100 && !c.locked)
    ?? filtered.find((c) => !c.locked);

  const rest = filtered.filter((c) => c.id !== featured?.id);

  // Stats
  const total = ALL_COURSES.filter((c) => !c.locked).length;
  const completed = ALL_COURSES.filter((c) => c.progress === 100).length;
  const inProgress = ALL_COURSES.filter((c) => c.progress > 0 && c.progress < 100 && !c.locked).length;

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
              <Text style={styles.eyebrow}>BIBLIOTECA</Text>
              <Text style={styles.headerTitle}>Seus Cursos</Text>
            </View>
            </View>

          {/* ── STATS ── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{total}</Text>
              <Text style={styles.statLabel}>Disponíveis</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#43e97b' }]}>{inProgress}</Text>
              <Text style={styles.statLabel}>Em progresso</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#a78bfa' }]}>{completed}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
          </View>

          {/* ── SEARCH ── */}
          <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar curso..."
              placeholderTextColor="#2a4a5a"
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              underlineColorAndroid="transparent"
              selectionColor="#43e97b"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                <Text style={styles.searchClear}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── CATEGORY TABS ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.7}
                style={[styles.tab, activeCategory === cat && styles.tabActive]}
              >
                {activeCategory === cat ? (
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabActiveGradient}
                  >
                    <Text style={styles.tabActiveText}>{cat}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.tabText}>{cat}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── FEATURED COURSE ── */}
          {featured && search.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {featured.progress > 0 ? '▶ Continuar de onde parou' : '⭐ Recomendado'}
              </Text>
              <FeaturedCourseCard course={featured} onPress={() => router.push('/lessonview')} />
            </View>
          )}

          {/* ── COURSE LIST ── */}
          <View style={styles.section}>
            {search.length > 0 && (
              <Text style={styles.sectionTitle}>
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
              </Text>
            )}
            {search.length === 0 && rest.length > 0 && (
              <Text style={styles.sectionTitle}>Todos os cursos</Text>
            )}

            <View style={styles.coursesList}>
              {(search.length > 0 ? filtered : rest).map((course) => (
                <CourseCard key={course.id} course={course} onPress={() => router.push('/lessonview')} />
              ))}
            </View>

            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔭</Text>
                <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
                <Text style={styles.emptySubtext}>Tente outro termo ou categoria</Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── BOTTOM NAV ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIconActive}>📚</Text>
            <Text style={styles.navLabelActive}>Cursos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/ranking')}>
            <Text style={styles.navIcon}>🏅</Text>
            <Text style={styles.navLabel}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/profilescreens')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    alignItems: 'flex-end',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#43e97b',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
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
  statValue: {
    fontSize: 22,
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

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    gap: 10,
  },
  searchContainerFocused: {
    borderColor: 'rgba(67, 233, 123, 0.5)',
    backgroundColor: 'rgba(67, 233, 123, 0.04)',
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  searchClear: {
    fontSize: 14,
    color: '#5a7a8a',
    paddingLeft: 8,
  },

  // Tabs
  tabsScroll: {
    marginHorizontal: -20,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: {
    borderColor: 'transparent',
  },
  tabActiveGradient: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5a7a8a',
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  tabActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#010d19',
  },

  // Section
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a7a8a',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // Featured card
  featuredCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.2)',
  },
  featuredGradient: {
    padding: 20,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  featuredIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredIcon: {
    fontSize: 26,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#5a7a8a',
    lineHeight: 21,
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    fontSize: 12,
    color: '#5a7a8a',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
    color: '#3a5a6a',
  },
  featuredProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  featuredButton: {
    height: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  featuredButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#010d19',
  },

  // Course list card
  coursesList: {
    gap: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    padding: 14,
  },
  courseCardLocked: {
    opacity: 0.55,
  },
  courseIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  courseIcon: {
    fontSize: 22,
  },
  courseInfo: {
    flex: 1,
    gap: 5,
  },
  courseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  tagBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagBadgeSmallText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#5a7a8a',
    lineHeight: 18,
  },
  courseProgressBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 2,
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  courseMetaText: {
    fontSize: 11,
    color: '#3a5a6a',
    fontWeight: '500',
  },
  courseStatusLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  courseChevron: {
    fontSize: 22,
    color: '#3a5a6a',
    marginLeft: 4,
  },
  textMuted: {
    color: '#3a5a6a',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#5a7a8a',
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