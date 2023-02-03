import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState, View } from 'react-native';

import { createContext, useContextSelector } from 'use-context-selector';

export const Context = createContext()

import SnackBar from './SnackBar';


export default function ContextProvider(props) {

    const [userName, setUserName] = useState("hihih")
    const [isSnackVisible, setSnackVisible] = useState(false)
    const [snackMessage, setSnackMessage] = useState("aaabbbaaaaaaaa")

    const showSnackBar = useCallback(function (message = "doed") {
        setSnackVisible(true)
        setSnackMessage(message)
    }, [])

    const [isOverLayTextVisible, setOverLayTextVisible] = useState(false)
    const [overLayTextLeft, setOverLayTextLeft] = useState(0)
    const [overLayTextTop, setOverLayTextTop] = useState(0)
    const [overLayTextFn1, setOverLayTextFn1] = useState(function () { () => { } })
    const [overLayTextFn2, setOverLayTextFn2] = useState(function () { () => { } })


    const showOverLayText = useCallback(function (left, top, fn1 = () => { }, fn2 = () => { }) {
        setOverLayTextVisible(true)
        setOverLayTextLeft(left)
        setOverLayTextTop(top)
        setOverLayTextFn1(fn1)
        setOverLayTextFn2(fn2)
    }, [])



    const [peopleList, setPeopleList] = useState([
        { name: "Geroge", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
        { name: "Mike", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        { name: "Tilandson", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        { name: "SmithJohn", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
        { name: "DoeMill", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
        { name: "Bob", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        { name: "JameBond", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        { name: "toxNeil", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
        { name: "TomCox", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#aff" },
        { name: "bentt", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#ffa" },
        { name: "tilda", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faf" },
        { name: "phillen", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0), barColor: "#faa" },
    ])


    return (
        <Context.Provider value={{

            userName, setUserName,
            peopleList, setPeopleList,
            isSnackVisible, setSnackVisible,
            snackMessage, setSnackMessage,
            showSnackBar,
            isOverLayTextVisible, setOverLayTextVisible,
            overLayTextLeft,
            overLayTextTop,
            showOverLayText,
            overLayTextFn1, setOverLayTextFn1,
            overLayTextFn2, setOverLayTextFn2

        }}>


            {props.children}



        </Context.Provider>


    )


}
