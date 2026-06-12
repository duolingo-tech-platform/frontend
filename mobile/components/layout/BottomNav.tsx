import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

export type ActiveTab = 'home' | 'courses' | 'ranking' | 'profile';

const TABS: { key: ActiveTab; icon: string; label: string; route: string }[] = [
  { key: 'home',    icon: '🏠', label: 'Home',    route: '/home' },
  { key: 'courses', icon: '📚', label: 'Cursos',  route: '/courses' },
  { key: 'ranking', icon: '🏅', label: 'Ranking', route: '/ranking' },
  { key: 'profile', icon: '👤', label: 'Perfil',  route: '/profilescreens' },
];

export function BottomNav({ activeTab }: { activeTab: ActiveTab }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={isActive ? undefined : () => router.push(tab.route as any)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
    opacity: 0.4,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: Colors.mutedDark,
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
