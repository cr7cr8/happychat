import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';


import { getStatusBarHeight } from 'react-native-status-bar-height';

import { HomeScreen } from './HomeScreen';





const Stack = createSharedElementStackNavigator()
const screenOptions = function ({ navigation, route }) {

  return {
    headerShown: true, //not supported in Android  //route.name!=="Chat",//true,//route.name==="Home",//true,
    gestureEnabled: true,
    gestureDirection: "horizontal",
    headerTitleAlign: 'center',
    ...TransitionPresets.SlideFromRightIOS,
    //title: getFocusedRouteNameFromRoute(route) || "People",
    //header:function (props) {
    //  console.log("=====***==============")
    //  console.log(props)
    //},


    headerStyle: {
      height: getStatusBarHeight() > 24 ? 70 : 60,
      elevation: 1,
      // backgroundColor: bgColor
    },




  }
}




export default function StackNavigator() {

  const navigation = useNavigation()


  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={screenOptions}
      // headerMode="float"
      headerMode="screen"
    >


      <Stack.Screen name="Home"

        component={HomeScreen}

        // header={function (props) {     console.log(props)  return <Header {...props} /> }}

        options={function ({ navigation, route }) {

          return {
            headerShown: true,
            gestureEnabled: false,

            header: (props) => <Header {...props} />,

            headerLeft: () => null,
            headerRight: () => (
              <Button
                title={"Home"}
                onPress={function () {

                }}
              />
            ),

            // color:"#fff", 


          }

        }}

      />


      <Stack.Screen name="Chat"

        component={function ({ navigation }) {

          return <Button title="go to home"
            onPress={function () {

              navigation.navigate('Home')

            }}




          />
        }}

        // header={function (props) {     console.log(props)  return <Header {...props} /> }}

        options={function ({ navigation, route }) {

          return {
            headerShown: true,
            gestureEnabled: false,
            headerTintColor: 'orange',
            header: (props) => <Header {...props} />,

            //   headerLeft: () => null,
            headerRight: () => (
              <Button
                title={"Home"}
              />
            ),




          }

        }}

      />



    </Stack.Navigator>
  )

}
