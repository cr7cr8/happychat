import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState } from 'react-native';

import { createContext, useContextSelector } from 'use-context-selector';

export const Context = createContext()




export default function ContextProvider(props) {

    const [userName, setUserName] = useState("hihih")

    const [peopleList, setPeopleList] = useState([
        { name: "Geroge", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#aff" },
        { name: "Mike", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#ffa" },
        { name: "Tilandson", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faf" },
        { name: "SmithJohn", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faa" },
        { name: "DoeMill", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#aff" },
        { name: "Bob", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#ffa" },
        { name: "JameBond", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faf" },
        { name: "toxNeil", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faa" },
        { name: "TomCox", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#aff" },
        { name: "bentt", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#ffa" },
        { name: "tilda", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faf" },
        { name: "phillen", description: "fewfas", personID: "user-" + (Math.random() * 1000).toFixed(0), key: "id-" + (Math.random() * 1000000).toFixed(0),barColor:"#faa" },
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
