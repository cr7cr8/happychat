import React, { useState, useEffect, useRef, useContext, useTransition } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useNavigation, useRoute } from '@react-navigation/native';


import { getStatusBarHeight } from 'react-native-status-bar-height';

import { RegScreen } from './RegScreen';
import { HomeScreen } from './HomeScreen';
import { ChatScreen } from './ChatScreen';
import { ImageScreen } from './ImageScreen';

import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import multiavatar from '@multiavatar/multiavatar';
import SvgUri from 'react-native-svg-uri';
import { SharedElement } from 'react-navigation-shared-element';
import SnackBar from './SnackBar';

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


    // headerStyle: {
    //   height: getStatusBarHeight() > 24 ? 70 : 60,
    //   elevation: 1,
    //   // backgroundColor: bgColor
    // },




  }
}




export default function StackNavigator() {

  const navigation = useNavigation()
  const [isTransitionPending, startTrasition] = useTransition()

  return (
    <>

      <Stack.Navigator
        initialRouteName={"RegScreen"}
        screenOptions={screenOptions}
        // headerMode="float"
        headerMode="screen"
      >

        <Stack.Screen name="RegScreen"
          component={RegScreen}

          options={function ({ navigation, router }) {

            return {
              headerShown: false,
            }

          }}
        />

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
                //height: 60,
                elevation: 0,
                backgroundColor: "wheat"
              },
              headerRight: () => (
                <Button
                  title={"reg"}
                  onPress={function () {


                  //  navigation.navigate("RegScreen", { name: "chen" })

                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'RegScreen',
                     //   params: { name: userName, fromRegScreen: true },
                      },
                    ],
                  })


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
                //height: 60,
                elevation: 0,
                //backgroundColor: bgColor
                // backgroundColor:"transparent"
                backgroundColor: "rgba(0,0,255 ,0)",
              },
              headerTitle: function (props) { return <></> },
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
              // header: (props) => <Header {...props} />,
              header: (props) => <></>,
              headerTitle: function (props) { return <></> },
              headerStyle: {
                height: getStatusBarHeight() > 24 ? 70 : 60,
                elevation: 0,
                //backgroundColor: "lightgreen",
                backgroundColor: "#333",

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
    </>
  )

}

