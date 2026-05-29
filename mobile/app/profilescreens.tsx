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
import { Stack, useRouter } from 'expo-router';
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

export function TelaPerfil({ onNavigate, onSignOut }: { onNavigate: (screen: string) => void; onSignOut: () => void }) {
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
          <RowItem icon="🚪" label="Sair da Conta" danger onPress={onSignOut} />
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

export function TelaConfiguracoes({ onNavigate, onSignOut }: { onNavigate: (screen: string) => void; onSignOut: () => void }) {
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
          <RowItem icon="🔑" label="Alterar Senha" onPress={() => onNavigate('alterar-senha')} />
          <View style={sh.separator} />
          <RowItem icon="🗑️" label="Deletar Conta" danger onPress={() => onNavigate('deletar-conta')} />
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
          <RowItem icon="❓" label="Central de Ajuda" onPress={() => onNavigate('central-ajuda')} />
          <View style={sh.separator} />
          <RowItem icon="📩" label="Fale Conosco" onPress={() => onNavigate('contato')} />
          <View style={sh.separator} />
          <RowItem icon="⭐" label="Avalie o App" onPress={() => onNavigate('avaliar')} />
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

  const novaStrength = nova.length === 0 ? null : nova.length < 6 ? 'fraca' : nova.length < 10 ? 'média' : 'forte';
  const strengthColor = novaStrength === 'fraca' ? '#ff4d4d' : novaStrength === 'média' ? '#ffaa00' : '#43e97b';
  const strengthWidth = novaStrength === 'fraca' ? '33%' : novaStrength === 'média' ? '66%' : '100%';

  function PasswordField({ label, value, onChange, show, onToggle }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void;
  }) {
    return (
      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>{label}</Text>
        <View style={[s.input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, height: 48 }]}>
          <TextInput
            style={{ flex: 1, color: C.text, fontSize: 14 }}
            value={value}
            onChangeText={onChange}
            secureTextEntry={!show}
            placeholderTextColor={C.muted}
            placeholder="••••••••"
            selectionColor={C.accent}
          />
          <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={{ padding: 8 }}>
            <Text style={{ fontSize: 16 }}>{show ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <Text style={s.headerTitle}>Alterar Senha</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={[sh.card, { width: '100%' }]}>
          <Text style={s.sectionLabel}>SEGURANÇA</Text>
          <PasswordField label="SENHA ATUAL" value={atual} onChange={setAtual} show={showAtual} onToggle={() => setShowAtual(v => !v)} />
          <PasswordField label="NOVA SENHA" value={nova} onChange={setNova} show={showNova} onToggle={() => setShowNova(v => !v)} />
          {nova.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: strengthWidth as any, backgroundColor: strengthColor, borderRadius: 999 }} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: strengthColor }}>Senha {novaStrength}</Text>
            </View>
          )}
          <PasswordField label="CONFIRMAR NOVA SENHA" value={confirma} onChange={setConfirma} show={showConfirma} onToggle={() => setShowConfirma(v => !v)} />
          {confirma.length > 0 && confirma !== nova && (
            <Text style={{ fontSize: 12, color: C.danger, marginTop: -8, marginBottom: 4 }}>Senhas não coincidem</Text>
          )}
        </View>

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ width: '100%' }}
            onPress={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          >
            <LinearGradient
              colors={saved ? ['#38f9d7', '#43e97b'] : ['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.primaryButton}
            >
              <Text style={s.primaryButtonText}>{saved ? '✓ SENHA ATUALIZADA' : 'SALVAR NOVA SENHA'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 6: 2FA ─────────────────────────────────────────────────────────────

export function TelaDoisFA({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [enabled, setEnabled] = useState(true);
  const backupCodes = ['A3F-7KP', 'B9X-2MN', 'C5T-8QR', 'D1Y-4VW', 'E6Z-3LH'];

  return (
    <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('configuracoes')}>
            <Text style={s.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>2FA</Text>
          <View style={{ width: 60 }} />
        </View>

        <SectionCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 }}>Autenticação em 2 Fatores</Text>
              <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>
                Adiciona uma camada extra de segurança à sua conta.
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: C.cardBorder, true: C.accentBorder }}
              thumbColor={enabled ? C.accent : C.muted}
              ios_backgroundColor={C.card}
            />
          </View>
        </SectionCard>

        {enabled && (
          <>
            <View style={[sh.card, { width: '100%', alignItems: 'center', gap: 12 }]}>
              <Text style={s.sectionLabel}>QR CODE</Text>
              <View style={{ width: 160, height: 160, backgroundColor: '#ffffff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 48 }}>📱</Text>
                <Text style={{ fontSize: 10, color: '#010d19', fontWeight: '600', marginTop: 8 }}>Escaneie no app</Text>
              </View>
              <Text style={{ fontSize: 12, color: C.muted, textAlign: 'center', lineHeight: 18 }}>
                Use Google Authenticator ou Authy para escanear o QR Code
              </Text>
            </View>

            <View style={[sh.card, { width: '100%' }]}>
              <Text style={s.sectionLabel}>CÓDIGOS DE BACKUP</Text>
              <Text style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 18 }}>
                Guarde estes códigos em local seguro. Cada um pode ser usado uma vez.
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {backupCodes.map(code => (
                  <View key={code} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: C.cardBorder, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.accent, letterSpacing: 1 }}>{code}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 7: Deletar Conta ────────────────────────────────────────────────────

export function TelaDeletarConta({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState('');
  const canDelete = confirm === 'DELETAR';

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

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={canDelete ? 0.85 : 1}
            style={[s.dangerButton, !canDelete && { opacity: 0.4 }]}
            onPress={canDelete ? () => router.replace('/login') : undefined}
          >
            <Text style={s.dangerButtonText}>🗑️ DELETAR MINHA CONTA</Text>
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

        <View style={[sh.card, { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <Text style={{ fontSize: 28 }}>💬</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 }}>Não encontrou sua resposta?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate('contato')}>
              <Text style={{ fontSize: 13, color: C.accent, fontWeight: '600' }}>Fale com a gente →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 9: Fale Conosco ─────────────────────────────────────────────────────

const SUBJECTS = ['Dúvida técnica', 'Problema no app', 'Sugestão de melhoria', 'Conteúdo incorreto', 'Outro'];

export function TelaContato({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [subject, setSubject] = useState(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 64 }}>✅</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>Mensagem enviada!</Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 22 }}>
            Recebemos sua mensagem e retornaremos em até 48 horas no seu e-mail cadastrado.
          </Text>
          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={() => onNavigate('configuracoes')}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryButton}>
              <Text style={s.primaryButtonText}>VOLTAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
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
          <Text style={s.headerTitle}>Fale Conosco</Text>
          <View style={{ width: 60 }} />
        </View>

        <SectionCard>
          <Text style={s.sectionLabel}>ASSUNTO</Text>
          <View style={{ gap: 6 }}>
            {SUBJECTS.map((sub, i) => (
              <TouchableOpacity
                key={sub}
                activeOpacity={0.7}
                onPress={() => setSubject(i)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}
              >
                <View style={{ width: 18, height: 18, borderRadius: 999, borderWidth: 2, borderColor: subject === i ? C.accent : C.muted, backgroundColor: subject === i ? C.accentDim : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {subject === i && <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: C.accent }} />}
                </View>
                <Text style={{ fontSize: 13, color: subject === i ? C.text : C.muted, fontWeight: subject === i ? '600' : '400' }}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <View style={[sh.card, { width: '100%' }]}>
          <Text style={s.sectionLabel}>MENSAGEM</Text>
          <TextInput
            style={[s.input, s.inputMultiline, { minHeight: 120 }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Descreva seu problema ou sugestão..."
            placeholderTextColor={C.muted}
            multiline
            textAlignVertical="top"
            selectionColor={C.accent}
          />
          <Text style={{ fontSize: 11, color: C.muted, textAlign: 'right', marginTop: 6 }}>{message.length}/500</Text>
        </View>

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={message.length > 10 ? 0.85 : 1}
            style={{ width: '100%', opacity: message.length > 10 ? 1 : 0.4 }}
            onPress={message.length > 10 ? () => setSent(true) : undefined}
          >
            <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryButton}>
              <Text style={s.primaryButtonText}>📩 ENVIAR MENSAGEM</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 10: Avalie o App ────────────────────────────────────────────────────

export function TelaAvaliar({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <LinearGradient colors={[C.bg, C.bg2, C.bg]} style={s.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>Obrigado!</Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 22 }}>
            Sua avaliação nos ajuda a melhorar a plataforma para todos os alunos.
          </Text>
          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }} onPress={() => onNavigate('configuracoes')}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryButton}>
              <Text style={s.primaryButtonText}>VOLTAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
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
          <Text style={s.headerTitle}>Avalie o App</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
          <Text style={{ fontSize: 48 }}>⭐</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.text }}>O que você acha da plataforma?</Text>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>Sua opinião nos ajuda a melhorar</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setStars(n)} activeOpacity={0.7}>
              <Text style={{ fontSize: 40, opacity: n <= stars ? 1 : 0.25 }}>⭐</Text>
            </TouchableOpacity>
          ))}
        </View>

        {stars > 0 && (
          <Text style={{ fontSize: 14, color: C.accent, fontWeight: '700', textAlign: 'center' }}>
            {stars === 1 ? 'Muito ruim 😢' : stars === 2 ? 'Ruim 😕' : stars === 3 ? 'Regular 😐' : stars === 4 ? 'Bom! 😊' : 'Excelente! 🚀'}
          </Text>
        )}

        <View style={[sh.card, { width: '100%' }]}>
          <Text style={s.sectionLabel}>COMENTÁRIO (OPCIONAL)</Text>
          <TextInput
            style={[s.input, s.inputMultiline]}
            value={comment}
            onChangeText={setComment}
            placeholder="Conte o que pode melhorar..."
            placeholderTextColor={C.muted}
            multiline
            textAlignVertical="top"
            selectionColor={C.accent}
          />
        </View>

        <View style={s.actions}>
          <TouchableOpacity
            activeOpacity={stars > 0 ? 0.85 : 1}
            style={{ width: '100%', opacity: stars > 0 ? 1 : 0.4 }}
            onPress={stars > 0 ? () => setSubmitted(true) : undefined}
          >
            <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryButton}>
              <Text style={s.primaryButtonText}>ENVIAR AVALIAÇÃO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── TELA 11: Termos de Uso ───────────────────────────────────────────────────

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

// ─── Root Navigator ───────────────────────────────────────────────────────────

type Screen =
  | 'perfil' | 'editar' | 'historico' | 'configuracoes'
  | 'alterar-senha' | 'deletar-conta'
  | 'central-ajuda' | 'contato' | 'avaliar' | 'termos';

export default function ProfileNavigator() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('perfil');

  const navigate = (s: string) => setScreen(s as Screen);

  return (
    <View style={{ flex: 1 }}>
      {screen === 'perfil'         && <TelaPerfil onNavigate={navigate} onSignOut={() => router.replace('/login')} />}
      {screen === 'editar'         && <TelaEditarPerfil onNavigate={navigate} />}
      {screen === 'historico'      && <TelaHistorico onNavigate={navigate} />}
      {screen === 'configuracoes'  && <TelaConfiguracoes onNavigate={navigate} onSignOut={() => router.replace('/login')} />}
      {screen === 'alterar-senha'  && <TelaAlterarSenha onNavigate={navigate} />}
      {screen === 'deletar-conta'  && <TelaDeletarConta onNavigate={navigate} />}
      {screen === 'central-ajuda'  && <TelaCentralAjuda onNavigate={navigate} />}
      {screen === 'contato'        && <TelaContato onNavigate={navigate} />}
      {screen === 'avaliar'        && <TelaAvaliar onNavigate={navigate} />}
      {screen === 'termos'         && <TelaTermos onNavigate={navigate} />}

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