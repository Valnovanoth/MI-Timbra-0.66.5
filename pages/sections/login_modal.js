import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Text, Modal, View, Button, TextInput } from "react-native";
//import { Modal, ModalTitle, ModalContent } from 'react-native-modals';

import RNExitApp from 'react-native-exit-app';

import { styles } from '../launch';

import { StateContext } from "../../provider/provider";

import {
  WS_HAS_PASSWORD,
  WS_GET_PASSWORD,
  WS_FORGOT_PASSWORD,
  WS_IS_DEVICE_REGISTERED,
  WS_REGISTER,
  WS_LOGIN,
} from "../../utils/config";

export default function LoginModal () {
    const state = useContext(StateContext);
    const [deviceId, setDeviceId] = useState(state.deviceId);
    //const [deviceId, setdeviceId] = useState(state.deviceId._z);
    const [isDeviceRegistered, setIsDeviceRegistered] = useState(false); // se non è ancora registrato, non mostro il popup Login / Register
    const [loggedIn, setIsLoggedIn] = useState(false); // non è loggato
    const [hasPassword, setHasPassword] = useState(true); // se la ha gia fa Login, altrimenti Register    
    const [password, setPassword] = useState(null);

    useEffect(() => {
        setDeviceId(state.deviceId);
        //setdeviceId(state.deviceId._z);
        //setPassword(state.user.password);
        //setHasPassword(state.isConsentGiven);        
    }, [state]);

    useEffect(() => {
        setPassword(state.user.password);
    }, [state.user.password]);

    /*useEffect(() => {
        hasPassword()
    }, []);*/

    // ON MOUNT

    const checkIsDeviceRegistered = () => {                
        let ret = fetch(WS_IS_DEVICE_REGISTERED + "?deviceId=" + deviceId, {
            method: "GET",
            headers: new Headers({ "Content-Type": "application/json" }), 
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        return resp.json();
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })      
            .then((data) => {
                if (data[0].isDeviceRegistered) {
                    setIsDeviceRegistered(true);
                } else {
                    setIsDeviceRegistered(false);
                }      
                console.log(data[0].isDeviceRegistered);
            })  
            .catch((e) => {
                //setHasPassword(false);
                console.log(e);
            });
        return ret;                        
    }
    const loginOrRegister = () => {                
        let ret = fetch(WS_HAS_PASSWORD + "?deviceId=" + deviceId, {
            method: "GET",
            headers: new Headers({ "Content-Type": "application/json" }), 
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        return resp.json();
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })      
            .then((data) => {
                if (data[0].hasPassword) {
                    setHasPassword(true); // Login
                } else {
                    setHasPassword(false); // Register
                }      
                console.log(data[0].hasPassword);
            })  
            .catch((e) => {
                //setHasPassword(false);
                console.log(e);
            });
        return ret;                        
    }    
    const getPassword = () => {                
        let ret = fetch(WS_GET_PASSWORD + "?deviceId=" + deviceId, {
            method: "GET",
            headers: new Headers({ "Content-Type": "application/json" }), 
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        return resp.json();
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })      
            .then((data) => {
                if (data[0].password) {
                    setPassword(data[0].password);
                } else {
                    setPassword(null);
                }               
            })  
            .catch((e) => {
                //setHasPassword(false);
                /* console.log(e) * /; */
            });
        return ret;                        
    }        
    // componentWillMount Hook hack
    const willMount = useRef(true);
    if (willMount.current) {
      checkIsDeviceRegistered();
      loginOrRegister();
      getPassword();
    }  
    willMount.current = false;    


    // MAIN

    const forgotPassword = () => {
        let body = {
            "deviceId": deviceId,
        };

        let ret = fetch(WS_FORGOT_PASSWORD, {
            method: "PATCH",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),            
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        RNExitApp.exitApp(); 
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })
            /*.then((data) => {
                if (data.requestId) {
                setAssociationRequest({ id: data.requestId });
                Alert.alert(
                    "Associazione",
                    "Richiesta eseguita con id: " + data.requestId
                );
                }
                if (data.requestId == 0)
                Alert.alert("Associazione", "Richiesta in lavorazione.");
            })*/
            .catch((e) => {
            });
        return ret;
    };  
    
    const register = (password) => {
        let body = {
            "deviceId": deviceId,
            "password": password,
        };

        let ret = fetch(WS_REGISTER, {
            method: "PATCH",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),            
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        setHasPassword(true);
                        return resp.json();
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })
            /*.then((data) => {
                if (data.requestId) {
                setAssociationRequest({ id: data.requestId });
                Alert.alert(
                    "Associazione",
                    "Richiesta eseguita con id: " + data.requestId
                );
                }
                if (data.requestId == 0)
                Alert.alert("Associazione", "Richiesta in lavorazione.");
            })*/
            .catch((e) => {
                setHasPassword(false);
            });
        return ret;
    };    

    const login = (password) => {
        let body = {
            "deviceId": deviceId,
            "password": password,
        };

        let ret = fetch(WS_LOGIN, {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),            
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        //setHasPassword(true);
                        return resp.json();
                        break;
                    default:
                        Alert.alert("Errore", "Errore di sistema, riprova più tardi.");
                        break;
                }
            })
            .then((data) => {
                if (data[0].login) {
                    setIsLoggedIn(true);
                }
                //setAssociationRequest({ id: data.requestId });
                /*Alert.alert(
                    "Associazione",
                    "Richiesta eseguita con id: " + data.requestId
                );
                }
                if (data.requestId == 0)
                Alert.alert("Associazione", "Richiesta in lavorazione.");*/
            })          
            .catch((e) => {
                setHasPassword(false);
            });
        return ret;
    };

    return (
        <>
            {hasPassword ? (
            <>
                <Modal
                    visible={isDeviceRegistered && !loggedIn} 
                    transparent={true}
                    hardwareAccelerated={true}                    
                >
                    <View style={loginStyles.centeredView}>
                        <View style={loginStyles.modalView}>
                            <Text style={loginStyles.title}>
                                Login
                            </Text>                    
                            {/** HR */}
                            <View style={loginStyles.hairline} />
                            {/** HR */}                                     
                            <View style={loginStyles.cardContainer}>
                                <Text style={loginStyles.cardText}>Password</Text>
                                <TextInput
                                    style={loginStyles.cardInput}
                                    onChangeText={setPassword}
                                    value={password}
                                    textContentType="password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.buttonHorizontal}>
                                <View style={styles.button}>
                                    <Button title="Login" onPress={() => { login(password); }} />
                                </View>
                                <View style={styles.button}>
                                    <Button title="Ripristina" onPress={() => { 
                                        forgotPassword();                                        
                                    }} />
                                </View>
                            </View> 
                        </View>               
                    </View>
                </Modal>                
            </>
            ) : (
            <>
                <Modal
                    visible={isDeviceRegistered}
                    transparent={true}
                    hardwareAccelerated={true}                       
                >
                    <View style={loginStyles.centeredView}>
                        <View style={loginStyles.modalView}>
                            <Text style={loginStyles.title}>
                                Registrazione
                            </Text>             
                            {/** HR */}
                            <View style={loginStyles.hairline} />
                            {/** HR */}                                   
                            <View style={loginStyles.cardContainer}>
                                <Text style={loginStyles.cardText}>Password</Text>
                                <TextInput
                                    style={loginStyles.cardInput}
                                    onChangeText={setPassword}
                                    value={password}
                                    textContentType="password"
                                    secureTextEntry
                                />
                            </View>
                            <View style={loginStyles.cardContainer}>
                                <Text style={loginStyles.cardText}>Ripeti Password</Text>
                                <TextInput
                                    style={loginStyles.cardInput}
                                    /*onChangeText={setPassword}
                                    value={password}*/
                                    textContentType="password"
                                    secureTextEntry
                                />
                            </View>                            

                            <View style={styles.buttonHorizontal}>
                                <View style={styles.button}>
                                    <Button title="Registra" onPress={() => { register(password); }} />
                                </View>
                                <View style={styles.button}>
                                    <Button title="Chiudi" onPress={() => { RNExitApp.exitApp(); }} />
                                </View>
                            </View> 
                        </View>               
                    </View>  
                </Modal>
            </>
            )}            

        </>
    );
};

const loginStyles = StyleSheet.create({
    centeredView: {
        flex: 0,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
        marginTop: '-0%'
    },
    modalView: {
        marginVertical: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%'
    },
    title: {
        fontWeight: "bold",
        textAlign: "justify",
        fontSize: 25,
        marginBottom: 10,
        color: "black",
      },
    hairline: {
        backgroundColor: 'black',
        height: 5,
        marginVertical: 10,
        width: '100%'
    },        
    cardContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      marginBottom: 10,
      color: "black"
    },
    cardText: {
      flex: 1,
      fontSize: 16,
      flexGrow: 1,
      color: "black",
    },
    cardInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "lightgray",
      minHeight: 30,
      color: "black",
    },
  });