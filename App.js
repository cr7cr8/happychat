import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ContextProvider from './ContextProvider';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./StackNavigator";


export default function App() { return (<AppStarter />); }



function AppStarter() {

  return (
    <>
      <ContextProvider>
        <NavigationContainer  >
          <StackNavigator />
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
