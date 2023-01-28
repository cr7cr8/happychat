import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useNavigation, useRoute } from '@react-navigation/native';


import { getStatusBarHeight } from 'react-native-status-bar-height';

import { HomeScreen } from './HomeScreen';
import { ChatScreen,ChatScreenHeaderTitle } from './ChatScreen';
import { ImageScreen } from './ImageScreen';

import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import multiavatar from '@multiavatar/multiavatar';
import SvgUri from 'react-native-svg-uri';
import { SharedElement } from 'react-navigation-shared-element';


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
      initialRouteName={"HomeScreen"}
      screenOptions={screenOptions}
      // headerMode="float"
      headerMode="screen"
    >


      <Stack.Screen name="HomeScreen"

        component={HomeScreen}

        // header={function (props) {     console.log(props)  return <Header {...props} /> }}

        options={function ({ navigation, route }) {

          return {
            headerShown: true,
            gestureEnabled: false,

            header: (props) => <Header {...props} />,

            headerLeft: () => null,
            headerStyle: {
              height: getStatusBarHeight() > 24 ? 70 : 60,
              elevation: 0,
              backgroundColor: "tomato"
            },
            headerRight: () => (
              <Button
                title={"Home"}
                onPress={function () {
                  navigation.navigate("ChatScreen")
                }}
              />
            ),

            // color:"#fff",   


          }

        }}

      />


      <Stack.Screen name="ChatScreen"

        component={ChatScreen}

        // header={function (props) {     console.log(props)  return <Header {...props} /> }}

        options={function ({ navigation, route }) {
          const name = route.params.item
          const avatarString = multiavatar(name)
          const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


          return {
            headerShown: true,
            gestureEnabled: false,
            //     headerTintColor: 'orange',
            header: (props) => <Header {...props} />,

            //   headerLeft: () => null,
            headerStyle: {
              height: getStatusBarHeight() > 24 ? 70 : 60,
              elevation: 0,
              //backgroundColor: bgColor
             // backgroundColor:"transparent"
             backgroundColor:"rgba(0,0,255 ,0)",
            },
            headerTitle: ChatScreenHeaderTitle
            // headerRight: () => (
            //   <Button
            //     title={"Chat"}
            //     onPress={function () {
            //       navigation.navigate("HomeScreen")
            //     }}
            //   />
            // ),

          }

        }}

      />
      <Stack.Screen name="ImageScreen"
        component={ImageScreen}
        options={function ({ navigation, route }) {
          return {
            headerShown: true,
            gestureEnabled: false,
            header: (props) => <Header {...props} />,
            headerTitle: function (props) { return <></> },
            headerStyle: {
              height: getStatusBarHeight() > 24 ? 70 : 60,
              elevation: 0,
              backgroundColor: "lightgreen"
            },
            // headerRight: () => (
            //   <Button
            //     title={"Image"}
            //     onPress={function () {
            //       navigation.navigate("ChatScreen")
            //     }}
            //   />
            // ),

          }
        }

        }

      />


    </Stack.Navigator>
  )

}

