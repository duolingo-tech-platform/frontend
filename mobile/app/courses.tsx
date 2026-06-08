import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsRow } from '@/components/ui/StatsRow';
import { Colors } from '@/constants/colors';

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
  progress: number;
  locked: boolean;
  category: 'Mobile' | 'Cloud' | 'Em Breve';
  accentColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_COURSES: Course[] = [
  { id: 1, icon: '📱', title: 'Expo Deep Dive',           subtitle: 'Fundamentos, navegação, APIs e build',        tag: 'Popular',  tagColor: Colors.accent,    lessons: 32, duration: '6h', progress: 50, locked: false, category: 'Mobile',   accentColor: Colors.accent },
  { id: 2, icon: '⚛️', title: 'React Native Avançado',    subtitle: 'Animações, performance e arquitetura',         tag: 'Novo',     tagColor: '#a78bfa',        lessons: 28, duration: '5h', progress: 10, locked: false, category: 'Mobile',   accentColor: '#a78bfa' },
  { id: 3, icon: '☁️', title: 'AWS para App Devs',        subtitle: 'Lambda, DynamoDB, S3 e API Gateway',           tag: 'Destaque', tagColor: Colors.accentCyan, lessons: 40, duration: '8h', progress: 25, locked: false, category: 'Cloud',    accentColor: Colors.accentCyan },
  { id: 4, icon: '🔐', title: 'Autenticação com Cognito', subtitle: 'JWT, OAuth 2.0 e boas práticas',               tag: 'Cloud',    tagColor: '#fb923c',        lessons: 18, duration: '3h', progress: 0,  locked: false, category: 'Cloud',    accentColor: '#fb923c' },
  { id: 5, icon: '🗄️', title: 'DynamoDB na Prática',     subtitle: 'Modelagem NoSQL e queries eficientes',          tag: 'Cloud',    tagColor: Colors.accentCyan, lessons: 22, duration: '4h', progress: 0,  locked: true,  category: 'Cloud',    accentColor: Colors.accentCyan },
  { id: 6, icon: '🤖', title: 'IA no Mobile',             subtitle: 'Integração com modelos de linguagem',           tag: 'Em Breve', tagColor: '#64748b',        lessons: 0,  duration: '—',  progress: 0,  locked: true,  category: 'Em Breve', accentColor: '#64748b' },
];

