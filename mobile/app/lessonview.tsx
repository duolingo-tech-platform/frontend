import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors } from '@/constants/colors';
import { getModules, getLessons, Module, Lesson } from '@/services/coursesService';

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = 'completed' | 'current' | 'locked';

interface LessonNode {
  id: string;
  title: string;
  status: NodeStatus;
  icon: string;
  side: 'left' | 'center' | 'right';
}

interface Unit {
  id: string;
  title: string;
  nodes: LessonNode[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NODE_ICONS = ['🖥️', '⚛️', '</>', '🗄️', '🔧', '📦', '🔐', '☁️', '🧩', '⚡'];
const SIDES: Array<'left' | 'right' | 'center'> = ['left', 'right', 'center'];

function lessonToNode(lesson: Lesson, index: number): LessonNode {
  return {
    id: lesson.id,
    title: lesson.title,
    status: 'current',
    icon: NODE_ICONS[index % NODE_ICONS.length],
    side: SIDES[index % SIDES.length],
  };
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function NodeBubble({ node, large }: { node: LessonNode; large?: boolean }) {
  const size = large ? 72 : 58;

  if (node.status === 'completed') {
    return (
      <View style={[styles.nodeBubbleWrap, { width: size, height: size }]}>
        <LinearGradient
          colors={[Colors.accent, Colors.accentCyan]}
          style={[styles.nodeBubble, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Text style={styles.nodeBubbleIcon}>{node.icon}</Text>
        </LinearGradient>
        <View style={styles.nodeCheckBadge}>
          <Text style={styles.nodeCheckText}>✓</Text>
        </View>
      </View>
    );
  }

  if (node.status === 'current') {
    return (
      <View style={[styles.nodeBubbleWrap, { width: size, height: size }]}>
        <View style={[styles.nodeGlowRing, { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2 }]} />
        <LinearGradient
          colors={[Colors.accent, '#22c55e']}
          style={[styles.nodeBubble, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Text style={styles.nodeBubbleIcon}>{node.icon}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.nodeBubbleLocked, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.nodeBubbleLockedIcon}>🔒</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CourseMapScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }

    getModules(courseId)
      .then(async (modules) => {
        const units = await Promise.all(
          modules.map(async (mod) => {
            const lessons = await getLessons(mod.id);
            return {
              id: mod.id,
              title: mod.title,
              nodes: lessons.map(lessonToNode),
            };
          })
        );
        setUnits(units);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  function goToExercises(lessonId: string) {
    router.push({ pathname: '/exercisescreens', params: { lessonId } });
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── VOLTAR ── */}
      <View style={styles.backRow}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Cursos</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {units.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>📭</Text>
              <Text style={styles.emptyText}>Nenhum módulo encontrado</Text>
            </View>
          ) : (
            units.map((unit) => (
              <View key={unit.id} style={{ gap: 0 }}>

                {/* Card da unidade */}
                <View style={styles.unitCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                    <Text style={styles.unitSubtitle}>{unit.nodes.length} lições</Text>
                  </View>
                  <GradientButton
                    label="Iniciar"
                    onPress={() => unit.nodes[0] && goToExercises(unit.nodes[0].id)}
                    style={styles.reviewButton}
                    labelStyle={styles.reviewButtonText}
                  />
                </View>

                {/* Caminho de nós */}
                <View style={styles.pathContainer}>
                  <View style={styles.pathLine} />
                  {unit.nodes.map((node, i) => (
                    <TouchableOpacity
                      key={node.id}
                      style={styles.nodeRow}
                      activeOpacity={0.8}
                      onPress={() => goToExercises(node.id)}
                    >
                      <View style={styles.nodeSideSlot}>
                        {node.side === 'left' && <NodeBubble node={node} />}
                      </View>
                      <View style={styles.nodeCenterSlot}>
                        {node.side === 'center' && <NodeBubble node={node} large />}
                        {node.side === 'center' && (
                          <Text style={styles.nodeTitle} numberOfLines={1}>{node.title}</Text>
                        )}
                      </View>
                      <View style={styles.nodeSideSlot}>
                        {node.side === 'right' && <NodeBubble node={node} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* ── QUICK QUIZ FAB ── */}
      {!loading && units.length > 0 && (
        <TouchableOpacity
          style={styles.fabWrap}
          activeOpacity={0.85}
          onPress={() => {
            const firstLesson = units[0]?.nodes[0];
            if (firstLesson) goToExercises(firstLesson.id);
          }}
        >
          <LinearGradient
            colors={['#7c3aed', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fab}
          >
            <Text style={{ fontSize: 16 }}>⚡</Text>
            <Text style={styles.fabText}>Quick Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <BottomNav activeTab="courses" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backRow: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 4 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  backArrow: { fontSize: 22, color: Colors.accent, lineHeight: 24 },
  backLabel: { fontSize: 14, color: Colors.accent, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 4 },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.muted },

  unitCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(67,233,123,0.06)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)',
    borderRadius: 16, padding: 16, marginBottom: 8,
  },
  unitTitle: { fontSize: 16, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  unitSubtitle: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  reviewButton: { paddingHorizontal: 18, paddingVertical: 10, height: 'auto' as any, borderRadius: 10 },
  reviewButtonText: { fontSize: 13 },

  pathContainer: { position: 'relative', paddingVertical: 8 },
  pathLine: {
    position: 'absolute', left: '50%', top: 0, bottom: 0,
    width: 3, backgroundColor: 'rgba(67,233,123,0.15)',
    borderRadius: 999, marginLeft: -1.5,
  },
  nodeRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', height: 90,
  },
  nodeSideSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nodeCenterSlot: { width: 88, alignItems: 'center', justifyContent: 'center', gap: 4 },
  nodeTitle: { fontSize: 9, color: Colors.accent, fontWeight: '600', textAlign: 'center', maxWidth: 80 },

  nodeBubbleWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  nodeBubble: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  nodeBubbleIcon: { fontSize: 22 },
  nodeCheckBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 22, height: 22, borderRadius: 999,
    backgroundColor: Colors.bg, borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  nodeCheckText: { fontSize: 11, color: Colors.accent, fontWeight: '800' },
  nodeGlowRing: {
    position: 'absolute',
    borderWidth: 2, borderColor: 'rgba(67,233,123,0.25)',
    backgroundColor: 'rgba(67,233,123,0.06)',
  },
  nodeBubbleLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  nodeBubbleLockedIcon: { fontSize: 20, opacity: 0.3 },

  fabWrap: {
    position: 'absolute', bottom: 100, right: 20,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
  },
  fab: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999,
  },
  fabText: { fontSize: 14, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
});
