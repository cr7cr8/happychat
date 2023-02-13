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
    SlideOutRight,
    SlideOutUp,
    SlideOutDown,
    Layout

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
    Actions
} from 'react-native-gifted-chat'
import { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, createFolder, deleteFolder } from "./config";
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
import axios from 'axios';
import { OverlayDownloader } from './OverlayDownloader';
import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
const { View, Text, ScrollView: ScrollV, Extrapolate, createAnimatedComponent, Image: ImageV } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)
let recording = new Audio.Recording();
let audioSound = new Audio.Sound();


export function ChatScreen() {

    const navigation = useNavigation()
    const route = useRoute()

    const { name, hasAvatar, randomStr = Math.random(), localImage = null } = route.params
    const showSnackBar = useContextSelector(Context, (state) => (state.showSnackBar));
    const userName = useContextSelector(Context, (state) => (state.userName))
    const url = useContextSelector(Context, (state) => (state.serverAddress))

    const socket = useContextSelector(Context, (state) => (state.socket))

    const avatarString = multiavatar(name)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
    const HEADER_HEIGHT = useHeaderHeight()



    const scrollRef = useRef()
    const inputText = useRef("1\n2\n3\n4\n5\n6")
    const inputRef = useRef()


    const keyboardHeight = useKeyboardHeight()



    const [accessoryBarHeight, setAccessoryBarHeight] = useState(0)

    const micBarWidth = useSharedValue(0)
    const micBarStyle = useAnimatedStyle(() => ({
        zIndex: 800, width: withTiming(micBarWidth.value), position: "relative", justifyContent: "center", alignItems: "center",
        height: 60, backgroundColor: bgColor, top: 0,
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
            justifyContent: "center",
            backgroundColor: "red"
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

            if ((Math.abs(obj.translationY) < 60) && (Math.abs(obj.translationX) < 60) && (isReleased.value === 0)) {
                runOnJS(callStopRecording)(name)
            }
            // else if ((obj.translationX < -60) && (isReleased.value === 0)) {
            //     runOnJS(callCancelRecording)()
            //     micBarWidth.value = 0
            // }
            else {// else if ((obj.translationY >= -60) && (isReleased.value === 0)) {
                runOnJS(callCancelRecording)()
            }


            isReleased.value = 1
        }

    })


    // const [messages, setMessages] = useState([
    //     {
    //         _id: Math.random(),
    //         text: "1",
    //         createdAt: new Date(222222222222),
    //         user: {
    //             _id: userName,
    //             name: userName,

    //         }
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "11115555",
    //         createdAt: new Date(222228222822),
    //         user: {
    //             _id: userName,
    //             name: userName,

    //         }
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         audio: "audio",
    //         createdAt: new Date(222228222822),
    //         user: {
    //             _id: userName,
    //             name: userName,

    //         }
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         audio: "audio",
    //         createdAt: new Date(222228222822),
    //         user: {
    //             _id: name,
    //             name: name,

    //         }
    //     },
    //     {
    //         _id: Math.random(),
    //         text: '2',
    //         createdAt: new Date(),

    //         user: {
    //             _id: name,
    //             name: name,
    //         },
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         createdAt: new Date(),
    //         image: "https://picsum.photos/100/200",

    //         user: {
    //             _id: name,
    //             name: name,
    //         },
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         createdAt: new Date(),
    //         image: "https://picsum.photos/200/400",

    //         user: {
    //             _id: userName,
    //             name: userName,
    //         },
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         createdAt: new Date(),
    //         image: "https://picsum.photos/500/300",

    //         user: {
    //             _id: name,
    //             name: name,
    //         },
    //     },
    //     {
    //         _id: Math.random(),
    //         text: '222522222',
    //         createdAt: new Date(),

    //         user: {
    //             _id: name,
    //             name: name,
    //         },
    //     },
    //     {
    //         _id: Math.random(),
    //         text: "",
    //         createdAt: new Date(),
    //         image: "https://picsum.photos/620/300",

    //         user: {
    //             _id: userName,
    //             name: userName,
    //         },
    //     },
    //     // {
    //     //     _id: Math.random(),
    //     //     text: "glrgfl;rekglglrgfl;rekglkrgodkfg",
    //     //     createdAt: new Date(222228222822),
    //     //     user: {
    //     //         _id: userName,
    //     //         name: userName,
    //     //     }
    //     // },
    // ]
    //     .map(item => {

    //         return {
    //             ...item,
    //             user: {
    //                 ...item.user,
    //                 avatar: () => (<SvgUri style={{ position: "relative" }} width={36} height={36} svgXmlData={multiavatar(item.user.name)} />)
    //             }
    //         }


    //     })
    // )
    const canMoveDown = useRef(true)
    const scrollDepth = useRef(999999)
    const allMessages = useRef([])
    const [messages, setMessages] = useState([])
    //initialzing messages
    useEffect(function () {



        const folderUri = FileSystem.documentDirectory + "MessageFolder/" + name + "/";
        FileSystem.readDirectoryAsync(folderUri).then(data => {

            const messageHolder = []

            data.forEach(filename => {


                messageHolder.push(
                    FileSystem.readAsStringAsync(folderUri + filename).then(content => JSON.parse(content))
                )
            })


            Promise.all(messageHolder).then(contentArr => {

                canMoveDown.current = true
                setMessages(pre => {


                    contentArr.sort((msg1, msg2) => msg1.createdTime - msg2.createdTime)

                    const msg10 = contentArr.pop();
                    const msg9 = contentArr.pop();
                    const msg8 = contentArr.pop();
                    const msg7 = contentArr.pop();
                    const msg6 = contentArr.pop();
                    const msg5 = contentArr.pop();
                    const msg4 = contentArr.pop();
                    const msg3 = contentArr.pop();
                    const msg2 = contentArr.pop();
                    const msg1 = contentArr.pop();



                    allMessages.current = contentArr

                    return GiftedChat.prepend([], uniqByKeepFirst([msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10].filter(msg => Boolean(msg)),
                        function (msg) { return msg._id }))
                })

            })
        })
    }, [])

    //displaying messages
    useEffect(() => {

        socket.on("displayMessage" + name, function (msgArr) {
            // todo

            // console.log("displaying message ================", msgArr)

            const msg = msgArr[0]
            // hasAvatar
            //     ? msg.avatar = () => (
            //         <ImageV source={{ uri: `${url}/api/image/avatar/${name}?${randomStr}` }} resizeMode="cover"
            //             style={{ position: "relative", width: 40, height: 40, borderRadius: 1000 }} />
            //     )
            //     : msg.avatar = () => (<SvgUri style={{ position: "relative", }} width={40} height={40} svgXmlData={multiavatar(name)} />)

            // console.log(`${url}/api/image/avatar/${name}?${randomStr}`)

            canMoveDown.current = true
            setMessages(pre => {
                return GiftedChat.prepend(pre, msg)
            })


        })

        return function () {
            socket.off("displayMessage" + name)
        }


    }, [])



    return (
        <>

            <View style={{
                position: "absolute", display: "flex", justifyContent: "center", alignItems: "center",
                transform: [{ translateY: -HEADER_HEIGHT }],
                backgroundColor: bgColor, width,
                flexDirection: "row", height: HEADER_HEIGHT,
                zIndex: 100
            }}>


                <SharedElement id={name}  >
                    {hasAvatar
                        ? <ImageV source={{ uri: localImage || `${url}/api/image/avatar/${name}?${randomStr}` }} resizeMode="cover"
                            style={{ margin: 10, width: 40, height: 40, transform: [{ translateY: 6 }, { translateX: 0 }], borderRadius: 1000 }}
                        />
                        : <SvgUri style={{
                            margin: 10,
                            transform: [{ translateY: 6 }, { translateX: 0 }]

                        }} width={40} height={40} svgXmlData={multiavatar(name)} />
                    }
                </SharedElement>


                <Text style={{ fontSize: 15, color: "black", transform: [{ translateY: 6 }, { translateX: 0 }] }}>{name}</Text>
            </View>

            <GiftedChat

                user={{ _id: userName }}
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
                    onContentSizeChange: (contentWidth, contentHeight) => {
                        //   console.log(contentWidth, contentHeight)
                        scrollDepth.current = contentHeight
                        canMoveDown.current && scrollRef.current.scrollToEnd({ animated: true })
                    },
                    onScroll: function (e) {

                        //  console.log(e.nativeEvent.contentOffset.y + height - HEADER_HEIGHT - 60, scrollDepth.current)

                        if ((e.nativeEvent.contentOffset.y === 0) && allMessages.current.length === 0) {
                            // console.log("no more left")
                            showSnackBar("All loaded")
                            return
                        }

                        else if (e.nativeEvent.contentOffset.y === 0) {
                            const msg10 = allMessages.current.pop();
                            const msg9 = allMessages.current.pop();
                            const msg8 = allMessages.current.pop();
                            const msg7 = allMessages.current.pop();
                            const msg6 = allMessages.current.pop();
                            const msg5 = allMessages.current.pop();
                            const msg4 = allMessages.current.pop();
                            const msg3 = allMessages.current.pop();
                            const msg2 = allMessages.current.pop();
                            const msg1 = allMessages.current.pop();

                            canMoveDown.current = false
                            setMessages(pre => {
                                canMoveDown.current = false
                                return GiftedChat.append(messages, uniqByKeepFirst([msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10].filter(msg => Boolean(msg)),
                                    function (msg) { return msg._id }))
                            })

                        }
                        else if ((e.nativeEvent.contentOffset.y + height - HEADER_HEIGHT - 60) >= (scrollDepth.current - 1)) {
                            //console.log("end reached", scrollDepth.current)
                            if (messages.length > 10) {
                                //console.log(messages.length - 10)

                                canMoveDown.current = false
                                setMessages(pre => {
                                    allMessages.current = [...allMessages.current, ...pre.slice(0, -10)]
                                    return pre.slice(-10)
                                })
                            }

                        }
                    },




                    //  if (canMoveDown.current) {
                    //  scrollRef.current.scrollToOffset({ offset: 9999, animated: true })

                    //  }

                    contentContainerStyle: { flexGrow: 1, justifyContent: keyboardHeight ? "flex-end" : 'flex-start', paddingTop: getStatusBarHeight() >= 24 ? 50 : 0 }
                }}



                messagesContainerStyle={{

                    flexGrow: 1, justifyContent: 'flex-end',

                    // paddingTop: keyboardHeight + (getStatusBarHeight() >= 24 ? 50 : 0),

                    //height: "100%",
                    position: "relative",
                    //    backgroundColor: "lightgray",
                    //  transform: [{ translateY: -getStatusBarHeight() - keyboardHeight - toolBarHeight + 60 }],

                    height: height - HEADER_HEIGHT - 60,


                    transform: [{ translateY: -getStatusBarHeight() - keyboardHeight - accessoryBarHeight - (getStatusBarHeight() >= 24 ? 45 : 0) }],
                    // transform: [{ translateY: -getStatusBarHeight() - keyboardHeight - accessoryBarHeight }],
                    // backgroundColor: "#faa",

                    //   marginEnd: 0,
                }}



                renderMessage={function (props) {

                    const currentMessage = props.currentMessage
                    if (currentMessage.video) { return }


                    //  return <View style={[messageBlockStyle]}><MessageBlock {...props} /></View>
                    return (



                        <MessageBlock {...props} />

                    )

                }}
                // renderAvatar={function (props) {

                //     const currentMessage = props.currentMessage
                //     const { sender, toPerson } = currentMessage




                //     return (
                //         <Pressable onPress={function () { console.log("avatar pressed") }}>
                //             <View style={{backgroundColor:"skyblue",width:40,height:40}}>
                //             {hasAvatar
                //                 ? <ImageV source={{ uri: `${url}/api/image/avatar/${sender}?${randomStr}` }} resizeMode="cover"
                //                     style={{ position: "relative", width: 40, height: 40, borderRadius: 1000 }} />
                //                 : <SvgUri style={{ position: "relative", }} width={40} height={40} svgXmlData={multiavatar(sender)} />
                //             }
                //             </View>
                //         </Pressable>
                //     )


                // }}
                renderAvatar={null}
                renderBubble={function (props) {

                    return (
                        <BubbleBlock  {...props} userName={userName} hasAvatar={hasAvatar} randomStr={randomStr} url={url} />
                    )
                }}
                renderTime={function (props) {
                    const currentMessage = props.currentMessage



                    return <Time {...props}

                        timeFormat="H:mm:ss"
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
                    return <TextBlock {...props} canMoveDown={canMoveDown} setMessages={setMessages} name={name} />
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
                                //    backgroundColor: "skyblue",
                                backgroundColor: bgColor,
                                marginVertical: 0,
                                //  height: toolBarHeight
                                minHeight: 60
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
                            accessoryStyle={{
                                // backgroundColor: "orange",
                                width,
                                height: accessoryBarHeight ? 45 : 0,
                            }}
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
                                        <LinearProgress style={{ height: 40, width: width - 120 }} color="#aaa" />

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
                                    //numberOfLines: Math.min([...inputText.current].filter(c => c === "\n").length + 1, 5),
                                    style: {
                                        minHeight: 60,
                                        backgroundColor: "white", width: width - 120, paddingHorizontal: 8, fontSize: 20, lineHeight: 25,
                                        elevation: 5,
                                        // transform:[{translateY:-50}],
                                        // zIndex:999
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
                    inputText.current = text
                }}

                shouldUpdateMessage={function (props, nextProps) {
                    //    console.log(props.currentMessage.text, nextProps.currentMessage.text)

                    return false
                }}

                renderSend={function (props) {

                    return (

                        <View style={{ backgroundColor: "yellow", width: 60, height: 60, position: "relative" }}>
                            <AnimatedComponent entering={SlideInRight.duration(300)} exiting={SlideOutRight.duration(300)}
                                style={{ backgroundColor: bgColor, position: "absolute", width: 60, height: 60, }}>
                                <Send {...props} sendButtonProps={{
                                    style: {
                                        //backgroundColor: "green",
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
                                style={{ backgroundColor: bgColor, position: "absolute", }}>
                                <Icon
                                    name={accessoryBarHeight === 0 ? 'add-circle-outline' : 'remove-circle-outline'}
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
                                        setAccessoryBarHeight(pre => pre === 0 ? 45 : 0)
                                    }}

                                />
                            </AnimatedComponent>}
                        </View>

                    )
                }}
                onSend={function (msgArr) {
                    const msg = msgArr.map(msg => { return { ...msg, createdTime: Date.parse(msg.createdAt), sender: userName, toPerson: name } })[0]


                    if (!msg.image && !msg.audio && !msg.video && msg.text.match(/^[\s]*$/g)) {
                        return Keyboard.dismiss()
                    }

                    writeMsg(name, userName, msg)

                    canMoveDown.current = true
                    setMessages(preMessages => {
                        return GiftedChat.prepend(preMessages, [msg])
                    })


                    if (userName !== name) {
                        socket.emit("sendMessage",
                            {
                                sender: userName,
                                toPerson: name,
                                msgArr: msgArr.map(msg => { return { ...msg, createdTime: Date.parse(msg.createdAt), sender: userName, toPerson: name } })
                            })
                    }
                    // console.log(messages_)
                }}

                renderAccessory={function (props) {

                    return (


                        <View style={{
                            //   backgroundColor: "orange",
                            height: 45,
                            width,
                            display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start"
                        }}
                        // entering={SlideInDown}
                        // exiting={SlideOutDown}
                        >


                            <Icon

                                name="image-outline"
                                type='ionicon'
                                color='#517fa4'
                                size={45}
                            />

                            <Icon
                                name="camera-outline"
                                type='ionicon'
                                color='#517fa4'
                                size={45}
                            />

                        </View>
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

            // onLoadEarlier={function () {
            //     console.log("loading early")
            // }}
            // loadEarlier={true}
            // isLoadingEarlier={false}
            // renderLoadEarlier={function (props) {
            //     // return <></>
            //    // console.log(props.isLoadingEarlier)
            //     return <View style={{ backgroundColor: "skyblue" }}><Text>load messages</Text></View>
            // }}

            />
        </>
    )

}


function MessageBlock({ ...props }) {

    return (
        <Message {...props} />
    )

    return (
        <View style={{
            backgroundColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),

        }}>
            <Message {...props} />
        </View>
    )
}

function BubbleBlock({ userName, hasAvatar, randomStr, url, ...props }) {


    const currentMessage = props.currentMessage
    const previousMessage = props.previousMessage
    //    console.log(Object.keys(previousMessage).length)
    const preSender = previousMessage?.sender
    const sender = currentMessage.sender

    const avatarString = multiavatar(sender)
    const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))

    return (


        <View style={{ flexDirection: "row", margin: 0, padding: 0, }}>
            {preSender !== sender && userName !== sender &&

                <View style={{ width: 40, height: 40, marginRight: 8, justifyContent: "flex-start", alignItems: "flex-start" }}>
                    {hasAvatar
                        ? <ImageV source={{ uri: `${url}/api/image/avatar/${sender}?${randomStr}` }} resizeMode="cover"
                            style={{ position: "relative", width: 40, height: 40, borderRadius: 1000 }} />
                        : <SvgUri style={{ position: "relative", }} width={40} height={40} svgXmlData={multiavatar(sender)} />
                    }
                </View>

            }
            {preSender === sender && userName !== sender &&
                <View style={{ width: 40, height: 40, marginRight: 8, justifyContent: "flex-start", alignItems: "flex-start" }} />

            }
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
                onLongPress={function () { }}
            />
        </View>
    )

}

