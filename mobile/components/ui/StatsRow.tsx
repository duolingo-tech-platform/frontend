import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export interface StatItem {
  icon?: string;
  value: string;
  valueColor?: string;
  label: string;
}

export function StatsRow({ items }: { items: [StatItem, StatItem, StatItem] }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.group}>
          {index > 0 && <View style={styles.divider} />}
          <View style={styles.item}>
            {item.icon ? <Text style={styles.icon}>{item.icon}</Text> : null}
            <Text style={[styles.value, item.valueColor ? { color: item.valueColor } : null]}>
              {item.value}
            </Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  group: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.cardBorder,
    marginRight: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  label: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '500',
  },
});
