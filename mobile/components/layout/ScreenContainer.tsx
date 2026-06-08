import { StatusBar, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return (
    <LinearGradient
      colors={[Colors.bg, Colors.bgSecondary, Colors.bg]}
      style={[{ flex: 1 }, style]}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      {children}
    </LinearGradient>
  );
}
