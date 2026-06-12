import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
  padding?: number;
}

export function Card({ children, style, accentColor, padding = 16 }: CardProps) {
  const accentStyle = accentColor
    ? { backgroundColor: accentColor + '0d', borderColor: accentColor + '33' }
    : undefined;

  return (
    <View style={[styles.card, { padding }, accentStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 18,
  },
});
