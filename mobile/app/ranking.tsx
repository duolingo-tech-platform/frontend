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

interface RankingEntry {
  position: number;
  name: string;
  initials: string;
  xp: number;
  streak: number;
  accentColor: string;
  isCurrentUser?: boolean;
}

const TOP_USERS: RankingEntry[] = [
  { position: 1, name: 'Ana Silva',    initials: 'AS', xp: 9800, streak: 42, accentColor: '#f9c74f' },
  { position: 2, name: 'Carlos Lima',  initials: 'CL', xp: 8450, streak: 31, accentColor: '#e0e0e0' },
  { position: 3, name: 'Beatriz Melo', initials: 'BM', xp: 7200, streak: 28, accentColor: '#fb923c' },
  { position: 4, name: 'João Dev',     initials: 'JD', xp: 5400, streak: 14, accentColor: '#43e97b', isCurrentUser: true },
  { position: 5, name: 'Diego Souza',  initials: 'DS', xp: 4980, streak: 10, accentColor: '#a78bfa' },
  { position: 6, name: 'Larissa K.',   initials: 'LK', xp: 4310, streak: 7,  accentColor: '#38f9d7' },
  { position: 7, name: 'Rafael N.',    initials: 'RN', xp: 3890, streak: 5,  accentColor: '#38f9d7' },
  { position: 8, name: 'Mariana T.',   initials: 'MT', xp: 3200, streak: 3,  accentColor: '#a78bfa' },
  { position: 9, name: 'Pedro A.',     initials: 'PA', xp: 2750, streak: 2,  accentColor: '#38f9d7' },
  { position: 10, name: 'Julia F.',    initials: 'JF', xp: 2100, streak: 1,  accentColor: '#43e97b' },
];

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function PodiumCard({ entry }: { entry: RankingEntry }) {
  const height = entry.position === 1 ? 110 : entry.position === 2 ? 88 : 70;
  return (
    <View style={[styles.podiumItem, entry.position === 1 && styles.podiumCenter]}>
      <View style={[styles.podiumAvatar, { borderColor: entry.accentColor + '80' }]}>
        <Text style={[styles.podiumAvatarText, { color: entry.accentColor }]}>{entry.initials}</Text>
      </View>
      <Text style={styles.podiumMedal}>{MEDAL[entry.position]}</Text>
      <Text style={styles.podiumName} numberOfLines={1}>{entry.name.split(' ')[0]}</Text>
      <Text style={[styles.podiumXp, { color: entry.accentColor }]}>{(entry.xp / 1000).toFixed(1)}k XP</Text>
      <View style={[styles.podiumBar, { height, borderColor: entry.accentColor + '40', backgroundColor: entry.accentColor + '14' }]}>
        <Text style={[styles.podiumPos, { color: entry.accentColor }]}>#{entry.position}</Text>
      </View>
    </View>
  );
}

function RankRow({ entry }: { entry: RankingEntry }) {
  return (
    <View style={[styles.rankRow, entry.isCurrentUser && styles.rankRowHighlight]}>
      <Text style={styles.rankPos}>{entry.position}</Text>
      <View style={[styles.rankAvatar, { borderColor: entry.accentColor + '60' }]}>
        <Text style={[styles.rankAvatarText, { color: entry.accentColor }]}>{entry.initials}</Text>
      </View>
      <View style={styles.rankInfo}>
        <View style={styles.rankNameRow}>
          <Text style={styles.rankName}>{entry.name}</Text>
          {entry.isCurrentUser && (
            <View style={styles.youBadge}><Text style={styles.youBadgeText}>Você</Text></View>
          )}
        </View>
        <Text style={styles.rankStreak}>🔥 {entry.streak} dias</Text>
      </View>
      <Text style={[styles.rankXp, { color: entry.accentColor }]}>
        {entry.xp >= 1000 ? `${(entry.xp / 1000).toFixed(1)}k` : entry.xp} XP
      </Text>
    </View>
  );
}

