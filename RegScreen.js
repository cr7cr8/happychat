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
  ZoomIn,
  PinwheelIn,
  PinwheelOut,
  BounceIn,
  BounceInDown
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
import { useNavigation } from '@react-navigation/native';





export function RegScreen({ }) {

  const userName = useContextSelector(Context, (state) => (state.userName))
  const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));

  const navigation = useNavigation()




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

  const inputRef = useRef()
  const [disabled, setDisabled] = useState(false)
  // const [value, setValue] = useState("Guest" + Number(Math.random() * 1000).toFixed(0))
  const [value, setValue] = useState("chen")
  const reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]{2,14}$/g;
  const avatarString = multiavatar(value)

  const bgColor = avatarString ? hexify(hexToRgbA(avatarString?.match(/#[a-zA-z0-9]*/)[0])) : "#ccc"
  const display = useSharedValue("flex")
  const style = useAnimatedStyle(() => ({

    flex: 1,
    display: display.value,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: "red"

  }))

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("beforeRemove", function () {
  //     display.value = "none"
  //   })
  //   return unsubscribe



  // }, [])




  return (
    <View

      style={style}

    //layout={CurvedTransition.duration(10000).delay(120)}
    >
      <AnimatedComponent entering={BounceIn}
        // exiting={PinwheelOut.duration(1000)}

        style={{ backgroundColor: bgColor, width, height: height / 3, justifyContent: "center", alignItems: "center" }}>
        <SharedElement id={"chen"}>
          <SvgUri style={{ margin: 10, }} width={120} height={120} svgXmlData={multiavatar(value)} />

        </SharedElement>

      </AnimatedComponent>
      {/* <AnimatedComponent entering={BounceInDown.delay(300)}>
        <Input ref={inputRef} placeholder='Enter a name'
          inputContainerStyle={{ width: 0.8 * width, }}
          style={{ fontSize: 25 }}
          value={value}
          textAlign={'center'}
          onPressIn={function () { inputRef.current.blur(); inputRef.current.focus() }}
          errorMessage={value.match(reg) ? "" : value ? "At least 3 characters" : ""}
          onChangeText={function (text) {
            setValue(text)
            //opacity.value = opacity.value===1?0.5:1
          }}
        />
      </AnimatedComponent> */}
      <AnimatedComponent style={cssStyle}>
        <Button title="Sign Up" onPress={function () { if (doAction.value) { } else { doAction.value = true } }} />

        <Button title="Sign up"

          disabled={disabled}
          onPress={function () {
           // display.value = "none"


            setPeopleList([{ name: "chen" }])

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

    </View>

  )


}

