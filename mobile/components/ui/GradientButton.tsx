import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  colors?: [string, string];
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function GradientButton({
  label,
  onPress,
  colors = [Colors.accent, Colors.accentCyan],
  style,
  labelStyle,
}: GradientButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, style]}
      >
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
});
