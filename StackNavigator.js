import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';

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
        backgroundColor: bgColor
      },




    }
  }




export default function StackNavigator() {


    return (
            <Text>bbbbbbaaaaaaaaaaaaaaaaaaa</Text>
    )

}
