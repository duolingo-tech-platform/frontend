import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { getRanking, RankingEntry as ApiEntry } from '@/services/rankingService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RANK_COLORS = [
  '#f9c74f',
  '#c0c0c0',
  '#cd7f32',
  Colors.accent,
  '#a78bfa',
  Colors.accentCyan,
  '#f472b6',
  Colors.accent,
  '#a78bfa',
  Colors.accentCyan,
];

function accentFor(pos: number) {
  return RANK_COLORS[Math.min(pos - 1, RANK_COLORS.length - 1)];
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0] ?? '').join('').toUpperCase();
}

function fmtXp(xp: number) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

function getISOWeek() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entry {
  position: number;
  userId: string;
  name: string;
  initials: string;
  xp: number;
  streak: number;
  accentColor: string;
  isCurrentUser: boolean;
}

function toEntry(e: ApiEntry, currentUserId?: string): Entry {
  return {
    position: e.position,
    userId: e.userId,
    name: e.name,
    initials: initials(e.name),
    xp: e.xp,
    streak: e.streak,
    accentColor: accentFor(e.position),
    isCurrentUser: !!currentUserId && e.userId === currentUserId,
  };
}

// ─── Podium card ─────────────────────────────────────────────────────────────

const BAR_H: Record<number, number> = { 1: 100, 2: 74, 3: 56 };
const AVATAR_SIZE: Record<number, number> = { 1: 68, 2: 56, 3: 48 };
const MEDAL: Record<number, string> = { 1: '👑', 2: '🥈', 3: '🥉' };

