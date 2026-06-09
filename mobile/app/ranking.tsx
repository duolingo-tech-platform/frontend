import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { getRanking, RankingEntry as ApiEntry } from '@/services/rankingService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RANK_COLORS = [
  '#f9c74f',        // 1st gold
  '#e0e0e0',        // 2nd silver
  '#fb923c',        // 3rd bronze
  Colors.accent,
  '#a78bfa',
  Colors.accentCyan,
  '#f472b6',
  Colors.accent,
  '#a78bfa',
  Colors.accentCyan,
];

function accentFor(position: number) {
  return RANK_COLORS[Math.min(position - 1, RANK_COLORS.length - 1)];
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase();
}

// ─── Mapped type ─────────────────────────────────────────────────────────────

interface DisplayEntry {
  position: number;
  userId: string;
  name: string;
  initials: string;
  xp: number;
  streak: number;
  accentColor: string;
  isCurrentUser: boolean;
}

function toDisplay(entry: ApiEntry, currentUserId: string | undefined): DisplayEntry {
  return {
    position: entry.position,
    userId: entry.userId,
    name: entry.name,
    initials: initials(entry.name),
    xp: entry.xp,
    streak: entry.streak,
    accentColor: accentFor(entry.position),
    isCurrentUser: !!currentUserId && entry.userId === currentUserId,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function PodiumCard({ entry }: { entry: DisplayEntry }) {
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

function RankRow({ entry }: { entry: DisplayEntry }) {
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
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>Você</Text>
            </View>
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

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function RankingScreen() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRanking(10)
      .then((data) => setEntries(data.map((e) => toDisplay(e, user?.id))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  const podium = entries.slice(0, 3);
  const rest   = entries.slice(3);

  const weekNumber = Math.ceil((new Date().getMonth() * 4) + Math.ceil(new Date().getDate() / 7));

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── HEADER ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>SEMANA ATUAL</Text>
              <Text style={styles.headerTitle}>Ranking</Text>
            </View>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>🗓️ Semana {weekNumber}</Text>
            </View>
          </View>

          {/* ── SUA POSIÇÃO ── */}
          {currentUserEntry ? (
            <View style={styles.yourPosBanner}>
              <Text style={styles.yourPosLabel}>Sua posição</Text>
              <Text style={styles.yourPosValue}>#{currentUserEntry.position}</Text>
              <Text style={styles.yourPosHint}>
                {currentUserEntry.xp >= 1000 ? `${(currentUserEntry.xp / 1000).toFixed(1)}k XP` : `${currentUserEntry.xp} XP`} 🚀
              </Text>
            </View>
          ) : (
            <View style={styles.yourPosBanner}>
              <Text style={styles.yourPosLabel}>Complete lições para entrar no ranking!</Text>
              <Text style={styles.yourPosHint}>🚀</Text>
            </View>
          )}

          {/* ── PÓDIO ── */}
          {podium.length >= 3 && (
            <View style={styles.podiumRow}>
              <PodiumCard entry={podium[1]} />
              <PodiumCard entry={podium[0]} />
              <PodiumCard entry={podium[2]} />
            </View>
          )}

          {/* ── LISTA ── */}
          {rest.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>CLASSIFICAÇÃO COMPLETA</Text>
              <View style={styles.listCard}>
                {rest.map((entry, i) => (
                  <View key={entry.userId}>
                    {i > 0 && <View style={styles.separator} />}
                    <RankRow entry={entry} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {entries.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🏁</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.muted, textAlign: 'center' }}>
                Nenhum dado de ranking ainda.{'\n'}Complete lições para aparecer aqui!
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      <BottomNav activeTab="ranking" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, gap: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: Colors.accent, letterSpacing: 2.5, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.white },
  weekBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  weekBadgeText: { fontSize: 12, color: Colors.muted, fontWeight: '600' },

  yourPosBanner: {
    backgroundColor: 'rgba(67,233,123,0.06)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.2)',
    borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  yourPosLabel: { fontSize: 12, color: Colors.muted, fontWeight: '600', flex: 1 },
  yourPosValue: { fontSize: 22, fontWeight: '800', color: Colors.white },
  yourPosHint: { fontSize: 13, color: Colors.accent, fontWeight: '700' },

  podiumRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center', gap: 12, paddingVertical: 8,
  },
  podiumItem: { alignItems: 'center', flex: 1, gap: 6 },
  podiumCenter: { zIndex: 1 },
  podiumAvatar: {
    width: 52, height: 52, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  podiumAvatarText: { fontSize: 16, fontWeight: '800' },
  podiumMedal: { fontSize: 20 },
  podiumName: { fontSize: 11, fontWeight: '700', color: Colors.white, textAlign: 'center' },
  podiumXp: { fontSize: 11, fontWeight: '700' },
  podiumBar: {
    width: '100%', borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8,
  },
  podiumPos: { fontSize: 13, fontWeight: '800' },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 2 },
  listCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 18, overflow: 'hidden',
  },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  rankRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rankRowHighlight: { backgroundColor: 'rgba(67,233,123,0.06)' },
  rankPos: { fontSize: 14, fontWeight: '800', color: Colors.mutedDark, width: 20, textAlign: 'center' },
  rankAvatar: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  rankAvatarText: { fontSize: 13, fontWeight: '800' },
  rankInfo: { flex: 1, gap: 2 },
  rankNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankName: { fontSize: 14, fontWeight: '700', color: Colors.white },
  youBadge: {
    backgroundColor: 'rgba(67,233,123,0.12)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.3)',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
  },
  youBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.accent },
  rankStreak: { fontSize: 11, color: Colors.muted, fontWeight: '500' },
  rankXp: { fontSize: 13, fontWeight: '800' },
});
