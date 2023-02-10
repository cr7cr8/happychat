//eas build --profile production --platform android
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ContextProvider from './ContextProvider';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./StackNavigator";

import SnackBar from './SnackBar';
import OverLayText from './OverLayText';

import { createContext, useContextSelector } from 'use-context-selector';

import { Context } from "./ContextProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import jwtDecode from 'jwt-decode';
import defaultUrl, { createFolder } from "./config";

export default function App() {
  return (
    <ContextProvider><StatusBar /><AppStarter /></ContextProvider>
  );
}



function AppStarter() {


  const initialRouter = useContextSelector(Context, (state) => (state.initialRouter))
  const setInitialRouter = useContextSelector(Context, (state) => (state.setInitialRouter))
  const setUserName = useContextSelector(Context, (state) => (state.setUserName))
  const token = useContextSelector(Context, (state) => (state.token))
  const setToken = useContextSelector(Context, (state) => (state.setToken))

  const serverAddress = useContextSelector(Context, (state) => (state.serverAddress))
  const setServerAddress = useContextSelector(Context, (state) => (state.setServerAddress))

  //initialize userName , token and server address
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      token && setUserName(jwtDecode(token).userName)
      token && setToken(token)
      Boolean(token)
        ? setInitialRouter("HomeScreen")
        : setInitialRouter("RegScreen")
    })
    AsyncStorage.getItem("serverAddress").then((serverAddress) => {
      Boolean(serverAddress)
        ? setServerAddress(serverAddress)
        : AsyncStorage.setItem("serverAddress", defaultUrl, function () { setServerAddress(defaultUrl) })
    })
  }, [])

  //create folder for each contact once token and servre address is assigned
  useEffect(() => {
    if (serverAddress && token) {
      axios.get(`${serverAddress}/api/user/fetchuserlist2`, { headers: { "x-auth-token": token } }).then(response => {
        Array.from(response.data).forEach(item => {
          createFolder(item)
        })
      })
    }
  }, [serverAddress, token])





  return initialRouter && serverAddress
    ? <><NavigationContainer><StackNavigator /></NavigationContainer><SnackBar /></>
    : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text style={{ fontSize: 25 }}>Loading</Text></View>




}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