function PodiumCard({ entry }: { entry: Entry }) {
  const barH = BAR_H[entry.position] ?? 56;
  const avSize = AVATAR_SIZE[entry.position] ?? 48;
  const isFirst = entry.position === 1;

  return (
    <View style={[S.podiumItem, isFirst && S.podiumCenter]}>
      {/* Avatar */}
      <View style={[
        S.podiumAvatarWrap,
        {
          width: avSize, height: avSize, borderRadius: avSize / 2,
          borderColor: entry.accentColor + '90',
          shadowColor: isFirst ? entry.accentColor : 'transparent',
        },
        isFirst && S.podiumAvatarGlow,
      ]}>
        <Text style={[S.podiumAvatarText, { fontSize: isFirst ? 20 : 15, color: entry.accentColor }]}>
          {entry.initials}
        </Text>
      </View>

      {/* Medal / crown */}
      <Text style={S.podiumMedal}>{MEDAL[entry.position]}</Text>

      {/* Name */}
      <Text style={S.podiumName} numberOfLines={1}>{entry.name.split(' ')[0]}</Text>

      {/* XP */}
      <Text style={[S.podiumXp, { color: entry.accentColor }]}>{fmtXp(entry.xp)} XP</Text>

      {/* Bar */}
      <View style={[S.podiumBar, { height: barH, borderColor: entry.accentColor + '40', backgroundColor: entry.accentColor + '10' }]}>
        <LinearGradient
          colors={[entry.accentColor + '60', entry.accentColor + '20']}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
        />
        <Text style={[S.podiumPos, { color: entry.accentColor }]}>#{entry.position}</Text>
      </View>
    </View>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────

function RankRow({ entry, maxXp }: { entry: Entry; maxXp: number }) {
  const barPct = maxXp > 0 ? Math.max(4, Math.round((entry.xp / maxXp) * 100)) : 4;
  const isMedal = entry.position <= 3;
  const medalEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <View style={[S.rankRow, entry.isCurrentUser && S.rankRowHighlight]}>
      {/* Position */}
      <View style={S.rankPosBadge}>
        {isMedal
          ? <Text style={{ fontSize: 18 }}>{medalEmoji[entry.position]}</Text>
          : <Text style={[S.rankPosText, { color: entry.accentColor }]}>{entry.position}</Text>}
      </View>

      {/* Avatar */}
      <View style={[S.rankAvatar, { borderColor: entry.accentColor + '60' }]}>
        <Text style={[S.rankAvatarText, { color: entry.accentColor }]}>{entry.initials}</Text>
      </View>

      {/* Info */}
      <View style={S.rankInfo}>
        <View style={S.rankNameRow}>
          <Text style={S.rankName} numberOfLines={1}>{entry.name}</Text>
          {entry.isCurrentUser && (
            <View style={S.youBadge}>
              <Text style={S.youBadgeText}>Você</Text>
            </View>
          )}
        </View>
        <View style={S.rankMeta}>
          <Text style={S.rankStreak}>🔥 {entry.streak}d</Text>
          <View style={S.rankXpBarBg}>
            <View style={[S.rankXpBarFill, { width: `${barPct}%` as any, backgroundColor: entry.accentColor }]} />
          </View>
        </View>
      </View>

      {/* XP */}
      <Text style={[S.rankXp, { color: entry.accentColor }]}>{fmtXp(entry.xp)} XP</Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RankingScreen() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getRanking(10)
        .then((data) => setEntries(data.map((e) => toEntry(e, user?.id))))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [user?.id])
  );

  const me = entries.find((e) => e.isCurrentUser);
  const podium = entries.slice(0, 3);
  const fullList = entries;
  const maxXp = entries[0]?.xp ?? 1;

  const above = me ? entries.find((e) => e.position === me.position - 1) : null;
  const xpGap = above && me ? above.xp - me.xp : 0;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.scroll}>

          {/* ── HEADER ── */}
          <View style={S.header}>
            <View>
              <Text style={S.eyebrow}>CLASSIFICAÇÃO GERAL</Text>
              <Text style={S.title}>Ranking</Text>
            </View>
            <View style={S.weekBadge}>
              <Text style={S.weekBadgeText}>🗓️ Semana {getISOWeek()}</Text>
            </View>
          </View>

          {/* ── SUA POSIÇÃO ── */}
          {me ? (
            <LinearGradient
              colors={['rgba(67,233,123,0.12)', 'rgba(56,249,215,0.06)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={S.myCard}
            >
              <View style={[S.myAvatar, { borderColor: me.accentColor }]}>
                <Text style={[S.myAvatarText, { color: me.accentColor }]}>{me.initials}</Text>
              </View>

              <View style={{ flex: 1, gap: 4 }}>
                <View style={S.myNameRow}>
                  <Text style={S.myName}>{me.name.split(' ')[0]}</Text>
                  <View style={S.youBadge}>
                    <Text style={S.youBadgeText}>Você</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={S.myMeta}>⚡ {fmtXp(me.xp)} XP</Text>
                  <Text style={S.myMeta}>🔥 {me.streak} dias</Text>
                </View>
                {xpGap > 0 && (
                  <Text style={S.myGap}>+{fmtXp(xpGap)} XP para #{me.position - 1}</Text>
                )}
                {me.position === 1 && (
                  <Text style={[S.myGap, { color: '#f9c74f' }]}>👑 Você lidera o ranking!</Text>
                )}
              </View>

              <View style={[S.myPosBadge, { borderColor: me.accentColor + '60' }]}>
                <Text style={[S.myPosText, { color: me.accentColor }]}>#{me.position}</Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={S.joinCard}>
              <Text style={{ fontSize: 28 }}>🏁</Text>
              <View style={{ flex: 1 }}>
                <Text style={S.joinTitle}>Você ainda não está no ranking</Text>
                <Text style={S.joinSub}>Complete lições para ganhar XP e aparecer aqui!</Text>
              </View>
            </View>
          )}

          {/* ── PÓDIO ── */}
          {podium.length >= 3 && (
            <View style={S.podiumSection}>
              <Text style={S.sectionLabel}>PÓDIO</Text>
              <View style={S.podiumRow}>
                <PodiumCard entry={podium[1]} />
                <PodiumCard entry={podium[0]} />
                <PodiumCard entry={podium[2]} />
              </View>
            </View>
          )}

          {/* ── LISTA COMPLETA ── */}
          {fullList.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={S.sectionLabel}>CLASSIFICAÇÃO COMPLETA</Text>
              <View style={S.listCard}>
                {fullList.map((entry, i) => (
                  <View key={entry.userId}>
                    {i > 0 && <View style={S.separator} />}
                    <RankRow entry={entry} maxXp={maxXp} />
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 60, gap: 20 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: Colors.accent, letterSpacing: 2.5, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.white },
  weekBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  weekBadgeText: { fontSize: 12, color: Colors.muted, fontWeight: '600' },

  // My card
  myCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.25)',
    borderRadius: 18, padding: 16,
  },
  myAvatar: {
    width: 52, height: 52, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  myAvatarText: { fontSize: 17, fontWeight: '800' },
  myNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  myName: { fontSize: 16, fontWeight: '800', color: Colors.white },
  myMeta: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
  myGap: { fontSize: 11, color: Colors.accent, fontWeight: '600' },
  myPosBadge: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  myPosText: { fontSize: 20, fontWeight: '800' },

  // Join card
  joinCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 18, padding: 16,
  },
  joinTitle: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 3 },
  joinSub: { fontSize: 12, color: Colors.muted, fontWeight: '500', lineHeight: 17 },

  // Podium section
  podiumSection: { gap: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 2 },
  podiumRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center', gap: 10, paddingVertical: 4,
  },
  podiumItem: { alignItems: 'center', flex: 1, gap: 5 },
  podiumCenter: { zIndex: 1 },
  podiumAvatarWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  podiumAvatarGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 18, elevation: 12,
  },
  podiumAvatarText: { fontWeight: '800' },
  podiumMedal: { fontSize: 20 },
  podiumName: { fontSize: 11, fontWeight: '700', color: Colors.white, textAlign: 'center' },
  podiumXp: { fontSize: 11, fontWeight: '700' },
  podiumBar: {
    width: '100%', borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'flex-end',
    paddingBottom: 8, overflow: 'hidden',
  },
  podiumPos: { fontSize: 13, fontWeight: '800' },

  // List
  listCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 18, overflow: 'hidden',
  },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 14 },

  rankRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rankRowHighlight: { backgroundColor: 'rgba(67,233,123,0.05)' },
  rankPosBadge: { width: 26, alignItems: 'center' },
  rankPosText: { fontSize: 14, fontWeight: '800' },
  rankAvatar: {
    width: 38, height: 38, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rankAvatarText: { fontSize: 12, fontWeight: '800' },
  rankInfo: { flex: 1, gap: 5 },
  rankNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  rankName: { fontSize: 13, fontWeight: '700', color: Colors.white, flexShrink: 1 },
  rankMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankStreak: { fontSize: 11, color: Colors.muted, fontWeight: '500', width: 40 },
  rankXpBarBg: {
    flex: 1, height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 999, overflow: 'hidden',
  },
  rankXpBarFill: { height: '100%', borderRadius: 999 },
  rankXp: { fontSize: 12, fontWeight: '800', flexShrink: 0 },

  // Shared
  youBadge: {
    backgroundColor: 'rgba(67,233,123,0.12)',
    borderWidth: 1, borderColor: 'rgba(67,233,123,0.3)',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
  },
  youBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.accent },
});
