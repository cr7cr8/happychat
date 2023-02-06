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
    SlideInRight,
    BounceInRight

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
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,
    BackHandler

} from 'react-native';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
//import * as Svg from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import { SharedElement } from 'react-navigation-shared-element';
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)

export function HomeScreen({ }) {

    const navigation = useNavigation()
    const route = useRoute()

    //  console.log("========", route.params)
    const peopleList = useContextSelector(Context, (state) => (state.peopleList));
    const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));


    useEffect(() => {

        setTimeout(() => {
            setPeopleList((pre) =>
            (uniqByKeepFirst([
                ...pre,
                { name: "Mike", description: "fewfas", },
                { name: "Tilandson", description: "fewfas", },
                { name: "SmithJohn", description: "fewfas", },
                { name: "chen", description: "fewfas", },
                { name: "Gergeo", description: "fewfas", },
                { name: "Bob", description: "fewfas", },
                { name: "JameBond", description: "fewfas", },
                { name: "toxNeil", description: "fewfas", },
                { name: "TomCox", description: "fewfas", },
                { name: "bentt", description: "fewfas", },
                { name: "tilda", description: "fewfas", },
                { name: "phillen", description: "fewfas", },

            ], function (msg) { return msg.name })))

        }, 0);

        HomeScreen.sharedElements = null

    }, [])

    useEffect(() => {

        if (navigation.getState().routes[0].name === "RegScreen") {
            const unsubscribe = navigation.addListener("beforeRemove", function (e) {

                // console.log(navigation.getState().routes[0].name === "RegScreen")


                e.preventDefault()
                BackHandler.exitApp()





            })

            return unsubscribe
        }
    }, [])

    return (
        <>
            {/* <View style={{ width: 120, height: 120, backgroundColor: "pink" }}>
                <SharedElement id={"chen"}  >
                    <SvgUri style={{}}
                        width={120} height={120} svgXmlData={multiavatar("chen")} />
                </SharedElement>
            </View> */}
            <DraggableFlatList
                data={peopleList}
                //  onDragEnd={({ data }) => setData(data)}

                onDragEnd={function ({ data, ...props }) {


                    setPeopleList(data)
                }}
                keyExtractor={(item) => (item.name)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={true}


            />
        </>
    )

}

function renderItem(props) {

    const navigation = useNavigation()
    const route = useRoute()
    const { drag, isActive, getIndex, item: { name, barColor } } = props

    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
    const showSnackBar = useContextSelector(Context, (state) => (state.showSnackBar));
    const userName = useContextSelector(Context, (state) => (state.userName));
    // console.log(avatarString)

    const scale = useDerivedValue(() => isActive ? 0.8 : 1)

    const panelCss = useAnimatedStyle(() => {

        // console.log("HOME", name)
        return {
            backgroundColor: bgColor,
            height: 80,
            transform: [{ scale: withTiming(scale.value) }],
            elevation: withTiming(isActive ? 5 : 3),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10

        }

    })

    return (

        // <AnimatedComponent entering={getIndex() === 0 ? null : SlideInRight.delay(Math.min(getIndex() * 150,))} >
        <AnimatedComponent entering={route.params?.fromRegScreen && getIndex() === 0 ? null : SlideInRight.delay(Math.min(getIndex() * 150, 3000)).duration(300)}  >

            < Pressable onLongPress={drag} onPress={
                function () {
                    navigation.navigate("ChatScreen", { name: name })
                    //showSnackBar(name)
                }
            } >

                <View style={[panelCss]}>
                    <SharedElement id={name}  >
                        <SvgUri style={{ margin: 0 }} width={60} height={60} svgXmlData={multiavatar(name)} />
                    </SharedElement>

                    <View style={{ marginHorizontal: 10 }}><Text>{name}</Text></View>
                </View>


            </Pressable >
        </AnimatedComponent >
    )
}


HomeScreen.sharedElements = (route, otherRoute, showing) => {


    return [
        { id: "chen", animation: "move", resize: "auto", align: "left", }, // ...messageArr,   // turn back image transition off
    ]
};