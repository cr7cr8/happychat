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
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)

export function HomeScreen({ navigation, route }) {

    // const { userName, setUserName } = useContext(Context)

    const userName = useContextSelector(Context, (state) => (state.userName));
    const setUserName = useContextSelector(Context, (state) => (state.setUserName));
    const peopleList = useContextSelector(Context, (state) => (state.peopleList));
    const setPeopleList = useContextSelector(Context, (state) => (state.setPeopleList));


    const width = useSharedValue(100)
    const scale = useSharedValue(1)




    return (
        <>
            <DraggableFlatList
                data={peopleList}
                //  onDragEnd={({ data }) => setData(data)}

                onDragEnd={function ({ data, ...props }) {

                    console.log(props)
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

    console.log(getIndex(), isActive)

    const scale = useDerivedValue(() => isActive ? 0.8 : 1)

    const panelCss = useAnimatedStyle(() => {


        return {
            backgroundColor: barColor,
            height: 80,
            transform: [{ scale: withTiming(scale.value) }],
            elevation: withTiming(isActive?5:3)
        }

    })

    return (
        <AnimatedComponent entering={SlideInRight.delay(getIndex() * 100)}>
            <Pressable onLongPress={drag} >

                <View style={[panelCss]}>
                    <Text>{name}</Text>
                </View>

            </Pressable>
        </AnimatedComponent>
    )
}