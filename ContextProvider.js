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





import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

import axios from 'axios';
import { io } from "socket.io-client";

export default function ContextProvider(props) {


    const [token, setToken] = useState(false)

    const [userName, setUserName] = useState("")
    const [initialRouter, setInitialRouter] = useState("")
    const [serverAddress, setServerAddress] = useState("")



    const [isSnackVisible, setSnackVisible] = useState(false)
    const [snackMessage, setSnackMessage] = useState("aaabbbaaaaaaaa")
    const showSnackBar = useCallback(function (message = "doed") {
        setSnackVisible(true)
        setSnackMessage(message)
    }, [])
    const [peopleList, setPeopleList] = useState([])


    useEffect(function () {
        Audio.requestPermissionsAsync()
        MediaLibrary.requestPermissionsAsync()
        Notifications.requestPermissionsAsync()
        Notifications.getPermissionsAsync()
        //  Camera.requestCameraPermissionsAsync();
    }, [])

  







    return (
        <Context.Provider value={{

            userName, setUserName,
            token, setToken,
            initialRouter, setInitialRouter,

            serverAddress, setServerAddress,

            peopleList, setPeopleList,
            isSnackVisible, setSnackVisible,
            snackMessage, setSnackMessage,
            showSnackBar,


        }}>


            {props.children}



        </Context.Provider>


    )


}
