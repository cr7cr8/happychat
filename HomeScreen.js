import ReAnimated, {
    useAnimatedStyle, useSharedValue, useDerivedValue,
    withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
    useAnimatedGestureHandler,
    interpolate,
    withDelay,
    withSpring,
    useAnimatedScrollHandler,

    //interpolateColors,

    useAnimatedProps,
    withSequence,
    withDecay,

    ZoomIn,

} from 'react-native-reanimated';



import DraggableFlatList, {
    ScaleDecorator,
    useOnCellActiveAnimation,
    ShadowDecorator,

} from "react-native-draggable-flatlist";

import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';


import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,


} from 'react-native';
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)

export function HomeScreen({ navigation, route }) {

    const width = useSharedValue(100)
    const css = useAnimatedProps(() => {

        return {
            width: withTiming(width.value),
            backgroundColor: "#AAA",
        }


    })

    return <Pressable

        onPress={function () {
            width.value = width.value === 100 ? 50 : 100
        }}
    >

        <AnimatedComponent entering={ZoomIn} style={{ backgroundColor: "pink", width: 180, display: "flex", justifyContent: "center" }}>
            <View ><Text>fwefwfds</Text></View>
        </AnimatedComponent>

        <View
            //  title="go to chat"
            style={[css]}

        // onPress={function () {
        //     //  navigation.navigate('Chat')
        //     width.value = width.value === 100 ? 50 : 100

        //      console.log(width.value===100?50:80)
        // }}
        ><Text>aafffa</Text></View>
    </Pressable>






}