import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState } from 'react-native';

import { createContext, useContextSelector } from 'use-context-selector';

export const Context = createContext()




export default function ContextProvider(props) {

    const [userName, setUserName] = useState("hihih")

    const [peopleList, setPeopleList] = useState([
        { name: "aaa", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#aff" },
        { name: "bbb", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#ffa" },
        { name: "ccc", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faf" },
        { name: "ddd", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faa" },
        { name: "aaa", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#aff" },
        { name: "bbb", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#ffa" },
        { name: "ccc", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faf" },
        { name: "ddd", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faa" },
        { name: "aaa", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#aff" },
        { name: "bbb", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#ffa" },
        { name: "ccc", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faf" },
        { name: "ddd", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000).toFixed(0),barColor:"#faa" },
    ])


    return (
        <Context.Provider value={{

            userName, setUserName,
            peopleList, setPeopleList,

        }}>
            {props.children}
        </Context.Provider>


    )


}
