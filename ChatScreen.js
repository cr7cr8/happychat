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
    useAnimatedRef,
    ZoomIn,
    SlideInRight,
    SlideInDown,
    SlideInUp,
    ZoomInLeft,
    ZoomInEasyUp

} from 'react-native-reanimated';
import multiavatar from '@multiavatar/multiavatar';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { SharedElement } from 'react-navigation-shared-element';
import SvgUri from 'react-native-svg-uri';
import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { Context } from "./ContextProvider"
import { createContext, useContextSelector } from 'use-context-selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage,
    Actions,
} from 'react-native-gifted-chat'
import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import { useHeaderHeight } from '@react-navigation/elements';

import { getStatusBarHeight } from 'react-native-status-bar-height';
const { width, height } = Dimensions.get('screen');
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = getStatusBarHeight();
const BOTTOM_HEIGHT = Math.max(0, height - WINDOW_HEIGHT - STATUS_HEIGHT);

import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,
    findNodeHandle, UIManager
} from 'react-native';
import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input } from 'react-native-elements';
import Image from 'react-native-scalable-image';
const { View, Text, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)




export function ChatScreen({ navigation, route }) {

    const userName = "chen"
    const [messages, setMessages] = useState([
        {
            _id: Math.random(),
            text: "1",
            createdAt: new Date(222222222222),
            user: {
                _id: userName,
                name: userName,

            }
        },
        {
            _id: Math.random(),
            text: "11115555",
            createdAt: new Date(222228222822),
            user: {
                _id: userName,
                name: userName,

            }
        },
        {
            _id: Math.random(),
            text: '2',
            createdAt: new Date(),

            user: {
                _id: 'React Native',
                name: 'React Native',
            },
        },
        {
            _id: Math.random(),
            text: "",
            createdAt: new Date(),
            image: "https://picsum.photos/200/300",

            user: {
                _id: 'React Native',
                name: 'React Native',
            },
        },
        {
            _id: Math.random(),
            text: "",
            createdAt: new Date(),
            image: "https://picsum.photos/200/600",

            user: {
                _id: userName,
                name: userName,
            },
        },
        {
            _id: Math.random(),
            text: "",
            createdAt: new Date(),
            image: "https://picsum.photos/700/300",

            user: {
                _id: 'React Native',
                name: 'React Native',
            },
        },
        {
            _id: Math.random(),
            text: '222522222',
            createdAt: new Date(),

            user: {
                _id: 'React Native',
                name: 'React Native',
            },
        },
        {
            _id: Math.random(),
            text: "",
            createdAt: new Date(),
            image: "https://picsum.photos/600/300",

            user: {
                _id: userName,
                name: userName,
            },
        },
        // {
        //     _id: Math.random(),
        //     text: "glrgfl;rekglglrgfl;rekglkrgodkfg",
        //     createdAt: new Date(222228222822),
        //     user: {
        //         _id: userName,
        //         name: userName,

        //     }
        // },


    ])


    const name = route.params.name
    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))



    const HEADER_HEIGHT = useHeaderHeight()


    return (
        <>



            <View style={{
                position: "absolute", display: "flex", justifyContent: "center", alignItems: "center",
                transform: [{ translateY: -HEADER_HEIGHT }],
                backgroundColor: bgColor, width,
                flexDirection: "row", height: HEADER_HEIGHT
            }}>
                <SharedElement id={route.params.name}  >

                    <SvgUri style={{
                        margin: 10, transform: [{ translateY: 6 }, { translateX: 0 }]

                    }}

                        width={40} height={40} svgXmlData={multiavatar(route.params.name)} />
                </SharedElement>
                <Text style={{ fontSize: 15, color: "black", transform: [{ translateY: 8 }, { translateX: 0 }] }}>{name}</Text>
            </View>
            {/* <Overlay isVisible={true} fullScreen={false}

                backdropStyle={{ backgroundColor: "rgba(100,0,0,0.5)", }}

                style={{ position: "absolute", top: 0, left: 0, backgroundColor: "pink", }}>
                <Text style={{}}>fsdf</Text>
            </Overlay> */}

            <GiftedChat
                user={{ _id: "chen" }}
                renderAvatarOnTop={true}
                messages={messages}
                showUserAvatar={false}

                alignTop={false}
                inverted={false}
                renderUsernameOnMessage={false}

                onSend={function (msg) {

                    setMessages(pre => [...pre, ...msg])
                }}

                renderMessage={function (props) {
                    const currentMessage = props.currentMessage
                    if (currentMessage.video) { return }
                    return <MessageBlock outerProps={props} currentMessage={currentMessage} />
                }}

                renderBubble={function (props) {

                    return (
                        <BubbleBlock  {...props} />
                    )
                }}
                renderTime={function (props) {
                    const currentMessage = props.currentMessage



                    return <Time {...props}

                        timeFormat="H:mm"
                        timeTextStyle={{


                            left: {
                                color: "#A0A0A0"
                            },
                            right: {
                                color: "#A0A0A0",
                                //     ...currentMessage.image && {  backgroundColor: "lightgreen",borderRadius:0 }
                                //display:"none"
                            }
                        }} />
                }}
                renderMessageText={function (props) {
                    // return <MessageText {...props}
                    //     textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }} />
                    return <TextBlock {...props} />
                }}
                renderMessageImage={function (props) {
                    const currentMessage = props.currentMessage
                    const imageMessageArr = messages.filter(message => Boolean(message.image)).map(msg => { return { ...msg, user: { ...msg.user, avatar: "" } } })
                    return <ImageBlock currentMessage={currentMessage} imageMessageArr={imageMessageArr} navigation={navigation} />
                }}
            />
        </>
    )

}