export default function RankingScreen() {
  const router = useRouter();
  const podium = TOP_USERS.slice(0, 3);
  const rest = TOP_USERS.slice(3);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#010d19', '#021a2e', '#010d19']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>SEMANA ATUAL</Text>
              <Text style={styles.headerTitle}>Ranking</Text>
            </View>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>🗓️ Semana 22</Text>
            </View>
          </View>

          {/* User position banner */}
          <View style={styles.yourPosBanner}>
            <Text style={styles.yourPosLabel}>Sua posição</Text>
            <Text style={styles.yourPosValue}>#4 de 248</Text>
            <Text style={styles.yourPosHint}>Top 8% 🚀</Text>
          </View>

          {/* Podium */}
          <View style={styles.podiumRow}>
            <PodiumCard entry={podium[1]} />
            <PodiumCard entry={podium[0]} />
            <PodiumCard entry={podium[2]} />
          </View>

          {/* List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>CLASSIFICAÇÃO COMPLETA</Text>
            <View style={styles.listCard}>
              {rest.map((entry, i) => (
                <View key={entry.position}>
                  {i > 0 && <View style={styles.separator} />}
                  <RankRow entry={entry} />
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/courses')}>
            <Text style={styles.navIcon}>📚</Text>
            <Text style={styles.navLabel}>Cursos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIconActive}>🏅</Text>
            <Text style={styles.navLabelActive}>Ranking</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, gap: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#43e97b', letterSpacing: 2.5, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  weekBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  weekBadgeText: { fontSize: 12, color: '#5a7a8a', fontWeight: '600' },

  yourPosBanner: {
    backgroundColor: 'rgba(67,233,123,0.06)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)',
    borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  yourPosLabel: { fontSize: 12, color: '#5a7a8a', fontWeight: '600' },
  yourPosValue: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  yourPosHint: { fontSize: 13, color: '#43e97b', fontWeight: '700' },

  podiumRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center', gap: 12, paddingVertical: 8,
  },
  podiumItem: { alignItems: 'center', flex: 1, gap: 6 },
  podiumCenter: { marginBottom: 0, zIndex: 1 },
  podiumAvatar: {
    width: 52, height: 52, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  podiumAvatarText: { fontSize: 16, fontWeight: '800' },
  podiumMedal: { fontSize: 20 },
  podiumName: { fontSize: 11, fontWeight: '700', color: '#ffffff', textAlign: 'center' },
  podiumXp: { fontSize: 11, fontWeight: '700' },
  podiumBar: {
    width: '100%', borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8,
  },
  podiumPos: { fontSize: 13, fontWeight: '800' },

  listSection: { gap: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#5a7a8a', letterSpacing: 2 },
  listCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, overflow: 'hidden',
  },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  rankRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rankRowHighlight: { backgroundColor: 'rgba(67,233,123,0.06)' },
  rankPos: { fontSize: 14, fontWeight: '800', color: '#3a5a6a', width: 20, textAlign: 'center' },
  rankAvatar: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  rankAvatarText: { fontSize: 13, fontWeight: '800' },
  rankInfo: { flex: 1, gap: 2 },
  rankNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankName: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  youBadge: {
    backgroundColor: 'rgba(67,233,123,0.12)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.3)',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
  },
  youBadgeText: { fontSize: 9, fontWeight: '700', color: '#43e97b' },
  rankStreak: { fontSize: 11, color: '#5a7a8a', fontWeight: '500' },
  rankXp: { fontSize: 13, fontWeight: '800' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: '#021a2e',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
    paddingBottom: 28, paddingTop: 12, paddingHorizontal: 8,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 20, opacity: 0.4 },
  navIconActive: { fontSize: 20 },
  navLabel: { fontSize: 10, color: '#3a5a6a', fontWeight: '600' },
  navLabelActive: { fontSize: 10, color: '#43e97b', fontWeight: '700' },
});
