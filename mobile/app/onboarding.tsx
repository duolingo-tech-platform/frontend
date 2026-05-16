import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#010d19', '#021a2e', '#010d19']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#010d19" />

        {/* Badge superior */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🚀 Versão Beta Gratuita</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          {/* Anel externo de brilho */}
          <View style={styles.glowRing}>
            <View style={styles.illustrationBackground}>
              <Image
                source={require('@/assets/images/icon_duolingotech.png')}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Chips flutuantes */}
          <View style={[styles.chip, styles.chipLeft]}>
            <Text style={styles.chipText}>⚡ React Native</Text>
          </View>
          <View style={[styles.chip, styles.chipRight]}>
            <Text style={styles.chipText}>☁️ AWS</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.eyebrow}>APRENDA NA PRÁTICA</Text>
          <Text style={styles.title}>
            Domine a{'\n'}
            <Text style={styles.titleHighlight}>Tecnologia</Text>
            {'\n'}do Futuro.
          </Text>
          <Text style={styles.description}>
            Desafios gamificados, projetos reais e uma comunidade que cresce junto com você.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12k+</Text>
            <Text style={styles.statLabel}>Alunos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfação</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>40+</Text>
            <Text style={styles.statLabel}>Módulos</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.85} style={{ width: '100%' }}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>COMEÇAR AGORA — É GRÁTIS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.secondaryButton}>
            <Text style={styles.secondaryLink}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 28,
  },

  // Badge
  badge: {
    backgroundColor: 'rgba(67, 233, 123, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#43e97b',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Illustration
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    width: 220,
    height: 220,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.15)',
    backgroundColor: 'rgba(67, 233, 123, 0.04)',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  illustrationBackground: {
    width: 180,
    height: 180,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  chip: {
    position: 'absolute',
    backgroundColor: '#0d2137',
    borderWidth: 1,
    borderColor: 'rgba(67, 233, 123, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipLeft: {
    left: -20,
    bottom: 20,
  },
  chipRight: {
    right: -10,
    top: 20,
  },
  chipText: {
    color: '#43e97b',
    fontSize: 11,
    fontWeight: '600',
  },

  // Content
  content: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#43e97b',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 12,
  },
  titleHighlight: {
    color: '#43e97b',
  },
  description: {
    fontSize: 15,
    color: '#5a7a8a',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    paddingVertical: 16,
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
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#5a7a8a',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Actions
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#010d19',
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryLink: {
    fontSize: 14,
    color: '#5a7a8a',
    fontWeight: '500',
  },
});