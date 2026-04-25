import { useColorScheme } from 'react-native';

// Exemplo simples: retorna a cor baseada no tema
export function useThemeColor(
  _props: any,
  colorName: 'background' | 'text' = 'background'
) {
  const scheme = useColorScheme() ?? 'light';
  const colors = {
    light: {
      background: '#fff',
      text: '#000',
    },
    dark: {
      background: '#000',
      text: '#fff',
    },
  };
  return colors[scheme][colorName];
}
