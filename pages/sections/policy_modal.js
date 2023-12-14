import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Modal, Text, View, Button } from "react-native";
//import { Modal, ModalTitle, ModalContent } from 'react-native-modals';

import RNExitApp from 'react-native-exit-app';

//import { policyStyles } from "../launch";

import { StateContext } from "../../provider/provider";

import {
  WS_GIVE_CONSENT,
  WS_HAS_CONSENT,
  WS_IS_DEVICE_REGISTERED,
} from "../../utils/config";

export default function PolicyModal () {
    const state = useContext(StateContext);
    const [deviceId, setDeviceId] = useState(state.deviceId);
    //const [deviceId, setdeviceId] = useState(state.deviceId._z);
    const [isConsentGiven, setIsConsentGiven] = useState(true);
    const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

    // Controllo testi e pulsanti navigazione popup policy
    const [policyIsFirstPage, setPolicyIsFirstPage] = useState(true);
    const [policyText, setPolicyText] = useState("Informativa");

    useEffect(() => {
        setDeviceId(state.deviceId);
        //setdeviceId(state.deviceId._z);
        //setIsConsentGiven(state.isConsentGiven);        
    }, [state]);

   /* !useEffect(() => {
        //to do chiudi popup

   }, [isDeviceRegistered]);*/


    const policySecondPage = () => {
        setPolicyIsFirstPage(false);
        setPolicyText("Preso atto di quanto indicato nella precedente informativa," +
           " autorizzo in modo esplicito il trattamento dei miei dati personali" +
           " per l’elaborazione, ai fini della gestione delle timbrature");
    }

    const checkDeviceRegistered = () => {                
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
            })  
            .catch((e) => {
                console.log(e);
            });
        return ret;                        
    }

    const hasConsent = () => {                
        let ret = fetch(WS_HAS_CONSENT + "?deviceId=" + deviceId, {
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
                if (data[0].hasConsent) {
                    setIsConsentGiven(true);
                } else {
                    setIsConsentGiven(false);
                }      
                console.log(data[0].hasConsent);
            })  
            .catch((e) => {
                //setIsConsentGiven(false);
                console.log(e);
            });
        return ret;                        
    }
    // componentWillMount Hook hack
    const willMount = useRef(true);
    if (willMount.current) {
      //!checkDeviceRegistered();
      hasConsent();
    }  
    willMount.current = false;    



    const giveConsent = () => {
        let body = {
            "deviceId": deviceId,
        };

        let ret = fetch(WS_GIVE_CONSENT, {
            method: "PATCH",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),            
        })
            .then((resp) => {
                switch (resp.status) {
                    case 200:
                        setIsConsentGiven(true);
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
                setIsConsentGiven(false);
            });
        return ret;
    };

    return (
        <>
            <Modal
                transparent={true}
                hardwareAccelerated={true}
                visible={!isConsentGiven}
            >
                <View style={policyStyles.centeredView}>
                    <View style={policyStyles.modalView}>
                        <Text style={policyStyles.title}>
                            Autorizzazione al Trattamento dei Dati Personali
                        </Text>
                        {/** HR */}
                        <View style={policyStyles.hairline} />
                        {/** HR */}
                        <Text style={policyStyles.subtitle}>
                            {policyText}
                        </Text>
                        <View style={policyStyles.buttonHorizontal}>
                            {policyIsFirstPage ? (
                                <>
                                    <View style={policyStyles.button}>
                                        <Button title="Avanti" onPress={() => { policySecondPage(); }} />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={policyStyles.button}>
                                        <Button title="Acconsento" onPress={() => { giveConsent(); }} />
                                        {/* this.setState({ visible: false }); */}
                                    </View>
                                    <View style={policyStyles.button}>
                                        <Button title="Nego" onPress={() => { RNExitApp.exitApp(); }} />
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const policyStyles = StyleSheet.create({
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
        color: "black"
    },
    hairline: {
        backgroundColor: 'black',
        height: 5,
        marginVertical: 10,
        width: '100%'
    },      
    subtitle: {
        fontSize: 15,
        marginTop: 5,
        marginBottom: 5,
        textAlign: "justify",
        lineHeight: 20,
        color: "black"
    },
    cardContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    cardText: {
      flex: 1,
      fontSize: 16,
      flexGrow: 1,
      color: "black"
    },
    cardInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "lightgray",
      minHeight: 30,
      color: "black"
    },
      buttonHorizontal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
      },
      button: {
        margin: 10,
      },
  });