import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors } from '@/constants/colors';

type NodeStatus = 'completed' | 'current' | 'locked';

interface LessonNode {
  id: number;
  status: NodeStatus;
  icon: string;
  side: 'left' | 'center' | 'right';
}

interface Unit {
  id: number;
  title: string;
  subtitle: string;
  status: 'active' | 'locked';
  nodes: LessonNode[];
}

const units: Unit[] = [
  {
    id: 1,
    title: 'Unit 1',
    subtitle: 'Core Syntax & Logic',
    status: 'active',
    nodes: [
      { id: 1, status: 'completed', icon: '🖥️', side: 'left' },
      { id: 2, status: 'completed', icon: '🗄️', side: 'right' },
      { id: 3, status: 'current',   icon: '</>',  side: 'center' },
    ],
  },
  {
    id: 2,
    title: 'Unit 2',
    subtitle: 'Advanced Functions',
    status: 'locked',
    nodes: [
      { id: 4, status: 'locked', icon: '🔒', side: 'left' },
      { id: 5, status: 'locked', icon: '🔒', side: 'right' },
    ],
  },
];

export default function CourseMapScreen() {
  const router = useRouter();

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

      {/* ── HEADER STATS ── */}
      <View style={styles.header}>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatIcon}>🔥</Text>
          <Text style={styles.headerStatValue}>12</Text>
        </View>
        <View style={styles.headerLevel}>
          <Text style={styles.headerLevelText}>Lv 12</Text>
        </View>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatValue}>850</Text>
          <Text style={styles.headerStatIcon}>💎</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {units.map((unit) => (
          <View key={unit.id} style={{ gap: 0 }}>

            {/* Card da unidade */}
            <View style={[styles.unitCard, unit.status === 'locked' && styles.unitCardLocked]}>
              <View>
                <Text style={[styles.unitTitle, unit.status === 'locked' && { color: Colors.mutedDark }]}>
                  {unit.title}
                </Text>
                <Text style={styles.unitSubtitle}>{unit.subtitle}</Text>
              </View>

              {unit.status === 'active' ? (
                <GradientButton
                  label="Review"
                  onPress={() => router.push('/exercisescreens')}
                  style={styles.reviewButton}
                  labelStyle={styles.reviewButtonText}
                />
              ) : (
                <Text style={{ fontSize: 20, opacity: 0.4 }}>🔒</Text>
              )}
            </View>

            {/* Caminho de nós */}
            <View style={styles.pathContainer}>
              <View style={styles.pathLine} />
              {unit.nodes.map((node) => (
                <TouchableOpacity
                  key={node.id}
                  style={styles.nodeRow}
                  activeOpacity={node.status === 'locked' ? 1 : 0.8}
                  onPress={node.status !== 'locked' ? () => router.push('/exercisescreens') : undefined}
                >
                  <View style={styles.nodeSideSlot}>
                    {node.side === 'left' && <NodeBubble node={node} />}
                  </View>
                  <View style={styles.nodeCenterSlot}>
                    {node.side === 'center' && <NodeBubble node={node} large />}
                  </View>
                  <View style={styles.nodeSideSlot}>
                    {node.side === 'right' && <NodeBubble node={node} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── QUICK QUIZ FAB ── */}
      <TouchableOpacity
        style={styles.fabWrap}
        activeOpacity={0.85}
        onPress={() => router.push('/exercisescreens')}
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

      <BottomNav activeTab="courses" />
    </ScreenContainer>
  );
}

function NodeBubble({ node, large }: { node: LessonNode; large?: boolean }) {
  const size = large ? 72 : 58;

  if (node.status === 'completed') {
    return (
      <View style={[styles.nodeBubbleWrap, { width: size, height: size }]}>
        <LinearGradient
          colors={[Colors.accent, Colors.accentCyan]}
          style={[styles.nodeBubble, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Text style={styles.nodeBubbleIcon}>{node.icon.length <= 3 ? node.icon : '✅'}</Text>
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
          <Text style={styles.nodeBubbleCodeText}>{node.icon}</Text>
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

const styles = StyleSheet.create({
  backRow: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 4 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  backArrow: { fontSize: 22, color: Colors.accent, lineHeight: 24 },
  backLabel: { fontSize: 14, color: Colors.accent, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16,
  },
  headerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerStatIcon: { fontSize: 18 },
  headerStatValue: { fontSize: 16, fontWeight: '800', color: Colors.white },
  headerLevel: {
    backgroundColor: 'rgba(67,233,123,0.12)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.3)',
    paddingHorizontal: 18, paddingVertical: 6, borderRadius: 999,
  },
  headerLevelText: { fontSize: 14, fontWeight: '800', color: Colors.accent, letterSpacing: 0.5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 4 },

  unitCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(67,233,123,0.06)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)',
    borderRadius: 16, padding: 16, marginBottom: 8,
  },
  unitCardLocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: Colors.cardBorder,
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
  nodeCenterSlot: { width: 88, alignItems: 'center', justifyContent: 'center' },

  nodeBubbleWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  nodeBubble: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  nodeBubbleIcon: { fontSize: 24 },
  nodeBubbleCodeText: { fontSize: 18, fontWeight: '900', color: Colors.bg },
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
