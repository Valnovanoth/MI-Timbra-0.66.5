import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Modal, Text, View, Button, ScrollView } from "react-native";
//import { Modal, ModalTitle, ModalContent } from 'react-native-modals';

import RNExitApp from 'react-native-exit-app';

//import { policyStyles } from "../launch";

import { StateContext } from "../../provider/provider";

//! import { PolicyText } from "./inner/policy_text";

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
    //const [policyText, setPolicyText] = useState("Informativa");

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
                        <ScrollView style={policyStyles.scrollcontainer}>
                            {policyIsFirstPage ? (
                                <View>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            **INFORMATIVA SULLA PRIVACY PER LA GEOLOCALIZZAZIONE (ART. 13 GDPR)**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            La presente Informativa sulla Privacy è destinata a informare l'utente sulle
                                            modalità di raccolta e utilizzo dei dati di geolocalizzazione da parte della
                                            nostra società, Meridionale Impianti SPA, in conformità con il Regolamento
                                            Generale sulla Protezione dei Dati (GDPR).
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            1. **IDENTITÀ E DETTAGLI DI CONTATTO DEL TITOLARE DEL TRATTAMENTO**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            Il titolare del trattamento è Meridionale Impianti SPA, con sede in
                                            Bivio Aspro SN - Belpasso - 95032 Catania, Italia.
                                            Per qualsiasi domanda, si prega di contattare segreteria@merimp.com
                                            o ufficio.personale@merimp.com
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            2. **FINALITÀ DEL TRATTAMENTO E BASE GIURIDICA**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            I dati di geolocalizzazione vengono raccolti e utilizzati per fornire servizi
                                            personalizzati e migliorare l'esperienza dell'utente. La base giuridica per il
                                            trattamento è il consenso dell'utente.
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            3. **DESTINATARI O CATEGORIE DI DESTINATARI DEI DATI PERSONALI**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            I dati di geolocalizzazione non verranno condivisi con n	essun ente esterno,
                                            sono di puro uso dell'aziend	a
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            4. **TRASFERIMENTO DI DATI PERSONALI**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            I dati personali non vengono trasferiti al di fuori dell'Unione Europea.
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            5. **PERIODO DI CONSERVAZIONE DEI DATI**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            I dati di geolocalizzazione saranno conservati fino alla cancellazione
                                            dell'account da parte dell'utente, e dopo il loro processing da parte
                                            dell'azienda
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            6. **DIRITTI DELL'INTERESSATO**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            L'utente ha il diritto di accedere, rettificare, cancellare i propri dati
                                            personali, limitare o opporsi al loro trattamento, diritto alla portabilità
                                            dei dati, diritto di revocare il consenso, e diritto di proporre reclamo
                                            a un'autorità di controllo.
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            7. **NATURA OBBLIGATORIA O FACOLTATIVA DEL CONSENSO**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                            La fornitura dei dati è facoltativa, ma la mancata fornitura dei dati può
                                            limitare la capacità di fornire servizi personalizzati.
                                      </Text>
                                      <Text style={[policyStyles.scrolltitle]}>
                                            8. **ESISTENZA DI UN PROCESSO DECISIONALE AUTOMATIZZATO**
                                      </Text>
                                      <Text style={[policyStyles.subtitle]}>
                                               Non esiste un processo decisionale automatizzato, compresa la profilazione.
                                      </Text>
                                        <View
                                          style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            margin: 20
                                          }}
                                        />
                                      <Text style={[policyStyles.subtitle]}>
                                               Per ulteriori informazioni sul trattamento dei dati personali, si prega di
                                               contattare segreteria@merimp.com o ufficio.personale@merimp.com
                                      </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={policyStyles.subtitle}>
                                       Preso atto di quanto indicato nella precedente informativa,
                                       autorizzo in modo esplicito il trattamento dei miei dati personali
                                       per l’elaborazione, ai fini della gestione delle timbrature
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
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
        height: '80%',
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
        textAlign: "left",
        fontSize: 25,
        marginBottom: 10,
        color: "black"
    },
    scrolltitle: {
        fontWeight: "bold",
        fontSize: 20,
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