// MessageBlock is used for wraping the entire message block (message bubble) , including image block
function MessageBlock({ outerProps, currentMessage, ...props }) {

    return (

        <Message {...outerProps} />

    )
}


function BubbleBlock({ ...props }) {

    const currentMessage = props.currentMessage


    return (

        <AnimatedComponent entering={ZoomIn.duration(200)}
            style={{
                //  backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16)  //random color
            }}
        //     ref={function (element) { viewRef.current = element }}
        >
            <Bubble {...props}

                wrapperStyle={{
                    left: {
                        backgroundColor: "lightgray",
                        overflow: "hidden",
                        justifyContent: 'flex-start',
                        //transform: [{ translateX: -9 }],

                        //      ...currentMessage.image && {  borderTopRadius:10,borderTopRightRadius:100}
                    },
                    right: {
                        backgroundColor: "lightgreen",
                        overflow: "hidden",
                        justifyContent: 'flex-start',
                        //transform: [{ translateX: -9 }],

                        //      ...currentMessage.image && {  borderTopRadius:10,borderTopRightRadius:100}
                    },
                }}
                textStyle={{
                    left: { color: "black", ...currentMessage.image && { display: "none" } },

                    right: { color: "black", ...currentMessage.image && { display: "none" } },

                }}
                onLongPress={function () {

                    // const handle = findNodeHandle(viewRef.current);
                    // UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

                    //     setLeft(px)
                    //     setTop(Math.max(0, py - STATUS_HEIGHT - 60))
                    //     setVisible(true)
                    // })

                }}

            />

         


        </AnimatedComponent>





    )

}

function TextBlock({ ...props }) {

    const viewRef = useAnimatedRef()

    const [visible, setVisible] = useState(false)
    const [top, setTop] = useState(60)
    const [left, setLeft] = useState(0)
    return (

        <Pressable ref={function (element) { viewRef.current = element }}
            onLongPress={function () {
                const handle = findNodeHandle(viewRef.current);
                UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {
                    console.log(fx, fy, compoWidth, compoHeight, px, py)
                    setLeft(Math.min(px, width - 150))
                    setTop(Math.max(0, py - STATUS_HEIGHT - 60))
                    setVisible(true)
                })
            }}

        >
            <MessageText {...props}
                textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }}
            />
            <Overlay isVisible={visible} fullScreen={false}
                onBackdropPress={function () {
                    setVisible(false)
                }}
                backdropStyle={{ backgroundColor: "transparent" }}
                overlayStyle={{
                    //  backgroundColor: "rgba(50,50,50,0)",
                    backgroundColor: "transparent",
                    position: "absolute",
                    left,
                    top,
                    elevation: 0,
                }}
            >

                <AnimatedComponent entering={ZoomIn.duration(200)} style={{
                    display: "flex", flexDirection: "row", backgroundColor: "rgba(50,50,50,0.8)",
                    borderRadius: 8
                }}>

                    <Icon name="copy-outline" type='ionicon' color='white' size={50} style={{ padding: 4 }} />
                    <Icon name="trash-outline" type='ionicon' color='white' style={{ padding: 4 }} size={50} />

                </AnimatedComponent>
            </Overlay>
        </Pressable>
    )

}

