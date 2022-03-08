import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import LoginPage from './components/Loginpage';
import { IP_ADD, PROD_URL } from '@env';

export default function App() {
  const [URL, setURL] = useState('')

  useEffect(() => {
    __DEV__ ? setURL(IP_ADD) : setURL(PROD_URL);
  }, [URL])  

  return (
    <View style={styles.container}>
      <LoginPage URL={URL}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
