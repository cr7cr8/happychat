import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';
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
  withDecay,

} from 'react-native-reanimated';
//import Image from 'react-native-scalable-image';
import multiavatar from '@multiavatar/multiavatar';
const { View, Text, ScrollView: ScrollV, Image } = ReAnimated

import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = getStatusBarHeight();
const BOTTOM_HEIGHT = Math.max(0, height - WINDOW_HEIGHT - STATUS_HEIGHT);
import { SharedElement } from 'react-navigation-shared-element';
import SvgUri from 'react-native-svg-uri';
import { Context } from "./ContextProvider";
import ViewTransformer from "react-native-easy-view-transformer";
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { useHeaderHeight } from '@react-navigation/elements';
//import Image from 'react-native-scalable-image';
import { OverlayDownloader } from './OverlayDownloader';



export function ImageScreen({ navigation, route, }) {


  const HEADER_HEIGHT = useHeaderHeight()

  console.log(height, getStatusBarHeight(), HEADER_HEIGHT, route.params.name)


  const { currentPos, imageMessageArr } = route.params
  const scrollRef = useRef()
  const scrollX = useSharedValue(currentPos * width)
  const [overLayOn, setOverLayOn] = useState(false)
  return (
    <>
      <View style={{
        position: "absolute", display: "flex", justifyContent: "center", alignItems: "center",
        transform: [{ translateY: -HEADER_HEIGHT }],
        backgroundColor: "skyblue", width,
        flexDirection: "row", height: HEADER_HEIGHT
      }}>
        <SharedElement id={route.params.name}  >
          <SvgUri style={{
            margin: 10,
            transform: [{ translateY: 6 }, { translateX: -width / 2 - 40 }, { scale: 1 }]

          }} width={40} height={40} svgXmlData={multiavatar(route.params.name)} />
        </SharedElement>
      </View>


      <ScrollView
        contentOffset={{ x: currentPos * width, y: 0 }}
        scrollEnabled={false}
        ref={scrollRef}
        horizontal={true}
        onScroll={function (e) { scrollX.value = e.nativeEvent.contentOffset.x }}
        snapToInterval={width}
        contentContainerStyle={{
          display: "flex", justifyContent: "center", alignItems: "center",
          //backgroundColor: "pink"
          // backgroundColor: "#333"
          backgroundColor: "pink",
          height: height - HEADER_HEIGHT,
        }}

      >

        {
          imageMessageArr.map((item, index, arr) => {

            return (
              <ViewTransformer
                maxScale={2.5}
                key={item._id || index}
                arrLength={arr.length}
                onTransformStart={function () { }}
                onTransformGestureReleased={function ({ scale, translateX, translateY }) {

                  if (scale === 1 && translateX < (-10)) {
                    scrollRef.current.scrollTo({ x: (index + 1) * width, y: 0, animated: true })
                  }
                  else if (scale === 1 && translateX > (10)) {
                    scrollRef.current.scrollTo({ x: (index - 1) * width, y: 0, animated: true })
                  }
                }}
              >
                <Pressable onLongPress={function () { Vibration.vibrate(50);setOverLayOn(true) }}>
                  <SharedElement id={String(item._id)}>

                    <Image source={{ uri: item.image, headers: { token: "hihihi" } }} resizeMode="contain" style={{ width, height: height - HEADER_HEIGHT - getStatusBarHeight() }} />

                  </SharedElement>
                </Pressable>
              </ViewTransformer>

            )

          })

        }
      </ScrollView>

      <OverlayDownloader
        overLayOn={overLayOn}
        setOverLayOn={setOverLayOn}
        uri={imageMessageArr[Math.floor(scrollX.value / width)].image}
        fileName={Date.now() + ".jpg"}
      />
    </>



  )
}



ImageScreen.sharedElements = (route, otherRoute, showing) => {

 // console.log("image screen other route ---", otherRoute.params.name)
  const imageMessageArr = route.params.imageMessageArr
  const currentPos = route.params.currentPos
  //console.log(route)
  //  return [
  // { id: route.params.item, animation: "move", resize: "auto", align: "left", },
  // ...messageArr,
  // ]

  // return route.params.imageMessageArr.map(item=>({_id:item._id,image:item.image}))
  // return route.params.imageMessageArr.map(item => ({ id: item._id, animation: "move", resize: "auto", align: "left", }))

  return [{ id: route.params.name }, { id: imageMessageArr[currentPos]._id, animation: "move", resize: "auto", align: "left" }]


};
;