const CATEGORIES: CourseCategory[] = ['Todos', 'Mobile', 'Cloud', 'Em Breve'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function progressLabel(p: number, locked: boolean) {
  if (locked) return 'Bloqueado';
  if (p === 0) return 'Iniciar';
  if (p === 100) return 'Concluído';
  return `${p}% concluído`;
}

function progressLabelColor(p: number, locked: boolean, accent: string) {
  if (locked) return Colors.mutedDark;
  if (p === 0) return Colors.muted;
  if (p === 100) return Colors.accent;
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
        <View style={styles.featuredTop}>
          <View style={[styles.featuredIconWrap, { borderColor: course.accentColor + '40' }]}>
            <Text style={styles.featuredIcon}>{course.icon}</Text>
          </View>
          <View style={[styles.tagBadge, { backgroundColor: course.accentColor + '20', borderColor: course.accentColor + '50' }]}>
            <Text style={[styles.tagBadgeText, { color: course.accentColor }]}>{course.tag}</Text>
          </View>
        </View>

        <Text style={styles.featuredTitle}>{course.title}</Text>
        <Text style={styles.featuredSubtitle}>{course.subtitle}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>📚 {course.lessons} aulas</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>⏱️ {course.duration}</Text>
        </View>

        {course.progress > 0 && (
          <View style={styles.featuredProgressRow}>
            <ProgressBar
              progress={course.progress}
              height={6}
              color={course.accentColor}
              style={{ flex: 1 }}
            />
            <Text style={[styles.progressPct, { color: course.accentColor }]}>{course.progress}%</Text>
          </View>
        )}

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
      <View style={[styles.courseIconWrap, { borderColor: isLocked ? 'rgba(255,255,255,0.06)' : course.accentColor + '40' }]}>
        <Text style={[styles.courseIcon, isLocked && { opacity: 0.3 }]}>
          {isLocked ? '🔒' : course.icon}
        </Text>
      </View>

      <View style={styles.courseInfo}>
        <View style={styles.courseTitleRow}>
          <Text style={[styles.courseTitle, isLocked && { color: Colors.mutedDark }]} numberOfLines={1}>
            {course.title}
          </Text>
          <View style={[styles.tagBadgeSmall, {
            backgroundColor: isLocked ? 'rgba(255,255,255,0.04)' : course.accentColor + '18',
            borderColor: isLocked ? Colors.cardBorder : course.accentColor + '40',
          }]}>
            <Text style={[styles.tagBadgeSmallText, { color: isLocked ? Colors.mutedDark : course.accentColor }]}>
              {course.tag}
            </Text>
          </View>
        </View>

        <Text style={styles.courseSubtitle} numberOfLines={1}>{course.subtitle}</Text>

        {course.progress > 0 && !isLocked && (
          <ProgressBar progress={course.progress} height={4} color={course.accentColor} style={{ marginTop: 2 }} />
        )}

        <View style={styles.courseMeta}>
          {!isLocked && (
            <Text style={styles.courseMetaText}>{course.lessons} aulas · {course.duration}</Text>
          )}
          <Text style={[styles.courseStatusLabel, { color: progressLabelColor(course.progress, isLocked, course.accentColor) }]}>
            {progressLabel(course.progress, isLocked)}
          </Text>
        </View>
      </View>

      {!isLocked && <Text style={styles.courseChevron}>›</Text>}
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
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured =
    filtered.find((c) => c.progress > 0 && c.progress < 100 && !c.locked) ??
    filtered.find((c) => !c.locked);

  const rest = filtered.filter((c) => c.id !== featured?.id);

  const total     = ALL_COURSES.filter((c) => !c.locked).length;
  const completed = ALL_COURSES.filter((c) => c.progress === 100).length;
  const inProgress = ALL_COURSES.filter((c) => c.progress > 0 && c.progress < 100 && !c.locked).length;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ── */}
        <View>
          <Text style={styles.eyebrow}>BIBLIOTECA</Text>
          <Text style={styles.headerTitle}>Seus Cursos</Text>
        </View>

        {/* ── STATS ── */}
        <StatsRow items={[
          { value: String(total),      label: 'Disponíveis' },
          { value: String(inProgress), label: 'Em progresso', valueColor: Colors.accent },
          { value: String(completed),  label: 'Concluídos',   valueColor: '#a78bfa' },
        ]} />

        {/* ── BUSCA ── */}
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
            selectionColor={Colors.accent}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── CATEGORIAS ── */}
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
                  colors={[Colors.accent, Colors.accentCyan]}
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

        {/* ── DESTAQUE ── */}
        {featured && search.length === 0 && (
          <View style={{ gap: 14 }}>
            <Text style={styles.sectionTitle}>
              {featured.progress > 0 ? '▶ Continuar de onde parou' : '⭐ Recomendado'}
            </Text>
            <FeaturedCourseCard course={featured} onPress={() => router.push('/lessonview')} />
          </View>
        )}

        {/* ── LISTA ── */}
        <View style={{ gap: 14 }}>
          {search.length > 0 && (
            <Text style={styles.sectionTitle}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
            </Text>
          )}
          {search.length === 0 && rest.length > 0 && (
            <Text style={styles.sectionTitle}>Todos os cursos</Text>
          )}

          <View style={{ gap: 12 }}>
            {(search.length > 0 ? filtered : rest).map((course) => (
              <CourseCard key={course.id} course={course} onPress={() => router.push('/lessonview')} />
            ))}
          </View>

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🔭</Text>
              <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
              <Text style={styles.emptySubtext}>Tente outro termo ou categoria</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav activeTab="courses" />
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, gap: 20 },

  eyebrow: { fontSize: 11, fontWeight: '700', color: Colors.accent, letterSpacing: 2.5, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.white },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, paddingHorizontal: 16, height: 50, gap: 10,
  },
  searchContainerFocused: {
    borderColor: 'rgba(67,233,123,0.5)',
    backgroundColor: 'rgba(67,233,123,0.04)',
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.white, fontSize: 15 },
  searchClear: { fontSize: 14, color: Colors.muted, paddingLeft: 8 },

  tabsScroll: { marginHorizontal: -20 },
  tabsContent: { paddingHorizontal: 20, gap: 8, flexDirection: 'row' },
  tab: {
    borderRadius: 999, overflow: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: { borderColor: 'transparent' },
  tabActiveGradient: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999 },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.muted, paddingHorizontal: 18, paddingVertical: 9 },
  tabActiveText: { fontSize: 13, fontWeight: '700', color: Colors.bg },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.muted, letterSpacing: 0.3, textTransform: 'uppercase' },

  featuredCard: { borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)' },
  featuredGradient: { padding: 20 },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  featuredIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredIcon: { fontSize: 26 },
  tagBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  tagBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  featuredTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  featuredSubtitle: { fontSize: 14, color: Colors.muted, lineHeight: 21, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaItem: { fontSize: 12, color: Colors.muted, fontWeight: '500' },
  metaDot: { fontSize: 12, color: Colors.mutedDark },
  featuredProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  progressPct: { fontSize: 12, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  featuredButton: {
    height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  featuredButtonText: { fontSize: 14, fontWeight: '800', color: Colors.bg },

  courseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 18, padding: 14,
  },
  courseCardLocked: { opacity: 0.55 },
  courseIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  courseIcon: { fontSize: 22 },
  courseInfo: { flex: 1, gap: 5 },
  courseTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  courseTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, flex: 1 },
  tagBadgeSmall: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  tagBadgeSmallText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  courseSubtitle: { fontSize: 12, color: Colors.muted, lineHeight: 18 },
  courseMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  courseMetaText: { fontSize: 11, color: Colors.mutedDark, fontWeight: '500' },
  courseStatusLabel: { fontSize: 11, fontWeight: '700' },
  courseChevron: { fontSize: 22, color: Colors.mutedDark, marginLeft: 4 },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  emptySubtext: { fontSize: 13, color: Colors.muted },
});
