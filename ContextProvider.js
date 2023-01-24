import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState } from 'react-native';

import { createContext, useContextSelector } from 'use-context-selector';

export const Context = createContext()




export default function ContextProvider(props) {

    const [userName, setUserName] = useState("hihih")

    return (
        <Context.Provider value={{

            userName, setUserName

        }}>
            {props.children}
        </Context.Provider>


    )


}
