import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f17" />

      {/* Header label */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Onboarding</Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBackground}>
          {/* Substitua por sua imagem real: <Image source={require('../assets/mascot.png')} ... /> */}
          <Image source={require('@/assets/images/icon_duolingotech.png')} style={{ width: 180, height: 180 }} resizeMode="contain" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Domine a Tecnologia{'\n'}de um Jeito Divertido.
        </Text>

        <Text style={styles.description}>
          Aprenda React Native e AWS através de desafios gamificados e projetos do mundo real.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>COMEÇAR A APRENDER</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.secondaryLink}>Já tenho uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    alignSelf: 'flex-start',
    marginTop: 56,
    marginBottom: 32,
  },
  headerLabel: {
    fontSize: 13,
    color: '#666677',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  illustrationBackground: {
    width: 200,
    height: 200,
    borderRadius: 24,
    backgroundColor: '#1a2a3a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#888899',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.2,
  },
  secondaryLink: {
    fontSize: 14,
    color: '#888899',
    fontWeight: '500',
  },
});