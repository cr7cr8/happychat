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
    ZoomInEasyUp,
    ZoomOut,
    SlideOutRight

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
import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, createFolder, deleteFolder } from "./config";
import { useHeaderHeight } from '@react-navigation/elements';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';
import { Video, AVPlaybackStatus, Audio, ExponentAV } from 'expo-av';

import { getStatusBarHeight } from 'react-native-status-bar-height';
const { width, height } = Dimensions.get('screen');
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = getStatusBarHeight();
const BOTTOM_HEIGHT = Math.max(0, height - WINDOW_HEIGHT - STATUS_HEIGHT);

import {
    StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, Button,
    findNodeHandle, UIManager, Keyboard, Platform
} from 'react-native';

import { OverlayDownloader } from './OverlayDownloader';
import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
const { View, Text, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)
let recording = new Audio.Recording();
let audioSound = new Audio.Sound();


export function ChatScreen({ navigation, route }) {
    const name = route.params.name
    const userName = "chen"

    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
    const HEADER_HEIGHT = useHeaderHeight()
    //let keyboardHeight = useKeyboardHeight()


    const scrollRef = useRef()
    const inputText = useRef("")
    const inputRef = useRef()

    // const keyboardShowPos = useRef(0)
    // const keyboardHidePos = useRef(0)
    // const [keyboardHeight, setKeyboardHeight] = useState(0)
    const keyboardHeight = useKeyboardHeight()
    const [toolBarHeight, setToolBarHeight] = useState(60)

    const micBarWidth = useSharedValue(0)
    const micBarStyle = useAnimatedStyle(() => ({
        zIndex: 800, width: withTiming(micBarWidth.value), position: "relative", justifyContent: "center", alignItems: "center",
        height: 60, backgroundColor: "yellow", top: 0,
        marginLeft: 0,
    }))

    const inputBarWidth = useSharedValue(width - 120)
    const inputBarStyle = useAnimatedStyle(() => {

        return {
            width: withTiming(micBarWidth.value === 0 ? width - 120 : 0),
            overflow: "hidden"
        }

    })


    const isReleased = useSharedValue(1)
    const releasedStyle = useAnimatedStyle(() => {
        return {
            display: isReleased.value === 1 ? "flex" : "none",
            color: "#666",
            fontSize: 20,
        }
    })

    const onHoldStyle = useAnimatedStyle(() => {
        return {
            display: isReleased.value === 1 ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center"
            //    color: "#666",
        }
    })


    const backGesture = useAnimatedGestureHandler({


        onStart: (event, obj) => {
            isReleased.value = 0
            obj.translationX = event.translationX
            obj.translationY = event.translationY

            runOnJS(callStartRecording)()

        },
        onActive: (event, obj) => {
            isReleased.value = 0
            obj.translationX = event.translationX
            obj.translationY = event.translationY

            // console.log(event.translationX)

        },
        onEnd: (event, obj) => {
            obj.translationX = event.translationX
            obj.translationY = event.translationY


            console.log("gesture end")

        },
        onFail: (event, obj) => {
            obj.translationX = event.translationX
            obj.translationY = event.translationY

            console.log("gesture fail")
        },
        onCancel: (event, obj) => {
            obj.translationX = event.translationX
            obj.translationY = event.translationY


            console.log("gesture cancel")


        },
        onFinish: (event, obj) => {

            if ((obj.translationY < -60) && (isReleased.value === 0)) {
                //  runOnJS(callCancelRecording)()
            }
            else if ((obj.translationX < -60) && (isReleased.value === 0)) {
                // runOnJS(callCancelRecording)()
                micBarWidth.value = 0
            }
            else if ((obj.translationY >= -60) && (isReleased.value === 0)) {
                runOnJS(callStopRecording)()
            }


            isReleased.value = 1
        }

    })


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
            text: "",
            audio: "audio",
            createdAt: new Date(222228222822),
            user: {
                _id: userName,
                name: userName,

            }
        },
        {
            _id: Math.random(),
            text: "",
            audio: "audio",
            createdAt: new Date(222228222822),
            user: {
                _id: name,
                name: name,

            }
        },
        {
            _id: Math.random(),
            text: '2',
            createdAt: new Date(),

            user: {
                _id: name,
                name: name,
            },
        },
        {
            _id: Math.random(),
            text: "",
            createdAt: new Date(),
            image: "https://picsum.photos/200/300",

            user: {
                _id: name,
                name: name,
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
                _id: name,
                name: name,
            },
        },
        {
            _id: Math.random(),
            text: '222522222',
            createdAt: new Date(),

            user: {
                _id: name,
                name: name,
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
    ]
        .map(item => {

            return {
                ...item,
                user: {
                    ...item.user,
                    avatar: () => (<SvgUri style={{ position: "relative" }} width={36} height={36} svgXmlData={multiavatar(item.user.name)} />)
                }
            }


        })
    )

    useEffect(function () {

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', function (e) {

        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", function (e) {
            console.log("keyboard hide")

        })

        return function () {

            //    return Keyboard.removeSubscription(keyboardDidShowListener)
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }

    }, [])

    // const messageBlockStyle = useAnimatedStyle(() => {
    //     return {
    //         position: "relative",
    //         transform: [{ translateY: withTiming(-STATUS_HEIGHT) }],
    //         height: height - HEADER_HEIGHT - HEADER_HEIGHT - BOTTOM_HEIGHT,
    //         marginEnd: 0,
    //     }
    // })

    return (
        <>

            <View style={{
                position: "absolute", display: "flex", justifyContent: "center", alignItems: "center",
                transform: [{ translateY: -HEADER_HEIGHT }],
                backgroundColor: bgColor, width,
                flexDirection: "row", height: HEADER_HEIGHT,
                zIndex: 100
            }}>
                <SharedElement id={route.params.name}  >

                    <SvgUri style={{
                        margin: 10, transform: [{ translateY: 6 }, { translateX: 0 }]

                    }}

                        width={40} height={40} svgXmlData={multiavatar(route.params.name)} />
                </SharedElement>
                <Text style={{ fontSize: 15, color: "black", transform: [{ translateY: 8 }, { translateX: 0 }] }}>{name}</Text>
            </View>

            <GiftedChat
                user={{ _id: "chen" }}
                keyboardShouldPersistTaps={"never"}
                renderAvatarOnTop={true}
                messages={messages}
                showUserAvatar={false}
                placeholder="Enter..."
                alignTop={false}
                inverted={false}
                renderUsernameOnMessage={false}
                alwaysShowSend={true}

                listViewProps={{
                    ref: (element) => { scrollRef.current = element },
                    onContentSizeChange: (e) => {

                        //  if (canMoveDown.current) {
                        scrollRef.current.scrollToOffset({ offset: 9999, animated: true })

                        //  }
                    }
                }}



                messagesContainerStyle={{


                    //height: "100%",
                    position: "relative",
                    //    backgroundColor: "lightgray",
                    transform: [{ translateY: -getStatusBarHeight() - keyboardHeight - toolBarHeight + 60 }],

                    height: height - HEADER_HEIGHT - HEADER_HEIGHT - BOTTOM_HEIGHT,
                    // backgroundColor: "brown",

                    marginEnd: 0,
                }}



                renderMessage={function (props) {

                    const currentMessage = props.currentMessage
                    if (currentMessage.video) { return }


                    //  return <View style={[messageBlockStyle]}><MessageBlock {...props} /></View>
                    return <MessageBlock {...props} />
                }}
                renderAvatar={function (props) {

                    return (
                        <AnimatedComponent entering={ZoomIn.duration(200)}>


                            <AvatarIcon {...props}
                                onPressAvatar={function () {

                                    console.log("avatar pressed")
                                }}

                                containerStyle={{
                                    left: {
                                        marginRight: 0,
                                        marginTop: 0,
                                        alignSelf: "flex-start",
                                        //backgroundColor: "pink",
                                        //transform: [{ scale: 0.8 }],
                                        //backgroundColor: bgColor,//"pink",
                                        padding: 0,
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        //borderRadius: 1000,
                                    },
                                    right: {
                                        marginRight: 0,
                                        marginTop: 0,
                                        alignSelf: "flex-start",
                                        //backgroundColor: "pink",
                                        padding: 0,
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start"
                                    }
                                }}
                            />


                        </AnimatedComponent>
                    )
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

                renderMessageAudio={function (props) {
                    return <AudioBlock {...props} />
                }}

                renderInputToolbar={function (props) {

                    return (



                        <InputToolbar {...props}
                            containerStyle={{

                                // opacity: 0.5,
                                backgroundColor: "skyblue",
                                marginVertical: 0,
                                height: toolBarHeight
                            }}

                            primaryStyle={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                display: "flex",
                                justifyContent: "flex-start",
                                //     backgroundColor: bgColor,
                                width,

                                padding: 0,
                                paddingHorizontal: 0,
                            }}
                        //  accessoryStyle={{ backgroundColor: "orange", width:200,   height: 60,     }}

                        />






                    )



                }}

                renderComposer={function (props) {


                    return (
                        <View style={{ width: width - 120, overflow: "hidden", flexDirection: "row" }}>
                            <PanGestureHandler onGestureEvent={backGesture}>
                                <View style={[micBarStyle]}>
                                    <Text style={[releasedStyle]}>Hold to talk</Text>


                                    <View style={[onHoldStyle]}>
                                        <LinearProgress style={{ height: 60, width: width - 120 }} color="#aaa" />

                                        <Text style={{
                                            fontSize: 20,
                                            color: "#666",
                                            position: "absolute",
                                            textAlign: "center",
                                        }}>Move up to cancel</Text>

                                    </View>

                                </View>
                            </PanGestureHandler>


                            <Composer {...props}

                                disableComposer={false}
                                textInputProps={{
                                    ref: function (element) { inputRef.current = element },
                                    numberOfLines: Math.min([...inputText.current].filter(c => c === "\n").length + 1, 5),
                                    style: {
                                        backgroundColor: "white", minHeight: 60, width: width - 120, paddingHorizontal: 8, fontSize: 20, lineHeight: 25,
                                        elevation: 5,
                                    },
                                    onPressIn: function () {
                                        inputRef.current.blur(); inputRef.current.focus(); //expandWidth.value = 50;

                                    },
                                    onLayout: function (e) {

                                    }

                                }}

                            />

                        </View>
                    )
                }}

                onInputTextChanged={function (text) {


                    //  if ([...inputText.current].filter(c => c === "\n").length !== [...text.current].filter(c => c === "\n")) {
                    // const handle = findNodeHandle(inputRef.current);
                    // //  console.log(handle)
                    // handle && UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

                    //     console.log(compoHeight)
                    // })
                    //     }
                    inputText.current = text
                    //  console.log(inputText.current)

                }}


                shouldUpdateMessage={function (props, nextProps) {

                    // console.log("---", Date.now(), nextProps.currentMessage.text)
                    // return false

                    // return Boolean(props.currentMessage.text)
                    return true
                }}

                renderSend={function (props) {

                    return (

                        <View style={{ backgroundColor: "yellow", width: 60, height: 60, position: "relative" }}>
                            <AnimatedComponent entering={SlideInRight.duration(300)} exiting={SlideOutRight.duration(300)}
                                style={{ backgroundColor: "pink", position: "absolute", width: 60, height: 60, }}>
                                <Send {...props} sendButtonProps={{
                                    style: {
                                        backgroundColor: "green",
                                        width: 60, height: 60,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }
                                }}>
                                    <Icon
                                        name='send'
                                        type='ionicon'
                                        color='#517fa4'
                                        size={40}
                                        containerStyle={{
                                            // width: 60, height: 60,
                                            // backgroundColor: "green",

                                            // alignItems: "center",
                                            // justifyContent: "center",

                                        }}
                                    />
                                </Send>
                            </AnimatedComponent>
                            {!inputText.current && <AnimatedComponent entering={SlideInRight.duration(300)} exiting={SlideOutRight.duration(300)}
                                style={{ backgroundColor: "brown", position: "absolute", }}>
                                <Icon
                                    name='add-circle-outline'
                                    type='ionicon'
                                    color='#517fa4'
                                    size={50}
                                    containerStyle={{
                                        width: 60, height: 60,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onPress={function () {
                                        setToolBarHeight(pre => pre === 60 ? 120 : 60)
                                    }}

                                />
                            </AnimatedComponent>}
                        </View>

                    )
                }}
                onSend={function (msg) {


                    setMessages(pre => [...pre, ...msg])
                }}

                renderAccessory={function (props) {
                    return (
                        <AnimatedComponent style={{
                            backgroundColor: "orange",
                            height: 60,
                            width,
                            display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"
                        }}
                            onLayout={function (e) {
                                //   console.log("bottomBar", e.nativeEvent.layout)
                            }}
                        >


                            <Icon

                                name="image-outline"
                                type='ionicon'
                                color='#517fa4'
                                size={50}
                            />

                            <Icon
                                name="camera-outline"
                                type='ionicon'
                                color='#517fa4'
                                size={50}
                            />

                        </AnimatedComponent>
                    )
                }}
                renderActions={function (props) {


                    return <Actions {...props}
                        containerStyle={{
                            backgroundColor: bgColor,
                            width: 60, height: 60, marginLeft: 0, marginBottom: 0, marginRight: 0,
                            alignItems: "center",
                            justifyContent: "center"
                        }}

                        //replaced by icon={function...
                        // wrapperStyle={{
                        // }}


                        icon={function () {

                            return <Icon

                                name="mic-outline"
                                type='ionicon'
                                color='#517fa4'
                                size={50}
                            />
                        }}
                    />
                }}

                onPressActionButton={function (props) {
                    micBarWidth.value = micBarWidth.value === 0 ? width - 120 : 0

                }}

            />
        </>
    )

}


function MessageBlock({ ...props }) {

    return (
        <View style={{ backgroundColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16) }}>
            <Message {...props} />
        </View>

    )
}


function BubbleBlock({ ...props }) {


    const currentMessage = props.currentMessage
    const name = props.currentMessage.user.name
    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
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
                        backgroundColor: bgColor,
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
        <>
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

                        <Icon name="arrow-down-circle-outline" type='ionicon' color='white' size={50} style={{ padding: 4 }}

                            onPress={async function () {

                                setVisible(false)
                                const uri = currentImage
                                const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`

                                const downloadResumable = FileSystem.createDownloadResumable(uri, fileUri, { headers: { token: "hihihi" } },);

                                const { status } = await downloadResumable.downloadAsync(uri, fileUri, { headers: { token: "hihihi" } }).catch(e => { console.log(e) })

                                if (status == 200) {
                                    const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
                                    if (!granted) { setBtnText("100%"); return }

                                    const asset = await MediaLibrary.createAssetAsync(fileUri).catch(e => { console.log(e) });
                                    let album = await MediaLibrary.getAlbumAsync('expoDownload').catch(e => { console.log(e) });

                                    if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, false).catch(e => { console.log(e) }); }
                                    else {
                                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).catch(e => { console.log(e) });
                                    }
                                    await FileSystem.deleteAsync(fileUri, { idempotent: true })

                                }
                                else { alert("server refuse to send"); }


                            }}
                        />
                        <Icon name="trash-outline" type='ionicon' color='white' style={{ padding: 4 }} size={50} />

                    </AnimatedComponent>
                </Overlay>


            </Pressable>



        </>
    )



}

function AudioBlock({ ...props }) {

    // console.log(props)

    return <Text>AudioBlock</Text>

}

// FileSystem.readDirectoryAsync(FileSystem.cacheDirectory).then(data => {
//     data.forEach(filename_ => {
//         console.log("=cacheDirctory==" + filename_)
//         // FileSystem.getInfoAsync(FileSystem.documentDirectory+filename_,{md5:false,size:true}).then(info=>{
//         //     console.log(info)
//         // })
//          FileSystem.deleteAsync(FileSystem.cacheDirectory + filename_, { idempotent: true })
//     })
// })


// FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(data => {
//     data.forEach(filename_ => {
//         console.log("=documentDirctory==" + filename_)
//         // FileSystem.getInfoAsync(FileSystem.documentDirectory+filename_,{md5:false,size:true}).then(info=>{
//         //     console.log(info)
//         // })
//           FileSystem.deleteAsync(FileSystem.documentDirectory + filename_, { idempotent: true })
//     })

// })






function callStartRecording() {
    startRecording()
    // console.log(FileSystem.cacheDirectory)


    // FileSystem.readDirectoryAsync(FileSystem.cacheDirectory+"Audio").then(data => {
    //     data.forEach(filename_ => {
    //          console.log(Date.now() + "=cached audio==***===" + filename_)
    //          FileSystem.deleteAsync(FileSystem.cacheDirectory+"/Audio/" + filename_, { idempotent: true })
    //     })

    // })

}



function callStopRecording() {
    stopRecording()

    //FileSystem.documentDirectory
}

function startRecording() {
    recording = new Audio.Recording()

    Audio.requestPermissionsAsync()
        .then((info) => {
            //  console.log("permissions", info)
            if (info.granted) {
                return recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            }
            else {
                return Promise.reject("recording permissions denied")
            }

        })
        .then(info => {

            // console.log("about to record", info)

            if (info.canRecord && (!info.isRecording)) {
                return recording.startAsync()
            }
            else {
                return Promise.reject("cannot start recording")
            }

        })
        .then(info => {
            return info
        })
        .catch(err => {
            console.log("error in startRecording promise ==>")
        })
}

function stopRecording() {

    let uri = ""
    let audioName = ""
    let audioFolder = ""
    let audioUri = ""
    let durationMillis = ""
    let time = ""
    let audioMsg = ""
    console.log("stop recording")
    recording.getStatusAsync()
        .then(info => {

            //     console.log("about to stop Recording", info)
            if (info.isRecording) {

                return recording.stopAndUnloadAsync()
            }
            else {

                //     recording.stopAndUnloadAsync()
                return Promise.reject(info)
            }
        })
        .then(info => {
            //     console.log("recording stopped", info)
            if (info.isDoneRecording) {
                durationMillis = info.durationMillis
                uri = recording.getURI();

                audioName = uri.replace(/^.*[\\\/]/, '')
                //    audioFolder = FileSystem.documentDirectory + "Audio/" + item.name + "/"
                audioFolder = FileSystem.documentDirectory
                audioUri = audioFolder + audioName

                recording = new Audio.Recording()
                console.log(uri, audioUri)
                return FileSystem.moveAsync({ from: uri, to: audioUri })
            }
            else {
                //   recording.stopAndUnloadAsync()
                return Promise.reject(info)
            }


        })


        // .then(() => {

        //     time = Date.now()
        //     audioMsg = {
        //         _id: time,
        //         text: '',
        //         createdAt: new Date(),
        //         createdTime: time,
        //         user: { _id: userName },
        //         sender: userName,
        //         audio: audioUri,
        //         audioName: audioName,


        //         durationMillis: durationMillis,
        //         toPerson: item.name,
        //     }

        //     canMoveDown.current = true
        //     setMessages(pre => {
        //         if (pre.length >= 20) {
        //             previousMessages.current = previousMessages.current.concat(pre.slice(0, pre.length - 10))
        //             if (!shouldDisplayNotice && (previousMessages.current.length > 0)) { setShouldDisplayNotice(true) }
        //             return GiftedChat.prepend(pre.slice(-10), { ...audioMsg, isLocal: true })
        //         }
        //         else {
        //             return GiftedChat.prepend(pre, { ...audioMsg, isLocal: true })
        //         }
        //     })


        //     const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
        //     const fileUri = folderUri + item.name + "---" + audioMsg.createdTime
        //     FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...audioMsg, isLocal: true }))
        //     latestChattingMsg.current = audioMsg

        //     return uploadAudio({ localUri: audioUri, filename: audioName || Date.now() + ".m4a", sender: userName, toPerson: item.name, durationMillis })

        // })
        // .then(response => {
        //     //   console.log(ExponentAV)
        //     socket.emit("sendMessage", {
        //         sender: userName, toPerson: item.name,
        //         msgArr: [{ ...audioMsg, sender: userName, mongooseID: response.data.mongooseID }]
        //     })

        //     //console.log(recording._cleanupForUnloadedRecorder)

        // })
        .catch(err => {
            console.log("cannot stop recording", err)
            // if (err.message.includes("Stop encountered an error: recording not stopped")) {
            //   await ExponentAV.unloadAudioRecorder();
            //   await recordRef.current._cleanupForUnloadedRecorder({ durationMillis: 0 } as any);
            // } else {
            //   await handleError(e, { userMessage: "An error occurred stopping the recording." });
            // }

            recording._cleanupForUnloadedRecorder({
                canRecord: false,
                durationMillis: 0,
                isRecording: false,
                isDoneRecording: false,
            });


            recording = new Audio.Recording()
        })




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







const useKeyboardHeight = function (platforms = ['ios', 'android']) {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
        if (isEventRequired(platforms)) {
            const listen1 = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
            const listen2 = Keyboard.addListener('keyboardDidHide', keyboardDidHide); // cleanup function

            return () => {
                // Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
                // Keyboard.removeListener('keyboardDidHide', keyboardDidHide);

                listen1.remove()
                listen2.remove()
            };
        } else {
            return () => { };
        }
    }, []);

    const isEventRequired = platforms => {
        try {
            return (platforms === null || platforms === void 0 ? void 0 : platforms.map(p => p === null || p === void 0 ? void 0 : p.toLowerCase()).indexOf(Platform.OS)) !== -1 || !platforms;
        } catch (ex) { }

        return false;
    };

    const keyboardDidShow = frames => {
        setKeyboardHeight(frames.endCoordinates.height);
    };

    const keyboardDidHide = () => {
        setKeyboardHeight(0);
    };

    return keyboardHeight;
};

//export default useKeyboardHeight;