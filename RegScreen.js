import React, { useState, useRef, useEffect, useContext, useLayoutEffect, useTransition } from 'react';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight,
  TouchableWithoutFeedback, ImageBackground,

  PermissionsAndroid,
  Platform,
  Animated,
  Vibration
} from 'react-native';



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

//import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, createFolder, deleteFolder } from "./config";
import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export function RegScreen({ }) {

  const userName = useContextSelector(Context, (state) => (state.userName))
  const setUserName = useContextSelector(Context, (state) => (state.setUserName))
  const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));

  const navigation = useNavigation()




  const transX = useSharedValue(0)


  const shouldShake = useSharedValue(false)



  const cssStyle = useAnimatedStyle(() => {
    return {
      position: "relative", display: "flex", justifyContent: "center", alignItems: "center",
      //   transform: [{ translateY: -HEADER_HEIGHT }],

      //backgroundColor: "pink",
      // width,
      // height: HEADER_HEIGHT,
      width: width,

      flexDirection: "column",

      transform:
        [{
          translateX:
            shouldShake.value ?
              withRepeat(
                withSequence(withTiming(10, { duration: 25 }), withTiming(transX.value - 10, { duration: 50 }), withTiming(transX.value, { duration: 50 })),
                3, true,
                function (isFinished) { if (isFinished) shouldShake.value = false }
              )
              : 0
        }]
    }
  })

  const inputRef = useRef()
  const [disabled, setDisabled] = useState(false)
  // const [value, setValue] = useState("Guest" + Number(Math.random() * 1000).toFixed(0))

  const reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]{2,14}$/g;
  const avatarString = multiavatar(userName)

  const bgColor = avatarString ? hexify(hexToRgbA(avatarString?.match(/#[a-zA-z0-9]*/)[0])) : "#ccc"




  const [avatarUri, setAvatarUri] = useState("")



  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}>




      <AnimatedComponent entering={BounceIn} style={{ backgroundColor: bgColor, width, height: height / 3, justifyContent: "center", alignItems: "center" }}>
     


        {avatarUri && <Icon name="trash-outline" type='ionicon' color='gray' containerStyle={{ position: "absolute", top: 0 + getStatusBarHeight() + 10, right: 50 }} size={30}
          onPress={function () {
            FileSystem.readDirectoryAsync(FileSystem.cacheDirectory + "ImagePicker/").then(data => {
              data.forEach(filename_ => {
                console.log(FileSystem.cacheDirectory + "ImagePicker/" + filename_)
                FileSystem.deleteAsync(FileSystem.cacheDirectory + "ImagePicker/" + filename_, { idempotent: true })
              })

            })

            setAvatarUri("")
          }}
        />}

        <SharedElement id={userName}>
          <Pressable onPress={function () {
            pickImage(setAvatarUri)

          }}>
            {
              avatarUri
                ? <Image source={{ uri: avatarUri }} resizeMode="cover" style={{ width: 120, height: 120, borderRadius: 1000 }} />
                : <SvgUri style={{ margin: 10, }} width={120} height={120} svgXmlData={multiavatar(userName || Math.random())} />
            }
          </Pressable>
        </SharedElement>

      </AnimatedComponent>

      <AnimatedComponent entering={BounceInDown.delay(300)}>
        <Input ref={inputRef} placeholder='Enter a name'
          inputContainerStyle={{ width: 0.8 * width, }}
          style={{ fontSize: 25 }}
          value={userName}
          textAlign={'center'}
          onPressIn={function () { inputRef.current.blur(); inputRef.current.focus() }}
          errorMessage={userName.match(reg) ? "" : userName ? "At least 3  letters andor kanji " : ""}
          onChangeText={function (text) {
            setUserName(text)

          }}
        />
      </AnimatedComponent>




      <AnimatedComponent style={cssStyle}>
        {/* <Button title="Sign Up" onPress={function () { if (doAction.value) { } else { doAction.value = true } }} /> */}

        <Button title="Sign up" containerStyle={{ width: width * 0.8, }} buttonStyle={{ backgroundColor: bgColor, }} titleStyle={{ color: "gray" }}

          disabled={!userName.match(reg)}
          onPress={function () {



            Promise.resolve(
              //***** checking duplicate here */

              ////////////////////
            )
              .then((isDuplicate = true) => {
                if (isDuplicate) {
                  shouldShake.value = true
                }
                else {
                  setPeopleList([{ name: userName }])
                  navigation.navigate("HomeScreen", { name: userName, fromRegScreen: true })
                }
              })
          }} />
      </AnimatedComponent>









    </View>

  )


}



async function pickImage(setAvatarUri) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.canceled) {

    console.log(result.assets[0].uri)
    setAvatarUri(result.assets[0].uri)

  }
};