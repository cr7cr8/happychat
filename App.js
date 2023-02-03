//eas build --profile production --platform android
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ContextProvider from './ContextProvider';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./StackNavigator";


import SnackBar from './SnackBar';
import OverLayText from './OverLayText';

export default function App() { return (<AppStarter />); }



function AppStarter() {

  return (
    <>
    
      <ContextProvider>
      
        <NavigationContainer  >

          <StackNavigator />
          <SnackBar />
          <OverLayText />
        </NavigationContainer>
      </ContextProvider>
    </>
  )


}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