function ImageBlock({ currentMessage, imageMessageArr, ...props }) {

    const currentImage = currentMessage.image

    const navigation = useNavigation()
    const route = useRoute()
    const viewRef = useAnimatedRef()

    const [visible, setVisible] = useState(false)
    const [top, setTop] = useState(60)
    const [left, setLeft] = useState(0)

    return (
        <Pressable
            ref={function (element) { viewRef.current = element }}
            onPress={function () {

                navigation.navigate('ImageScreen', {

                    imageMessageArr: imageMessageArr.map(item => ({ _id: String(item._id), image: item.image })),
                    currentPos: imageMessageArr.findIndex(item => { return item._id === currentMessage._id }),
                    name: route.params.name

                })
            }}
            onLongPress={function () {

                const handle = findNodeHandle(viewRef.current);
                UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {
                    console.log(fx, fy, compoWidth, compoHeight, px, py)
                    setLeft(px)
                    setTop(Math.max(0, py - STATUS_HEIGHT - 60))
                    setVisible(true)
                })
            }}
        >
            <SharedElement id={currentMessage._id}  >
                <Image source={{ uri: currentImage, headers: { token: "hihihi" } }} width={200} resizeMode="contain" />
            </SharedElement>


            <Overlay isVisible={visible} fullScreen={false}
                onBackdropPress={function () {
                    setVisible(false)
                }}
                backdropStyle={{ backgroundColor: "transparent" }}
                overlayStyle={{
                    //  backgroundColor: "rgba(50,50,50,0)",
                    backgroundColor: "transparent",
                    position: "absolute",
                    left,
                    top,
                    elevation: 0,
                }}
            >

                <AnimatedComponent entering={ZoomIn.duration(200)} style={{
                    display: "flex", flexDirection: "row", backgroundColor: "rgba(50,50,50,0.8)",
                    borderRadius: 8
                }}>

                    <Icon name="arrow-down-circle-outline" type='ionicon' color='white' size={50} style={{ padding: 4 }} />
                    <Icon name="trash-outline" type='ionicon' color='white' style={{ padding: 4 }} size={50} />

                </AnimatedComponent>
            </Overlay>


        </Pressable>

    )



}








ChatScreen.sharedElements = (route, otherRoute, showing) => {

    const name = route.params.name



    if (otherRoute && otherRoute.route && otherRoute.route.params && otherRoute.route.params.imageMessageArr) {

        return [

            { id: name, animation: "move", resize: "auto", align: "left" },
            { id: otherRoute.route.params.imageMessageArr[otherRoute.route.params.currentPos]._id, animation: "move", resize: "auto", align: "left" }


        ]


    }



    return [{ id: name, animation: "move", resize: "auto", align: "left" }]

}







// deprecated,shared elements no animation once placed in HeaderTitle Component
export function ChatScreenHeaderTitle({ ...props }) {

    const route = useRoute()
    const name = route.params.name
    return (
        <>
            {/* <View style={[{ display: "flex", flexDirection: "row", alignItems: "center" }]}>
               <SharedElement id={name}  >
                    <SvgUri style={{ margin: 10, }} width={40} height={40} svgXmlData={multiavatar(name)} />
                </SharedElement> */}
            {/* <Text style={{ fontSize: 15, color: "black", transform: [{ translateY: -2 }, { translateX: 20 }] }}>{name}</Text> 
            </View>*/}
        </>
    )
}