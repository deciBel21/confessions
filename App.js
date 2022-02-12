import { StatusBar } from 'expo-status-bar';
import LoginPage from './components/Loginpage';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginPage />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});
