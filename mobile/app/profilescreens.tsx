import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, changePassword, deleteAccount, getAdminStats, PlatformStats, setRankingVisibility } from '@/services/authService';
import { getProgress, getCourseProgress, getProgressHistory, HistoryItem } from '@/services/coursesService';

const { width } = Dimensions.get('window');

// ─── Design Tokens ───────────────────────────────────────────────────────────

const C = {
  bg: '#010d19',
  bg2: '#021a2e',
  accent: '#43e97b',
  accentDim: 'rgba(67,233,123,0.10)',
  accentBorder: 'rgba(67,233,123,0.30)',
  accentBorder2: 'rgba(67,233,123,0.15)',
  text: '#ffffff',
  muted: '#5a7a8a',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.07)',
  danger: '#ff4d6d',
  dangerDim: 'rgba(255,77,109,0.12)',
  dangerBorder: 'rgba(255,77,109,0.3)',
  warn: '#f9c74f',
  warnDim: 'rgba(249,199,79,0.12)',
};

// ─── Shared Components ────────────────────────────────────────────────────────

type BadgeProps = { label: string };
function Badge({ label }: BadgeProps) {
  return (
    <View style={sh.badge}>
      <Text style={sh.badgeText}>{label}</Text>
    </View>
  );
}

type SectionCardProps = { children: React.ReactNode };
function SectionCard({ children }: SectionCardProps) {
  return <View style={sh.card}>{children}</View>;
}

