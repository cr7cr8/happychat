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

import { Overlay } from 'react-native-elements/dist/overlay/Overlay';



import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { Context } from "./ContextProvider"
import { createContext, useContextSelector } from 'use-context-selector';
import { useNavigation } from '@react-navigation/native';
import {
    GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage,
    Actions,
} from 'react-native-gifted-chat'

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
const { View, Text, Image, ScrollView: ScrollV, Extrapolate, createAnimatedComponent } = ReAnimated

const AnimatedComponent = createAnimatedComponent(View)




export function ChatScreen({ }) {

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
            text: "imageBlock, should be image",
            createdAt: new Date(),
            image: "https://picsum.photos/200/300",

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
            text: "11115555fdsfewfkwelfkl;ewkgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrgfl;rekglrekgl krek;'l ;lerktl;kl;gkdl;gkerokgo pgkrel;kg; g;ldfkg fdkgl;fdkgeoprkgpoekrgodkfg",
            createdAt: new Date(222228222822),
            user: {
                _id: userName,
                name: userName,

            }
        },


    ])

    return (
        <>

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
                    //console.log(msg)
                    setMessages(pre => [...pre, ...msg])
                }}

                renderMessage={function (props) {
                    const currentMessage = props.currentMessage
                    if (currentMessage.video) { return }
                    return <MessageBlock outerProps={props} currentMessage={currentMessage} />
                }}

                renderBubble={function (props) {
                    //  console.log(props.currentMessage)
                    return (
                        <BubbleBlock {...props} />
                    )
                }}
                renderTime={function (props) {
                    const currentMessage = props.currentMessage
                    //console.log(currentMessage)
                    //console.log(props.currentMessage.createdAt)


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
                    return <MessageText {...props}
                        textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }} />
                }}
                renderMessageImage={function (props) {
                    const currentMessage = props.currentMessage
                    const imageMessageArr = messages.filter(message => Boolean(message.image)).map(msg => { return { ...msg, user: { ...msg.user, avatar: "" } } })

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
    const viewRef = useAnimatedRef()
    const [visible, setVisible] = useState(false)
    const [top, setTop] = useState(60)
    const [left, setLeft] = useState(0)


    return (

        <AnimatedComponent entering={ZoomIn.duration(200)}
            style={{ backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) }}
            ref={function (element) { viewRef.current = element }}
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

                    const handle = findNodeHandle(viewRef.current);
                    UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

                        // if ((py - 18 + (compoHeight - 9) / 2) >= (height / 2)) {
                        //     setTop(Math.max(py - 72, 0))
                        // }
                        // else {
                        //     setTop(Math.min(height - 132, py - 18 + compoHeight))
                        // }




                        console.log(py)
                        setLeft(px)
                        setTop(Math.max(0, py - STATUS_HEIGHT - 60))
                        setVisible(true)
                    })
                    // setTimeout(() => { setVisible(true) }, 10);

                }}

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
                    borderRadius:8
                }}>

                    <Icon name="copy-outline" type='ionicon'
                        color='white'
                        size={50}
                        style={{ padding: 4 }}
                    />

                    <Icon
                        name="trash-outline"
                        type='ionicon'
                        color='white'
                        style={{ padding: 4 }}
                        size={50} />


                </AnimatedComponent>
            </Overlay>



        </AnimatedComponent>





    )

}

function ImageBlock({ ...props }) {


}





function OverlayCompo({ token, visible, top, left, setVisible, currentMessage, isText, isImage, isAudio, setMessages, userName, item, canMoveDown, ...props }) {




    const viewStyle = useAnimatedStyle(() => {


        return {

            width: 100,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "gray",
            // transform: [{ scale: withTiming(overlayScale.value) }],
            overflow: "hidden",
        }

    })



    return <Overlay isVisible={visible} fullScreen={false}
        overlayStyle={{
            backgroundColor: "transparent",// width: 100, height: 60,
            position: "absolute", top, left,
            padding: 0,
            borderWidth: 0,
        }}
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)", }}
        onBackdropPress={function () { setVisible(false) }}
    >
        <ScaleView>
            <View style={[viewStyle]} >

                <Icon
                    name={isText ? "copy-outline" : "arrow-down-circle-outline"}
                    type='ionicon'
                    color='white'
                    size={50}
                    onPress={function () {

                        if (isText) {

                            Clipboard.setString(currentMessage.text);
                            setTimeout(() => {
                                setSnackMsg("copied")
                                setSnackBarHeight(60)
                            }, 0);
                        }
                        else if ((isImage) && (currentMessage.user._id !== userName)) {
                            downloadFromUri(currentMessage.image, setSnackMsg, setSnackBarHeight)
                        }
                        else if ((isImage) && (currentMessage.user._id === userName)) {
                            downloadFromLocal(currentMessage.image, setSnackMsg, setSnackBarHeight)
                        }
                        else if (isAudio) {
                            const audioUri = FileSystem.documentDirectory + "Audio/" + item.name + "/" + currentMessage.audioName

                            downloadFromLocal(audioUri, setSnackMsg, setSnackBarHeight)


                        }

                        setVisible(false)
                    }}
                />
                <Icon
                    name="trash-outline"
                    type='ionicon'
                    color='white'
                    size={50}
                    onPress={function () {

                        canMoveDown.current = false
                        if (isText) {

                            setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })
                            const fileUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/" + item.name + "---" + currentMessage.createdTime
                            setTimeout(() => {
                                FileSystem.deleteAsync(fileUri, { idempotent: true })
                            }, 800);

                        }

                        else if (isImage) {
                            axios.get(`${url}/api/image/delete/${currentMessage._id}`, { headers: { "x-auth-token": token } }).then(response => {
                                // console.log(response.data)
                            })

                            setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })
                            const fileUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/" + item.name + "---" + currentMessage.createdTime
                            FileSystem.deleteAsync(fileUri, { idempotent: true })
                            setTimeout(() => {
                                currentMessage.isLocal && FileSystem.deleteAsync(currentMessage.image, { idempotent: true })
                            }, 800);


                        }
                        else if (isAudio) {


                            setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })





                            setTimeout(() => {


                                const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
                                const fileUri = folderUri + item.name + "---" + currentMessage.createdTime
                                FileSystem.deleteAsync(fileUri, { idempotent: true })

                                const audioUri = FileSystem.documentDirectory + "Audio/" + item.name + "/" + currentMessage.audioName
                                FileSystem.deleteAsync(audioUri, { idempotent: true })
                            }, 800);
                        }



                    }}
                />
            </View>
        </ScaleView>



    </Overlay>

}


