const fs = require('fs');
const path = require('path');

const root = process.cwd();

const dirsToCreate = ['app', 'components', 'constants', 'hooks'];
const filesToDelete = [];

// Move app/(tabs)/index.tsx to app/index.tsx if it exists
const tabsDir = path.join(root, 'app', '(tabs)');
if (fs.existsSync(tabsDir)) {
  fs.rmSync(tabsDir, { recursive: true, force: true });
}

// Create clean app/index.tsx
const appDir = path.join(root, 'app');
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

fs.writeFileSync(
  path.join(appDir, 'index.tsx'),
  `import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`
);

// Clean up extra directories
['components', 'constants', 'hooks'].forEach((dir) => {
  const dirPath = path.join(root, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`🗑️  /${dir} deleted`);
  }
});

console.log('✅ Project reset complete. Edit app/index.tsx to get started.');