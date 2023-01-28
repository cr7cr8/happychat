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
    SlideInRight

} from 'react-native-reanimated';


import multiavatar from '@multiavatar/multiavatar';
import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import DraggableFlatList, {
    ScaleDecorator,
    useOnCellActiveAnimation,
    ShadowDecorator,

} from "react-native-draggable-flatlist";

import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { Context } from "./ContextProvider"
import { createContext, useContextSelector } from 'use-context-selector';
import { useNavigation } from '@react-navigation/native';


import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,


} from 'react-native';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
//import * as Svg from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)

export function HomeScreen({ navigation, route }) {


    const peopleList = useContextSelector(Context, (state) => (state.peopleList));
    const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));







    return (
        <>


            <DraggableFlatList
                data={peopleList}
                //  onDragEnd={({ data }) => setData(data)}

                onDragEnd={function ({ data, ...props }) {


                    setPeopleList(data)
                }}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                showsVerticalScrollIndicator={true}


            />
        </>
    )

}

function renderItem(props) {

    const { drag, isActive, getIndex, item: { name, barColor } } = props

    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))

    console.log(avatarString)

    const scale = useDerivedValue(() => isActive ? 0.8 : 1)

    const panelCss = useAnimatedStyle(() => {


        return {
            backgroundColor: barColor,
            height: 80,
            transform: [{ scale: withTiming(scale.value) }],
            elevation: withTiming(isActive ? 5 : 3)
        }

    })

    return (
        <AnimatedComponent entering={SlideInRight.delay(getIndex() * 50)}>
            <Pressable onLongPress={drag} >

                <View style={[panelCss]}>
                    <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(name)} />



                    {/* <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
                        <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
                        <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
                    </Svg> */}


                    <Text>{name}</Text>
                </View>

            </Pressable>
        </AnimatedComponent>
    )
}