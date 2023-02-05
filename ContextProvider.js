import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState, View } from 'react-native';

import { createContext, useContextSelector } from 'use-context-selector';

export const Context = createContext()

import SnackBar from './SnackBar';

import { Video, AVPlaybackStatus, Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
//import { Camera } from 'expo-camera';


export default function ContextProvider(props) {

    const [userName, setUserName] = useState("chen")



    const [isSnackVisible, setSnackVisible] = useState(false)
    const [snackMessage, setSnackMessage] = useState("aaabbbaaaaaaaa")
    const showSnackBar = useCallback(function (message = "doed") {
        setSnackVisible(true)
        setSnackMessage(message)
    }, [])

    useEffect(function () {

        Audio.requestPermissionsAsync()
        MediaLibrary.requestPermissionsAsync()
        Notifications.requestPermissionsAsync()
        Notifications.getPermissionsAsync()
      //  Camera.requestCameraPermissionsAsync();
    }, [])



    const [peopleList, setPeopleList] = useState([
    
        // { name: "Mike", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        // { name: "Tilandson", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        // { name: "SmithJohn", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
        // { name: "Gergeo", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
        // { name: "Bob", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        // { name: "JameBond", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        // { name: "toxNeil", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
        // { name: "TomCox", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
        // { name: "bentt", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        // { name: "tilda", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        // { name: "phillen", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
    ])


    return (
        <Context.Provider value={{

            userName, setUserName,
            peopleList, setPeopleList,
            isSnackVisible, setSnackVisible,
            snackMessage, setSnackMessage,
            showSnackBar,


        }}>


            {props.children}



        </Context.Provider>


    )


}