type RowItemProps = {
  icon: string;
  label: string;
  value?: string;
  accent?: boolean;
  danger?: boolean;
  onPress?: () => void;
};
function RowItem({ icon, label, value, accent, danger, onPress }: RowItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={sh.rowItem}
    >
      <View style={sh.rowLeft}>
        <View
          style={[
            sh.rowIcon,
            accent && { backgroundColor: C.accentDim, borderColor: C.accentBorder },
            danger && { backgroundColor: C.dangerDim, borderColor: C.dangerBorder },
          ]}
        >
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
        <Text
          style={[
            sh.rowLabel,
            accent && { color: C.accent },
            danger && { color: C.danger },
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={sh.rowRight}>
        {value ? <Text style={sh.rowValue}>{value}</Text> : null}
        <Text style={sh.rowChevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

type StatItemProps = { value: string; label: string };
function StatItem({ value, label }: StatItemProps) {
  return (
    <View style={sh.statItem}>
      <Text style={sh.statNumber}>{value}</Text>
      <Text style={sh.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Achievement = { icon: string; label: string };

function computeAchievements(
  user: { xp: number; streak: number; level: number } | null,
  progressMap: Record<string, number>,
): Achievement[] {
  if (!user) return [];
  const earned: Achievement[] = [];
  const anyProgress = Object.values(progressMap).some((p) => p > 0);
  if (anyProgress) earned.push({ icon: '🏆', label: 'Primeira Aula' });
  if (user.streak >= 3) earned.push({ icon: '📅', label: '3 Dias Seguidos' });
  if (user.streak >= 7) earned.push({ icon: '🔥', label: '7 Dias Seguidos' });
  if (user.streak >= 30) earned.push({ icon: '🌙', label: '30 Dias Seguidos' });
  if (user.xp >= 10) earned.push({ icon: '⚡', label: 'Primeiros XP' });
  if (user.xp >= 100) earned.push({ icon: '💎', label: '100 XP' });
  if (user.xp >= 500) earned.push({ icon: '🚀', label: '500 XP' });
  const any50 = Object.values(progressMap).some((p) => p >= 50);
  if (any50) earned.push({ icon: '🎯', label: 'Meta Batida' });
  const any100 = Object.values(progressMap).some((p) => p >= 100);
  if (any100) earned.push({ icon: '🎓', label: 'Curso Completo' });
  if (user.level >= 5) earned.push({ icon: '🌟', label: 'Nível 5' });
  if (user.level >= 10) earned.push({ icon: '👑', label: 'Nível 10' });
  return earned;
}

// ─── TELA 1: Perfil ──────────────────────────────────────────────────────────

export function TelaPerfil({ onNavigate, onSignOut }: { onNavigate: (screen: string) => void; onSignOut: () => void }) {
  const { user, refreshUser } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoadingProgress(true);
        try {
          await refreshUser();
          const courseData = await getCourseProgress();
          if (!active) return;
          const map: Record<string, number> = {};
          courseData.forEach((cp) => { map[cp.courseId] = cp.percent; });
          setProgressMap(map);
        } catch {
        } finally {
          if (active) setLoadingProgress(false);
        }
      }
      load();
      return () => { active = false; };
    }, [])
  );

  const achievements = computeAchievements(user, progressMap);

  const displayName = user?.name ?? '';
  const displayEmail = user?.email ?? '';
  const displayInitials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0] ?? '')
    .join('')
    .toUpperCase() || '?';
  const level = user?.level ?? 0;
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  const xpInLevel = xp % 100 === 0 && xp > 0 ? 100 : xp % 100;
  const xpToNext = 100 - xpInLevel;
  const xpProgress = xpInLevel / 100;

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('editar')}
            style={sh.badge}
          >
            <Text style={sh.badgeText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.glowRing}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{displayInitials}</Text>
            </View>
          </View>
          <View style={[s.levelBadge]}>
            <Text style={s.levelBadgeText}>⚡ Nível {level}</Text>
          </View>
          <Text style={s.profileName}>{displayName}</Text>
          <Text style={s.profileEmail}>{displayEmail}</Text>
          <View style={s.rankChip}>
            <Text style={s.rankChipText}>🏆 {xp} XP acumulados</Text>
          </View>
        </View>

        {/* XP Bar */}
        <SectionCard>
          <View style={s.xpRow}>
            <Text style={s.xpLabel}>Progresso — Nível {level}</Text>
            <Text style={s.xpValue}>{xpInLevel} / 100 XP</Text>
          </View>
          <View style={s.xpBarBg}>
            <LinearGradient
              colors={[C.accent, '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.xpBarFill, { width: `${Math.round(xpProgress * 100)}%` as any }]}
            />
          </View>
          <Text style={s.xpHint}>{xpToNext} XP para o nível {level + 1}</Text>
        </SectionCard>

        {/* Stats */}
        <View style={s.statsRow}>
          <StatItem value={xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp)} label="XP Total" />
          <View style={sh.divider} />
          <StatItem value={String(level)} label="Nível" />
          <View style={sh.divider} />
          <StatItem value={`🔥 ${streak}`} label="Sequência" />
        </View>

        {/* Conquistas */}
        <SectionCard>
          <Text style={s.sectionLabel}>🏅 CONQUISTAS DESBLOQUEADAS</Text>
          {loadingProgress ? (
            <ActivityIndicator color={C.accent} style={{ paddingVertical: 16 }} />
          ) : achievements.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 16, gap: 6 }}>
              <Text style={{ fontSize: 28 }}>🔒</Text>
              <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>
                Complete lições para desbloquear conquistas
              </Text>
            </View>
          ) : (
            <View style={s.badgesRow}>
              {achievements.map((b) => (
                <View key={b.label} style={s.achievementChip}>
                  <Text style={{ fontSize: 18 }}>{b.icon}</Text>
                  <Text style={s.achievementLabel}>{b.label}</Text>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        {/* Quick nav */}
        <SectionCard>
          <RowItem icon="📖" label="Histórico de Atividades" onPress={() => onNavigate('historico')} />
          <View style={sh.separator} />
          <RowItem icon="⚙️" label="Configurações" onPress={() => onNavigate('configuracoes')} />
          <View style={sh.separator} />
          <RowItem icon="🚪" label="Sair da Conta" danger onPress={onSignOut} />
        </SectionCard>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 2: Editar Perfil ────────────────────────────────────────────────────

export function TelaEditarPerfil({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const { user, refreshUser } = useAuth();
  const [nome, setNome] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const displayInitials = nome
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0] ?? '')
    .join('')
    .toUpperCase() || '?';

  const handleSave = async () => {
    if (!nome.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile({ name: nome.trim(), email: email.trim(), bio: bio.trim() });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('perfil')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Editar Perfil</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.glowRing}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{displayInitials}</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <SectionCard>
          <Text style={s.sectionLabel}>INFORMAÇÕES PESSOAIS</Text>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Nome completo</Text>
            <TextInput
              style={s.input}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor={C.muted}
              selectionColor={C.accent}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>E-mail</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={C.muted}
              selectionColor={C.accent}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Bio</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              placeholderTextColor={C.muted}
              selectionColor={C.accent}
            />
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={s.sectionLabel}>SEGURANÇA</Text>
          <RowItem icon="🔑" label="Alterar senha" onPress={() => onNavigate('alterar-senha')} />
        </SectionCard>

        {error ? (
          <Text style={{ fontSize: 12, color: C.danger, textAlign: 'center' }}>{error}</Text>
        ) : null}

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={saving ? 1 : 0.85}
            style={{ width: '100%', opacity: saving ? 0.7 : 1 }}
            onPress={saving ? undefined : handleSave}
          >
            <LinearGradient
              colors={saved ? ['#38f9d7', '#43e97b'] : ['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.primaryButton}
            >
              {saving ? (
                <ActivityIndicator color={C.bg} />
              ) : (
                <Text style={s.primaryButtonText}>
                  {saved ? '✓ SALVO COM SUCESSO' : 'SALVAR ALTERAÇÕES'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 3: Histórico ───────────────────────────────────────────────────────

function courseIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('react')) return '⚡';
  if (t.includes('aws') || t.includes('cloud')) return '☁️';
  if (t.includes('docker') || t.includes('container')) return '🐳';
  if (t.includes('python')) return '🐍';
  if (t.includes('node') || t.includes('javascript')) return '💚';
  if (t.includes('typescript')) return '🔷';
  if (t.includes('kubernetes') || t.includes('k8s')) return '⚙️';
  if (t.includes('java') || t.includes('spring')) return '☕';
  return '💻';
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const time = `${hh}h${mm}`;
  if (d.getTime() === today.getTime()) return `Hoje, ${time}`;
  if (d.getTime() === yesterday.getTime()) return `Ontem, ${time}`;
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${time}`;
}

export function TelaHistorico({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [filter, setFilter] = useState<'todos' | 'acerto' | 'erro'>('todos');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getProgressHistory()
        .then((data) => { if (active) { setHistory(data); setLoading(false); } })
        .catch(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [])
  );

  const filtered = history.filter((i) => {
    const correct = i.totalExercises > 0 && i.correctAnswers === i.totalExercises;
    if (filter === 'acerto') return correct;
    if (filter === 'erro') return !correct;
    return true;
  });

  const totalLessons = history.length;
  const totalCorrect = history.filter((i) => i.totalExercises > 0 && i.correctAnswers === i.totalExercises).length;
  const rate = totalLessons > 0 ? Math.round((totalCorrect / totalLessons) * 100) : 0;

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'acerto', label: '✓ Perfeito' },
    { key: 'erro', label: '✗ Com Erros' },
  ];

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('perfil')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Histórico</Text>
          <View style={{ width: 60 }} />
        </View>

        {loading ? (
          <ActivityIndicator color={C.accent} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Summary */}
            <View style={s.statsRow}>
              <StatItem value={String(totalLessons)} label="Lições" />
              <View style={sh.divider} />
              <StatItem value={String(totalCorrect)} label="Perfeitas" />
              <View style={sh.divider} />
              <StatItem value={`${rate}%`} label="Taxa" />
            </View>

            {/* Filters */}
            <View style={s.filterRow}>
              {filters.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setFilter(f.key)}
                  style={[s.filterBtn, filter === f.key && s.filterBtnActive]}
                >
                  <Text style={[s.filterBtnText, filter === f.key && s.filterBtnTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* List */}
            {filtered.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
                <Text style={{ fontSize: 32 }}>📭</Text>
                <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center' }}>
                  {history.length === 0
                    ? 'Nenhuma lição concluída ainda'
                    : 'Nenhum resultado para esse filtro'}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10, width: '100%' }}>
                {filtered.map((item) => {
                  const perfect = item.totalExercises > 0 && item.correctAnswers === item.totalExercises;
                  const icon = courseIcon(item.courseTitle);
                  return (
                    <View key={item.lessonId} style={s.historyCard}>
                      <View
                        style={[
                          s.historyIcon,
                          perfect
                            ? { backgroundColor: C.accentDim, borderColor: C.accentBorder }
                            : { backgroundColor: C.warnDim, borderColor: 'rgba(249,199,79,0.3)' },
                        ]}
                      >
                        <Text style={{ fontSize: 18 }}>{icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.historyTitle} numberOfLines={1}>
                          {item.courseTitle} — {item.moduleTitle}
                        </Text>
                        <Text style={s.historySubtitle} numberOfLines={1}>{item.lessonTitle}</Text>
                        <Text style={s.historyTime}>{formatDate(item.completedAt)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <Text style={[s.historyXp, !perfect && { color: C.warn }]}>
                          {item.xpEarned > 0 ? `+${item.xpEarned} XP` : '0 XP'}
                        </Text>
                        <View style={[s.correctBadge, !perfect && { backgroundColor: C.warnDim, borderColor: 'rgba(249,199,79,0.3)' }]}>
                          <Text style={[s.correctBadgeText, !perfect && { color: C.warn }]}>
                            {item.totalExercises > 0
                              ? `${item.correctAnswers}/${item.totalExercises}`
                              : '✓'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 4: Configurações ────────────────────────────────────────────────────

export function TelaConfiguracoes({ onNavigate, onSignOut }: { onNavigate: (screen: string) => void; onSignOut: () => void }) {
  const { user, refreshUser } = useAuth();
  const [rankingVisible, setRankingVisible] = useState(user?.showInRanking ?? true);
  const [savingRanking, setSavingRanking] = useState(false);

  async function handleToggleRanking(value: boolean) {
    setRankingVisible(value);
    setSavingRanking(true);
    try {
      await setRankingVisibility(value);
      await refreshUser();
    } catch {
      setRankingVisible(!value);
    } finally {
      setSavingRanking(false);
    }
  }

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('perfil')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Configurações</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Conta */}
        <SectionCard>
          <Text style={s.sectionLabel}>CONTA</Text>
          <RowItem icon="👤" label="Editar Perfil" onPress={() => onNavigate('editar')} />
          <View style={sh.separator} />
          <RowItem icon="🔑" label="Alterar Senha" onPress={() => onNavigate('alterar-senha')} />
          <View style={sh.separator} />
          <RowItem icon="🗑️" label="Deletar Conta" danger onPress={() => onNavigate('deletar-conta')} />
        </SectionCard>

        {/* Privacidade */}
        <SectionCard>
          <Text style={s.sectionLabel}>PRIVACIDADE</Text>
          <View style={s.toggleRow}>
            <View style={sh.rowLeft}>
              <View style={[sh.rowIcon, { backgroundColor: 'rgba(249,199,79,0.10)', borderColor: 'rgba(249,199,79,0.25)' }]}>
                <Text style={{ fontSize: 16 }}>🏅</Text>
              </View>
              <View style={{ gap: 2 }}>
                <Text style={sh.rowLabel}>Aparecer no Ranking</Text>
                <Text style={s.toggleSub}>
                  {rankingVisible ? 'Visível para outros usuários' : 'Oculto do ranking público'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={savingRanking ? 1 : 0.8}
              onPress={savingRanking ? undefined : () => handleToggleRanking(!rankingVisible)}
              style={[s.toggleTrack, rankingVisible ? s.toggleTrackOn : s.toggleTrackOff]}
            >
              <View style={[s.toggleThumb, rankingVisible ? s.toggleThumbOn : s.toggleThumbOff]} />
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Plataforma */}
        <SectionCard>
          <Text style={s.sectionLabel}>PLATAFORMA</Text>
          <RowItem icon="📊" label="Estatísticas da Plataforma" accent onPress={() => onNavigate('estatisticas')} />
        </SectionCard>

        {/* Suporte */}
        <SectionCard>
          <Text style={s.sectionLabel}>SUPORTE</Text>
          <RowItem icon="❓" label="Central de Ajuda" onPress={() => onNavigate('central-ajuda')} />
          <View style={sh.separator} />
          <RowItem icon="📄" label="Termos de Uso" onPress={() => onNavigate('termos')} />
        </SectionCard>

        <View style={s.versionRow}>
          <Badge label="🚀 Versão Beta Gratuita" />
          <Text style={s.versionText}>v0.9.1 · build 204</Text>
        </View>

        {/* Logout */}
        <View style={s.actions}>
          <TouchableOpacity activeOpacity={0.85} style={s.dangerButton} onPress={onSignOut}>
            <Text style={s.dangerButtonText}>🚪 SAIR DA CONTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 5: Alterar Senha ────────────────────────────────────────────────────

export function TelaAlterarSenha({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirma, setConfirma] = useState('');
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const novaStrength = nova.length === 0 ? null : nova.length < 6 ? 'fraca' : nova.length < 10 ? 'média' : 'forte';
  const strengthColor = novaStrength === 'fraca' ? '#ff4d4d' : novaStrength === 'média' ? '#ffaa00' : '#43e97b';
  const strengthWidth = novaStrength === 'fraca' ? '33%' : novaStrength === 'média' ? '66%' : '100%';

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Alterar Senha</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={[sh.card, { width: '100%' }]}>
          <Text style={s.sectionLabel}>SEGURANÇA</Text>

          {/* Senha atual */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>SENHA ATUAL</Text>
            <View style={[s.input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, height: 48 }]}>
              <TextInput
                style={{ flex: 1, color: C.text, fontSize: 14 }}
                value={atual}
                onChangeText={setAtual}
                secureTextEntry={!showAtual}
                placeholderTextColor={C.muted}
                placeholder="••••••••"
                selectionColor={C.accent}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowAtual(v => !v)} activeOpacity={0.7} style={{ padding: 8 }}>
                <Text style={{ fontSize: 16 }}>{showAtual ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nova senha */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>NOVA SENHA</Text>
            <View style={[s.input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, height: 48 }]}>
              <TextInput
                style={{ flex: 1, color: C.text, fontSize: 14 }}
                value={nova}
                onChangeText={setNova}
                secureTextEntry={!showNova}
                placeholderTextColor={C.muted}
                placeholder="••••••••"
                selectionColor={C.accent}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowNova(v => !v)} activeOpacity={0.7} style={{ padding: 8 }}>
                <Text style={{ fontSize: 16 }}>{showNova ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {nova.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: strengthWidth as any, backgroundColor: strengthColor, borderRadius: 999 }} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: strengthColor }}>Senha {novaStrength}</Text>
            </View>
          )}

          {/* Confirmar nova senha */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>CONFIRMAR NOVA SENHA</Text>
            <View style={[s.input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, height: 48 }]}>
              <TextInput
                style={{ flex: 1, color: C.text, fontSize: 14 }}
                value={confirma}
                onChangeText={setConfirma}
                secureTextEntry={!showConfirma}
                placeholderTextColor={C.muted}
                placeholder="••••••••"
                selectionColor={C.accent}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirma(v => !v)} activeOpacity={0.7} style={{ padding: 8 }}>
                <Text style={{ fontSize: 16 }}>{showConfirma ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {confirma.length > 0 && confirma !== nova && (
            <Text style={{ fontSize: 12, color: C.danger, marginTop: -8, marginBottom: 4 }}>Senhas não coincidem</Text>
          )}
        </View>

        {error ? (
          <Text style={{ fontSize: 12, color: C.danger, textAlign: 'center', marginTop: -8 }}>{error}</Text>
        ) : null}

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={saving || !atual || !nova || nova !== confirma ? 1 : 0.85}
            style={{ width: '100%', opacity: saving || !atual || !nova || nova !== confirma ? 0.5 : 1 }}
            onPress={async () => {
              if (saving || !atual || !nova || nova !== confirma) return;
              setSaving(true);
              setError('');
              try {
                await changePassword(atual, nova);
                setSaved(true);
                setAtual('');
                setNova('');
                setConfirma('');
                setTimeout(() => setSaved(false), 3000);
              } catch (e: any) {
                setError(e.message ?? 'Erro ao alterar senha.');
              } finally {
                setSaving(false);
              }
            }}
          >
            <LinearGradient
              colors={saved ? ['#38f9d7', '#43e97b'] : ['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.primaryButton}
            >
              {saving
                ? <ActivityIndicator color={C.bg} />
                : <Text style={s.primaryButtonText}>{saved ? '✓ SENHA ATUALIZADA' : 'SALVAR NOVA SENHA'}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 6: Deletar Conta ───────────────────────────────────────────────────

export function TelaDeletarConta({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const canDelete = confirm === 'DELETAR';

  async function handleDelete() {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setError('');
    try {
      await deleteAccount();
      await logout();
      router.replace('/login');
    } catch (e: any) {
      setError(e.message ?? 'Erro ao deletar conta.');
      setDeleting(false);
    }
  }

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: C.danger }]}>Deletar Conta</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={{ alignItems: 'center', gap: 8, paddingVertical: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 999, backgroundColor: C.dangerDim, borderWidth: 1, borderColor: C.dangerBorder, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 36 }}>⚠️</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.danger }}>Ação Irreversível</Text>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
            Todos os seus dados, progresso, conquistas e histórico serão permanentemente apagados.
          </Text>
        </View>

        <SectionCard>
          <Text style={s.sectionLabel}>O QUE VOCÊ PERDE</Text>
          {['Todo o progresso nos cursos', 'XP e conquistas acumuladas', 'Streak e histórico de atividades', 'Acesso a conteúdos desbloqueados'].map(item => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
              <Text style={{ color: C.danger, fontSize: 14 }}>✗</Text>
              <Text style={{ fontSize: 13, color: C.muted }}>{item}</Text>
            </View>
          ))}
        </SectionCard>

        <View style={[sh.card, { width: '100%' }]}>
          <Text style={s.sectionLabel}>CONFIRMAÇÃO</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
            Digite <Text style={{ color: C.danger, fontWeight: '700' }}>DELETAR</Text> para confirmar
          </Text>
          <TextInput
            style={[s.input, { color: canDelete ? C.danger : C.text, borderColor: canDelete ? C.dangerBorder : C.cardBorder }]}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="DELETAR"
            placeholderTextColor={C.muted}
            autoCapitalize="characters"
            selectionColor={C.danger}
          />
        </View>

        {error ? (
          <Text style={{ fontSize: 12, color: C.danger, textAlign: 'center', marginTop: -8 }}>{error}</Text>
        ) : null}

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={canDelete && !deleting ? 0.85 : 1}
            style={[s.dangerButton, (!canDelete || deleting) && { opacity: 0.4 }]}
            onPress={handleDelete}
          >
            {deleting
              ? <ActivityIndicator color={C.danger} />
              : <Text style={s.dangerButtonText}>🗑️ DELETAR MINHA CONTA</Text>}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={{ fontSize: 14, color: C.muted, fontWeight: '500' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 8: Central de Ajuda ─────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: 'Como funciona o sistema de XP?', a: 'Você ganha XP ao completar lições e exercícios. Quanto melhor sua performance, mais XP você recebe. Use o XP para subir de nível.' },
  { q: 'O que é o Streak diário?', a: 'O streak conta quantos dias consecutivos você estudou. Mantenha o streak ativo completando pelo menos uma lição por dia.' },
  { q: 'Posso usar o app offline?', a: 'Algumas funcionalidades estão disponíveis offline, mas o progresso é sincronizado quando você reconectar à internet.' },
  { q: 'Como redefinir minha senha?', a: 'Acesse a tela de login e clique em "Esqueci minha senha". Você receberá um código por e-mail para criar uma nova senha.' },
  { q: 'Como cancelar minha conta?', a: 'Vá em Configurações → Deletar Conta. O processo é irreversível — todos os dados serão apagados permanentemente.' },
  { q: 'Os certificados têm validade?', a: 'Os certificados emitidos pela plataforma não têm prazo de validade e ficam disponíveis no seu perfil para download.' },
];

export function TelaCentralAjuda({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Central de Ajuda</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 32 }}>🤔</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Como podemos ajudar?</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>Perguntas frequentes abaixo</Text>
        </View>

        <View style={{ width: '100%', gap: 8 }}>
          {FAQ_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => setExpanded(expanded === i ? null : i)}
              style={[sh.card, { width: '100%' }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, flex: 1, lineHeight: 20 }}>{item.q}</Text>
                <Text style={{ fontSize: 18, color: C.accent, marginLeft: 12 }}>{expanded === i ? '−' : '+'}</Text>
              </View>
              {expanded === i && (
                <Text style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 20 }}>{item.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 9: Termos de Uso ────────────────────────────────────────────────────

export function TelaTermos({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Termos de Uso</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={{ width: '100%' }}>
          <Text style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Última atualização: 01 de maio de 2026</Text>
          {[
            { title: '1. Aceitação dos Termos', body: 'Ao acessar ou usar a Duolingo Tech Platform, você concorda em cumprir estes Termos de Uso. Se não concordar com alguma parte dos termos, não poderá acessar a plataforma.' },
            { title: '2. Uso da Plataforma', body: 'Você pode usar a plataforma apenas para fins educacionais pessoais e não comerciais. É proibido reproduzir, distribuir ou criar trabalhos derivados do conteúdo sem autorização expressa.' },
            { title: '3. Conta de Usuário', body: 'Você é responsável por manter a confidencialidade das credenciais da sua conta e por todas as atividades realizadas com ela. Notifique-nos imediatamente sobre qualquer uso não autorizado.' },
            { title: '4. Conteúdo do Usuário', body: 'Ao enviar conteúdo para a plataforma, você concede uma licença não exclusiva para uso, reprodução e exibição desse conteúdo em conexão com a operação da plataforma.' },
            { title: '5. Propriedade Intelectual', body: 'Todo o conteúdo da plataforma — textos, gráficos, logos, ícones, imagens e software — é propriedade da Duolingo Tech Platform e está protegido por leis de direitos autorais.' },
            { title: '6. Limitação de Responsabilidade', body: 'A plataforma é fornecida "no estado em que se encontra". Não garantimos que o serviço seja ininterrupto, livre de erros ou que os resultados obtidos com o uso sejam precisos.' },
            { title: '7. Modificações', body: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação. O uso continuado constitui aceitação dos termos revisados.' },
            { title: '8. Contato', body: 'Dúvidas sobre estes termos? Entre em contato pelo menu Suporte → Fale Conosco.' },
          ].map(section => (
            <View key={section.title} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.accent, marginBottom: 6 }}>{section.title}</Text>
              <Text style={{ fontSize: 13, color: C.muted, lineHeight: 21 }}>{section.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 10: Estatísticas da Plataforma (RF28) ──────────────────────────────

export function TelaEstatisticas({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getAdminStats()
        .then((data) => { if (active) { setStats(data); setLoading(false); } })
        .catch((err: any) => { if (active) { setError(err?.message ?? 'Erro ao carregar.'); setLoading(false); } });
      return () => { active = false; };
    }, [])
  );

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Estatísticas</Text>
          <View style={{ width: 60 }} />
        </View>

        {loading ? (
          <ActivityIndicator color={C.accent} style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
            <Text style={{ fontSize: 28 }}>😕</Text>
            <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>{error}</Text>
          </View>
        ) : stats ? (
          <>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 32 }}>📊</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Visão Geral da Plataforma</Text>
            </View>

            {/* Main numbers */}
            <View style={s.statsRow}>
              <StatItem value={String(stats.totalUsers)} label="Usuários" />
              <View style={sh.divider} />
              <StatItem value={String(stats.totalCompletions)} label="Conclusões" />
              <View style={sh.divider} />
              <StatItem value={String(stats.activeToday)} label="Ativos Hoje" />
            </View>

            {/* Content counts */}
            <View style={s.statsRow}>
              <StatItem value={String(stats.totalCourses)} label="Cursos" />
              <View style={sh.divider} />
              <StatItem value={String(stats.totalLessons)} label="Lições" />
              <View style={sh.divider} />
              <StatItem value={String(stats.totalExercises)} label="Exercícios" />
            </View>

            {/* Detail cards */}
            <SectionCard>
              <Text style={s.sectionLabel}>ENGAJAMENTO</Text>
              <View style={{ gap: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: C.muted, fontWeight: '500' }}>XP Médio por Usuário</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: C.accent }}>{stats.averageXp} XP</Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: C.muted, fontWeight: '500' }}>Curso Mais Concluído</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.text, flex: 1, textAlign: 'right', marginLeft: 12 }} numberOfLines={2}>{stats.mostCompletedCourse || '—'}</Text>
                </View>
              </View>
            </SectionCard>

            {stats.topUser && (
              <SectionCard>
                <Text style={s.sectionLabel}>TOP USUÁRIO</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 999, backgroundColor: 'rgba(249,199,79,0.12)', borderWidth: 1, borderColor: 'rgba(249,199,79,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22 }}>🏆</Text>
                  </View>
                  <View style={{ gap: 3, flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: C.text }}>{stats.topUser.name}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>Nível {stats.topUser.level} · {stats.topUser.xp} XP</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(249,199,79,0.12)', borderWidth: 1, borderColor: 'rgba(249,199,79,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: C.warn }}>#{1}</Text>
                  </View>
                </View>
              </SectionCard>
            )}
          </>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────

type Screen =
  | 'perfil' | 'editar' | 'historico' | 'configuracoes'
  | 'alterar-senha' | 'deletar-conta'
  | 'central-ajuda' | 'termos' | 'estatisticas';

export default function ProfileNavigator() {
  const router = useRouter();
  const { logout } = useAuth();
  const [screen, setScreen] = useState<Screen>('perfil');

  const navigate = (s: string) => setScreen(s as Screen);

  async function handleSignOut() {
    await logout();
    router.replace('/login');
  }

  return (
    <View style={{ flex: 1 }}>
      {screen === 'perfil'         && <TelaPerfil onNavigate={navigate} onSignOut={handleSignOut} />}
      {screen === 'editar'         && <TelaEditarPerfil onNavigate={navigate} />}
      {screen === 'historico'      && <TelaHistorico onNavigate={navigate} />}
      {screen === 'configuracoes'  && <TelaConfiguracoes onNavigate={navigate} onSignOut={handleSignOut} />}
      {screen === 'alterar-senha'  && <TelaAlterarSenha onNavigate={navigate} />}
      {screen === 'deletar-conta'  && <TelaDeletarConta onNavigate={navigate} />}
      {screen === 'central-ajuda'  && <TelaCentralAjuda onNavigate={navigate} />}
      {screen === 'termos'         && <TelaTermos onNavigate={navigate} />}
      {screen === 'estatisticas'   && <TelaEstatisticas onNavigate={navigate} />}

      <View style={navStyles.bottomNav}>
        <TouchableOpacity style={navStyles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
          <Text style={navStyles.navIcon}>🏠</Text>
          <Text style={navStyles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.navItem} activeOpacity={0.7} onPress={() => router.push('/courses')}>
          <Text style={navStyles.navIcon}>📚</Text>
          <Text style={navStyles.navLabel}>Cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.navItem} activeOpacity={0.7} onPress={() => router.push('/ranking')}>
          <Text style={navStyles.navIcon}>🏅</Text>
          <Text style={navStyles.navLabel}>Ranking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.navItem} activeOpacity={0.7}>
          <Text style={navStyles.navIconActive}>👤</Text>
          <Text style={navStyles.navLabelActive}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const navStyles = StyleSheet.create({
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
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 20, opacity: 0.4 },
  navIconActive: { fontSize: 20 },
  navLabel: { fontSize: 10, color: '#3a5a6a', fontWeight: '600' },
  navLabelActive: { fontSize: 10, color: '#43e97b', fontWeight: '700' },
});

// ─── Shared Styles ────────────────────────────────────────────────────────────

const sh = StyleSheet.create({
  badge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'center',
  },
  badgeText: {
    color: C.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: C.text,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: 12,
    color: C.accent,
    fontWeight: '600',
  },
  rowChevron: {
    fontSize: 20,
    color: C.muted,
    lineHeight: 22,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
  },
  statLabel: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 110,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.text,
    letterSpacing: 0.5,
  },
  backBtn: {
    fontSize: 16,
    color: C.accent,
    fontWeight: '600',
    width: 60,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  glowRing: {
    width: 110,
    height: 110,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.accentBorder2,
    backgroundColor: 'rgba(67,233,123,0.04)',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 999,
    backgroundColor: '#0d2137',
    borderWidth: 2,
    borderColor: C.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: C.accent,
  },
  levelBadge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: C.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
  profileEmail: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '500',
  },
  rankChip: {
    backgroundColor: 'rgba(249,199,79,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249,199,79,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rankChipText: {
    fontSize: 12,
    color: C.warn,
    fontWeight: '600',
  },

  // XP Bar
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpLabel: {
    fontSize: 12,
    color: C.muted,
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 12,
    color: C.accent,
    fontWeight: '700',
  },
  xpBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  xpHint: {
    fontSize: 11,
    color: C.muted,
    marginTop: 6,
    textAlign: 'right',
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
  },
  statLabel: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
    fontWeight: '500',
  },

  // Achievements
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 2,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    minWidth: (width - 80) / 4 - 8,
    flex: 1,
  },
  achievementLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Actions
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.bg,
    letterSpacing: 1,
  },
  dangerButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.dangerBorder,
    backgroundColor: C.dangerDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.danger,
    letterSpacing: 1,
  },

  // Form
  fieldGroup: {
    gap: 6,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.cardBorder,
    backgroundColor: C.card,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: C.accentDim,
    borderColor: C.accentBorder,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted,
  },
  filterBtnTextActive: {
    color: C.accent,
  },

  // History card
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 14,
    padding: 14,
    width: '100%',
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 11,
    color: 'rgba(90,122,138,0.7)',
  },
  historyXp: {
    fontSize: 13,
    fontWeight: '800',
    color: C.accent,
  },
  correctBadge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.accent,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  toggleSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 1,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackOn: {
    backgroundColor: C.accent,
  },
  toggleTrackOff: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  // Version
  versionRow: {
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
});