function TextBlock({ canMoveDown, setMessages, name, ...props }) {

    const viewRef = useAnimatedRef()

    const currentMessage = props.currentMessage
    const [visible, setVisible] = useState(false)
    const [top, setTop] = useState(60)
    const [left, setLeft] = useState(0)
    // const showOverLayText = useContextSelector(Context, (state) => (state.showOverLayText));
    return (

        <Pressable ref={function (element) { viewRef.current = element }}
            onLongPress={function () {
                Vibration.vibrate(50);
                const handle = findNodeHandle(viewRef.current);
                UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {
                    //console.log(fx, fy, compoWidth, compoHeight, px, py)
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
                    <Icon name="trash-outline" type='ionicon' color='white' style={{ padding: 4 }} size={50} onPress={function () {

                        canMoveDown.current = false
                        setTimeout(() => {
                            setMessages(pre => {

                                return Array.from(pre).filter(msg => msg._id !== currentMessage._id)

                            })
                        }, 0);



                        deleteMsg(name, currentMessage)





                    }} />

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

    const showSnackBar = useContextSelector(Context, (state) => (state.showSnackBar));
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
                    Vibration.vibrate(50);
                    const handle = findNodeHandle(viewRef.current);
                    UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {
                        //    console.log(fx, fy, compoWidth, compoHeight, px, py)
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
                                const fileName = Date.now()
                                const fileUri = `${FileSystem.documentDirectory}${fileName}.jpg`

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
                                    showSnackBar(fileName + ".jpg downloaded")
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

///////////////////////////////////////////////////

function readMsg(name) {


}


function writeMsg(name, userName, msg) {
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + name + "/"
    const fileUri = folderUri + name + "---" + msg.createdTime

    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...msg, isLocal: true }))

    //console.log(fileUri)
}

function deleteMsg(name, currentMessage) {

    const fileUri = FileSystem.documentDirectory + "MessageFolder/" + name + "/" + name + "---" + currentMessage.createdTime

    FileSystem.deleteAsync(fileUri, { idempotent: true })


}
/////////////////////////////////////////////////

function attachAvatar(userName, msg) {




}



///////////////////////////////////////////////////

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
function callStopRecording(name) {
    console.log("call stop recording", name)
    stopRecording(name)

    //FileSystem.documentDirectory
}
function callCancelRecording() {
    cancelRecording()
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
function stopRecording(name) {

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
                audioFolder = FileSystem.documentDirectory + "Audio/" + name + "/"
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
function cancelRecording() {
    console.log('Cancel recording..');


    recording.getStatusAsync()
        .then(info => {

            ////     console.log("about to cancel Recording", info)
            if (info.isRecording) {
                return recording.stopAndUnloadAsync()
            }
            else {
                //recording = new Audio.Recording()
                return Promise.reject(info)
            }
        })
        .then(info => {
            //    console.log("recording cancelled", info)
            if (info.isDoneRecording) {
                // const durationMillis = info.durationMillis
                const uri = recording.getURI();
                //      console.log("cancel uri===>>>>>>>>",uri)

                FileSystem.deleteAsync(uri, { idempotent: true }).then(() => {

                    //      console.log("caneled file deleted ")
                })



            }
            else {
                //  recording = new Audio.Recording()
                return Promise.reject(info)
            }
        })
        .catch(err => {
            console.log("cancel recording error")
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


// FileSystem.readDirectoryAsync(FileSystem.cacheDirectory).then(data => {
//     data.forEach(filename_ => {
//       //  console.log("=cacheDirctory==" + filename_)
//         FileSystem.getInfoAsync(FileSystem.cacheDirectory + filename_, { md5: false, size: true }).then(info => {
//                console.log(info.uri)
//         })
//      //   FileSystem.deleteAsync(FileSystem.cacheDirectory + filename_, { idempotent: true })
//     })
// })


// FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(data => {
//     data.forEach(filename_ => {
//       //  console.log("=documentDirctory==" + filename_)
//         FileSystem.getInfoAsync(FileSystem.documentDirectory + filename_, { md5: false, size: true }).then(info => {
//                console.log(info.uri) 
//         })
//      //   FileSystem.deleteAsync(FileSystem.documentDirectory + filename_, { idempotent: true })
//     })

// })





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