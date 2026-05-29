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
      { id: 3, status: 'current', icon: '</>', side: 'center' },
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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={['#010d19', '#021a2e', '#010d19']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

        {/* ── BACK ── */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Cursos</Text>
          </TouchableOpacity>
        </View>

        {/* ── HEADER ── */}
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {units.map((unit) => (
            <View key={unit.id} style={styles.unitBlock}>

              {/* Unit header card */}
              <View
                style={[
                  styles.unitCard,
                  unit.status === 'locked' && styles.unitCardLocked,
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.unitTitle,
                      unit.status === 'locked' && styles.textMuted,
                    ]}
                  >
                    {unit.title}
                  </Text>

                  <Text style={styles.unitSubtitle}>
                    {unit.subtitle}
                  </Text>
                </View>

                {unit.status === 'active' ? (
                  <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/exercisescreens')}>
                    <LinearGradient
                      colors={['#43e97b', '#38f9d7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.reviewButton}
                    >
                      <Text style={styles.reviewButtonText}>
                        Review
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
              </View>

              {/* Nodes path */}
              <View style={styles.pathContainer}>
                <View style={styles.pathLine} />

                {unit.nodes.map((node) => (
                  <TouchableOpacity
                    key={node.id}
                    style={styles.nodeRow}
                    activeOpacity={node.status === 'locked' ? 1 : 0.8}
                    onPress={node.status !== 'locked' ? () => router.push('/exercisescreens') : undefined}
                  >

                    {/* Left */}
                    <View style={styles.nodeSideSlot}>
                      {node.side === 'left' && (
                        <NodeBubble node={node} />
                      )}
                    </View>

                    {/* Center */}
                    <View style={styles.nodeCenterSlot}>
                      {node.side === 'center' && (
                        <NodeBubble node={node} large />
                      )}
                    </View>

                    {/* Right */}
                    <View style={styles.nodeSideSlot}>
                      {node.side === 'right' && (
                        <NodeBubble node={node} />
                      )}
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
            <Text style={styles.fabIcon}>⚡</Text>
            <Text style={styles.fabText}>Quick Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── BOTTOM NAV ── */}
        <View style={styles.bottomNav}>

          {/* HOME */}
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          {/* CURSOS */}
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push('/courses')}
          >
            <Text style={styles.navIconActive}>📚</Text>
            <Text style={styles.navLabelActive}>Cursos</Text>
          </TouchableOpacity>

          {/* RANKING */}
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push('/ranking')}
          >
            <Text style={styles.navIcon}>🏅</Text>
            <Text style={styles.navLabel}>Ranking</Text>
          </TouchableOpacity>

          {/* PERFIL */}
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push('/profilescreens')}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </>
  );
}

function NodeBubble({
  node,
  large,
}: {
  node: LessonNode;
  large?: boolean;
}) {
  const size = large ? 72 : 58;

  if (node.status === 'completed') {
    return (
      <View
        style={[
          styles.nodeBubbleWrap,
          { width: size, height: size },
        ]}
      >
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          style={[
            styles.nodeBubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={styles.nodeBubbleIcon}>
            {node.icon.length <= 3 ? node.icon : '✅'}
          </Text>
        </LinearGradient>

        <View style={styles.nodeCheckBadge}>
          <Text style={styles.nodeCheckText}>✓</Text>
        </View>
      </View>
    );
  }

  if (node.status === 'current') {
    return (
      <View
        style={[
          styles.nodeBubbleWrap,
          { width: size, height: size },
        ]}
      >
        <View
          style={[
            styles.nodeGlowRing,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
            },
          ]}
        />

        <LinearGradient
          colors={['#43e97b', '#22c55e']}
          style={[
            styles.nodeBubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={styles.nodeBubbleCodeText}>
            {node.icon}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.nodeBubbleLocked,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={styles.nodeBubbleLockedIcon}>🔒</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Back
  backRow: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: '#43e97b',
    lineHeight: 24,
  },
  backLabel: {
    fontSize: 14,
    color: '#43e97b',
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },

  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  headerStatIcon: {
    fontSize: 18,
  },

  headerStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },

  headerLevel: {
    backgroundColor: 'rgba(67, 233, 123, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.3)',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },

  headerLevelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#43e97b',
    letterSpacing: 0.5,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 4,
  },

  // Unit
  unitBlock: {
    gap: 0,
  },

  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(67, 233, 123, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },

  unitCardLocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
  },

  unitTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },

  unitSubtitle: {
    fontSize: 13,
    color: '#5a7a8a',
    fontWeight: '500',
  },

  textMuted: {
    color: '#3a5a6a',
  },

  lockIcon: {
    fontSize: 20,
    opacity: 0.4,
  },

  reviewButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  reviewButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#010d19',
  },

  // Path
  pathContainer: {
    position: 'relative',
    paddingVertical: 8,
  },

  pathLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(67, 233, 123, 0.15)',
    borderRadius: 999,
    marginLeft: -1.5,
  },

  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
  },

  nodeSideSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nodeCenterSlot: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Node Bubble
  nodeBubbleWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nodeBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  nodeBubbleIcon: {
    fontSize: 24,
  },

  nodeBubbleCodeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#010d19',
  },

  nodeCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#010d19',
    borderWidth: 2,
    borderColor: '#43e97b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nodeCheckText: {
    fontSize: 11,
    color: '#43e97b',
    fontWeight: '800',
  },

  nodeGlowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(67, 233, 123, 0.25)',
    backgroundColor: 'rgba(67, 233, 123, 0.06)',
  },

  nodeBubbleLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nodeBubbleLockedIcon: {
    fontSize: 20,
    opacity: 0.3,
  },

  // FAB
  fabWrap: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },

  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
  },

  fabIcon: {
    fontSize: 16,
  },

  fabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Bottom Nav
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