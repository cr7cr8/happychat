import React, { useState, useRef, useEffect, useContext, useLayoutEffect, useTransition } from 'react';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight,
  TouchableWithoutFeedback, ImageBackground,

  PermissionsAndroid,
  Platform,
  Animated,
  Vibration
} from 'react-native';
import * as FileSystem from 'expo-file-system';


import ReAnimated, {
  useAnimatedStyle, useSharedValue, useDerivedValue,
  withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  withDelay,
  withSpring,
  useAnimatedScrollHandler,
  Extrapolate,
  //interpolateColors,

  useAnimatedProps,
  withSequence,
  withRepeat,
  withDecay,
  Keyframe,
  Transition,
  Layout,
  CurvedTransition,
  ZoomIn
} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, ScrollView: ScrollV, Image, createAnimatedComponent } = ReAnimated
const AnimatedComponent = createAnimatedComponent(View)

import multiavatar from '@multiavatar/multiavatar';
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Input } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useHeaderHeight } from '@react-navigation/elements';
const { width, height } = Dimensions.get('screen');
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = getStatusBarHeight();
const BOTTOM_HEIGHT = Math.max(0, height - WINDOW_HEIGHT - STATUS_HEIGHT);

import { createContext, useContextSelector } from 'use-context-selector';
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import * as ImagePicker from 'expo-image-picker';
//import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, createFolder, deleteFolder } from "./config";



const keyframe = new Keyframe({
  0: {
    transform: [{ rotate: '0deg' }],
  },
  25: {
    transform: [{ rotate: '45deg' }],
  },
  50: {
    transform: [{ rotate: '0deg' }],
  },
  75: {
    transform: [{ rotate: '-45deg' }],
  },
  100: {
    transform: [{ rotate: '0deg' }],
  },



})

export function RegScreen({ navigation, route }) {

  const userName = useContextSelector(Context, (state) => (state.userName))



  const avatarString = multiavatar(userName)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  const HEADER_HEIGHT = useHeaderHeight()
  const peopleList = useContextSelector(Context, (state) => (state.peopleList));
  const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));



  const transX = useSharedValue(0)


  const doAction = useSharedValue(false)

  const [isTransitionPending, startTrasition] = useTransition()

  const cssStyle = useAnimatedStyle(() => {
    return {
      position: "relative", display: "flex", justifyContent: "center", alignItems: "center",
      //   transform: [{ translateY: -HEADER_HEIGHT }],

      backgroundColor: "pink",
      // width,
      // height: HEADER_HEIGHT,
      //  width: width,

      flexDirection: "column",

      transform:
        [{
          translateX:
            doAction.value ?
              withRepeat(
                withSequence(withTiming(10, { duration: 25 }), withTiming(transX.value - 10, { duration: 50 }), withTiming(transX.value, { duration: 50 })),
                3, true,
                function (isFinished) { if (isFinished) doAction.value = false }
              )
              : 0
        }]
    }
  })

  // const entering = (values) => {
  //   'worklet';
  //   console.log(values)
  //   const animations = {
  //     //   originX: withTiming(width, { duration: 3000 }),
  //     //   opacity: withTiming(0.1, { duration: 5000 }),
  //     height: withTiming(values.targetHeight, { duration: 2000 }),
  //     opacity: withTiming(1, { duration: 2000 })
  //   };
  //   const initialValues = {
  //     originX: values.targetOriginX + 50,
  //     originY: values.targetOriginY + 50,
  //     width: values.targetWidth,
  //     height: 0,
  //     overflow: "hidden",
  //     opacity: 0
  //   };
  //   return {
  //     initialValues,
  //     animations,
  //   }
  // }
  return (
    <AnimatedComponent

    //layout={CurvedTransition.duration(10000).delay(120)}
    >
      <AnimatedComponent

        style={{ backgroundColor: "wheat", width, height: height / 3, justifyContent: "center", alignItems: "center" }}>

   
          <SvgUri style={{
            margin: 10,
            //transform: [{ translateY: 6 }, { translateX: 0 }]
            //  transform:[{scale:8}]
          }}

            width={120} height={120} svgXmlData={multiavatar(userName)} />
      

      </AnimatedComponent>


      <AnimatedComponent style={cssStyle}>
        <Button title="Sign Up" onPress={function () {
          if (doAction.value) { }
          else {
            doAction.value = true
          }
        }} />
        <Button title="Sign Up" onPress={function () {

        


          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'HomeScreen',
                params: { name: userName, fromRegScreen: true },
              },
            ],
          })



        }} />
      </AnimatedComponent>

    </AnimatedComponent>

  )


}

