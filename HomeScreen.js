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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,


} from 'react-native';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
//import * as Svg from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import { SharedElement } from 'react-navigation-shared-element';
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)

export function HomeScreen({ navigation, route }) {


    const peopleList = useContextSelector(Context, (state) => (state.peopleList));
    const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));


    useEffect(() => {



        const unsubscribe = navigation.addListener('focus', () => {

            setTimeout(() => {
                setPeopleList((pre) =>
                (uniqByKeepFirst([
                    ...pre,
                    { name: "Mike", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
                    { name: "Tilandson", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
                    { name: "SmithJohn", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
                    { name: "chen", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#afa" },
                    { name: "Gergeo", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
                    { name: "Bob", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
                    { name: "JameBond", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
                    { name: "toxNeil", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
                    { name: "TomCox", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
                    { name: "bentt", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
                    { name: "tilda", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
                    { name: "phillen", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },



                ], function (msg) { return msg.name })))
            }, 0);




            HomeScreen.sharedElements = null


        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;




    }, [])




    return (
        <>

            {/* <SharedElement id={"ttt"}  >
                <SvgUri style={{
                    margin: 10,
                    //transform: [{ translateY: 6 }, { translateX: 0 }]
                    //  transform:[{scale:8}]
                }}

                    width={120} height={120} svgXmlData={multiavatar("chen")} />
            </SharedElement> */}
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

        }  

    })

    return (

        <AnimatedComponent entering={(name === userName && route.params?.fromRegScreen) ? null : SlideInRight.delay(Math.min(getIndex() * 50, 2000))} >
            {/* <AnimatedComponent entering={route.params?.fromRegScreen ? null : SlideInRight.delay(Math.min(getIndex() * 50, 5000))} > */}
            <Pressable onLongPress={drag} onPress={function () {
                navigation.navigate("ChatScreen", { name: name })
                //showSnackBar(name)
            }}>

                <View style={[panelCss]}>
                    <SharedElement id={name}  >
                        <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(name)} />
                    </SharedElement>

                    <View><Text>{name}</Text></View>
                </View>


            </Pressable>
        </AnimatedComponent >
    )
}

HomeScreen.sharedElements = (route, otherRoute, showing) => {


    return [
        { id: "chen", animation: "move", resize: "auto", align: "left", }, // ...messageArr,   // turn back image transition off

    ]
};

// HomeScreen.sharedElements = (route, otherRoute, showing) => {

//     //console.log("====+++", route)
//     return route.params && route.params.item && [
//         { id: route.params.item, animation: "move", resize: "auto", align: "left", }, // ...messageArr,   // turn back image transition off
//     ]
// };