import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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

// ─── TELA 1: Perfil ──────────────────────────────────────────────────────────

export function TelaPerfil({ onNavigate }: { onNavigate: (screen: string) => void }) {
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
              <Text style={s.avatarText}>JP</Text>
            </View>
          </View>
          <View style={[s.levelBadge]}>
            <Text style={s.levelBadgeText}>⚡ Nível 12</Text>
          </View>
          <Text style={s.profileName}>João Pedro</Text>
          <Text style={s.profileEmail}>joao@email.com</Text>
          <View style={s.rankChip}>
            <Text style={s.rankChipText}>🏆 Top 8% da semana</Text>
          </View>
        </View>

        {/* XP Bar */}
        <SectionCard>
          <View style={s.xpRow}>
            <Text style={s.xpLabel}>Progresso — Nível 12</Text>
            <Text style={s.xpValue}>2.340 / 3.000 XP</Text>
          </View>
          <View style={s.xpBarBg}>
            <LinearGradient
              colors={[C.accent, '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.xpBarFill, { width: '78%' }]}
            />
          </View>
          <Text style={s.xpHint}>660 XP para o nível 13</Text>
        </SectionCard>

        {/* Stats */}
        <View style={s.statsRow}>
          <StatItem value="12k" label="XP Total" />
          <View style={sh.divider} />
          <StatItem value="38" label="Módulos" />
          <View style={sh.divider} />
          <StatItem value="🔥 14" label="Sequência" />
        </View>

        {/* Conquistas */}
        <SectionCard>
          <Text style={s.sectionLabel}>🏅 CONQUISTAS RECENTES</Text>
          <View style={s.badgesRow}>
            {[
              { icon: '⚡', name: 'Speed Run' },
              { icon: '🎯', name: '100% Acerto' },
              { icon: '🔥', name: '7 Dias Seguidos' },
              { icon: '🚀', name: 'First Steps' },
            ].map((b) => (
              <View key={b.name} style={s.achievementChip}>
                <Text style={{ fontSize: 18 }}>{b.icon}</Text>
                <Text style={s.achievementLabel}>{b.name}</Text>
              </View>
            ))}
          </View>
        </SectionCard>

        {/* Quick nav */}
        <SectionCard>
          <RowItem icon="📖" label="Histórico de Atividades" onPress={() => onNavigate('historico')} />
          <View style={sh.separator} />
          <RowItem icon="⚙️" label="Configurações" onPress={() => onNavigate('configuracoes')} />
          <View style={sh.separator} />
          <RowItem icon="🚪" label="Sair da Conta" danger onPress={() => {}} />
        </SectionCard>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 2: Editar Perfil ────────────────────────────────────────────────────

export function TelaEditarPerfil({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [nome, setNome] = useState('João Pedro');
  const [email, setEmail] = useState('joao@email.com');
  const [bio, setBio] = useState('Desenvolvedor apaixonado por React Native e AWS.');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

        {/* Avatar edit */}
        <View style={s.avatarSection}>
          <View style={s.glowRing}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>JP</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={sh.badge}>
            <Text style={sh.badgeText}>📷 Alterar foto</Text>
          </TouchableOpacity>
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
          <RowItem icon="🔑" label="Alterar senha" onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="📱" label="Autenticação em 2 fatores" value="Ativo" accent onPress={() => {}} />
        </SectionCard>

        <View style={s.actions}>
          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={handleSave}>
            <LinearGradient
              colors={saved ? ['#38f9d7', '#43e97b'] : ['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.primaryButton}
            >
              <Text style={s.primaryButtonText}>
                {saved ? '✓ SALVO COM SUCESSO' : 'SALVAR ALTERAÇÕES'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 3: Histórico ───────────────────────────────────────────────────────

type HistoricoItem = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  xp: string;
  time: string;
  correct?: boolean;
};

const HISTORICO_DATA: HistoricoItem[] = [
  { id: '1', icon: '⚡', title: 'React Native — Módulo 4', subtitle: 'Virtual DOM · Verdadeiro/Falso', xp: '+20 XP', time: 'Hoje, 14h22', correct: true },
  { id: '2', icon: '💻', title: 'AWS — Módulo 2', subtitle: 'Lambda · Completar Código', xp: '+30 XP', time: 'Hoje, 13h10', correct: true },
  { id: '3', icon: '🎯', title: 'React Native — Módulo 3', subtitle: 'Hooks · Múltipla Escolha', xp: '+10 XP', time: 'Ontem, 20h05', correct: false },
  { id: '4', icon: '☁️', title: 'AWS — Módulo 1', subtitle: 'S3 · Múltipla Escolha', xp: '+30 XP', time: 'Ontem, 19h33', correct: true },
  { id: '5', icon: '⚡', title: 'React Native — Módulo 2', subtitle: 'Components · Completar Código', xp: '+30 XP', time: '22 Mai, 11h00', correct: true },
  { id: '6', icon: '🎯', title: 'React Native — Módulo 1', subtitle: 'JSX · Múltipla Escolha', xp: '+20 XP', time: '21 Mai, 09h15', correct: true },
];

export function TelaHistorico({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [filter, setFilter] = useState<'todos' | 'acerto' | 'erro'>('todos');

  const filtered = HISTORICO_DATA.filter((i) => {
    if (filter === 'acerto') return i.correct;
    if (filter === 'erro') return !i.correct;
    return true;
  });

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'acerto', label: '✓ Acertos' },
    { key: 'erro', label: '✗ Erros' },
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

        {/* Summary */}
        <View style={s.statsRow}>
          <StatItem value={String(HISTORICO_DATA.length)} label="Total" />
          <View style={sh.divider} />
          <StatItem value={String(HISTORICO_DATA.filter((i) => i.correct).length)} label="Acertos" />
          <View style={sh.divider} />
          <StatItem value="83%" label="Taxa" />
        </View>

        {/* Filters */}
        <View style={s.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.7}
              onPress={() => setFilter(f.key)}
              style={[
                s.filterBtn,
                filter === f.key && s.filterBtnActive,
              ]}
            >
              <Text style={[s.filterBtnText, filter === f.key && s.filterBtnTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <View style={{ gap: 10 }}>
          {filtered.map((item) => (
            <View key={item.id} style={s.historyCard}>
              <View
                style={[
                  s.historyIcon,
                  item.correct
                    ? { backgroundColor: C.accentDim, borderColor: C.accentBorder }
                    : { backgroundColor: C.dangerDim, borderColor: C.dangerBorder },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.historyTitle}>{item.title}</Text>
                <Text style={s.historySubtitle}>{item.subtitle}</Text>
                <Text style={s.historyTime}>{item.time}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text
                  style={[
                    s.historyXp,
                    !item.correct && { color: C.danger },
                  ]}
                >
                  {item.xp}
                </Text>
                <View
                  style={[
                    s.correctBadge,
                    !item.correct && { backgroundColor: C.dangerDim, borderColor: C.dangerBorder },
                  ]}
                >
                  <Text
                    style={[
                      s.correctBadgeText,
                      !item.correct && { color: C.danger },
                    ]}
                  >
                    {item.correct ? '✓' : '✗'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 4: Configurações ────────────────────────────────────────────────────

export function TelaConfiguracoes({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [haptic, setHaptic] = useState(false);

  type ToggleRowProps = {
    icon: string;
    label: string;
    sub: string;
    value: boolean;
    onChange: (v: boolean) => void;
  };

  function ToggleRow({ icon, label, sub, value, onChange }: ToggleRowProps) {
    return (
      <View style={s.toggleRow}>
        <View style={sh.rowLeft}>
          <View style={sh.rowIcon}>
            <Text style={{ fontSize: 16 }}>{icon}</Text>
          </View>
          <View>
            <Text style={s.toggleLabel}>{label}</Text>
            <Text style={s.toggleSub}>{sub}</Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: C.cardBorder, true: C.accentBorder }}
          thumbColor={value ? C.accent : C.muted}
          ios_backgroundColor={C.card}
        />
      </View>
    );
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
          <RowItem icon="🔑" label="Alterar Senha" onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="📱" label="2FA" value="Ativo" accent onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="🗑️" label="Deletar Conta" danger onPress={() => {}} />
        </SectionCard>

        {/* Notificações */}
        <SectionCard>
          <Text style={s.sectionLabel}>NOTIFICAÇÕES</Text>
          <ToggleRow
            icon="🔔"
            label="Notificações push"
            sub="Lembretes de estudo diário"
            value={notif}
            onChange={setNotif}
          />
          <View style={sh.separator} />
          <ToggleRow
            icon="🔊"
            label="Sons do app"
            sub="Efeitos de acerto e erro"
            value={sound}
            onChange={setSound}
          />
          <View style={sh.separator} />
          <ToggleRow
            icon="📳"
            label="Vibração (Haptic)"
            sub="Feedback tátil nas respostas"
            value={haptic}
            onChange={setHaptic}
          />
        </SectionCard>

        {/* Aparência */}
        <SectionCard>
          <Text style={s.sectionLabel}>APARÊNCIA</Text>
          <ToggleRow
            icon="🌙"
            label="Modo escuro"
            sub="Tema atual do aplicativo"
            value={darkMode}
            onChange={setDarkMode}
          />
        </SectionCard>

        {/* Suporte */}
        <SectionCard>
          <Text style={s.sectionLabel}>SUPORTE</Text>
          <RowItem icon="❓" label="Central de Ajuda" onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="📩" label="Fale Conosco" onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="⭐" label="Avalie o App" onPress={() => {}} />
          <View style={sh.separator} />
          <RowItem icon="📄" label="Termos de Uso" onPress={() => {}} />
        </SectionCard>

        <View style={s.versionRow}>
          <Badge label="🚀 Versão Beta Gratuita" />
          <Text style={s.versionText}>v0.9.1 · build 204</Text>
        </View>

        {/* Logout */}
        <View style={s.actions}>
          <TouchableOpacity activeOpacity={0.85} style={s.dangerButton}>
            <Text style={s.dangerButtonText}>🚪 SAIR DA CONTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────

type Screen = 'perfil' | 'editar' | 'historico' | 'configuracoes';

export default function ProfileNavigator() {
  const [screen, setScreen] = useState<Screen>('perfil');

  const navigate = (s: string) => setScreen(s as Screen);

  return (
    <>
      {screen === 'perfil' && <TelaPerfil onNavigate={navigate} />}
      {screen === 'editar' && <TelaEditarPerfil onNavigate={navigate} />}
      {screen === 'historico' && <TelaHistorico onNavigate={navigate} />}
      {screen === 'configuracoes' && <TelaConfiguracoes onNavigate={navigate} />}
    </>
  );
}

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
    paddingBottom: 40,
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