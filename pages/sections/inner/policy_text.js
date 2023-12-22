//import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PolicyText () {
    const state = useContext(StateContext);

    return (
        <>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    **INFORMATIVA SULLA PRIVACY PER LA GEOLOCALIZZAZIONE (ART. 13 GDPR)**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    La presente Informativa sulla Privacy è destinata a informare l'utente sulle
                    modalità di raccolta e utilizzo dei dati di geolocalizzazione da parte della
                    nostra società, Meridionale Impianti SPA, in conformità con il Regolamento
                    Generale sulla Protezione dei Dati (GDPR).
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    1. **IDENTITÀ E DETTAGLI DI CONTATTO DEL TITOLARE DEL TRATTAMENTO**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    Il titolare del trattamento è Meridionale Impianti SPA, con sede in
                    Bivio Aspro SN - Belpasso - 95032 Catania, Italia.
                    Per qualsiasi domanda, si prega di contattare segreteria@merimp.com
                    o ufficio.personale@merimp.com
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    2. **FINALITÀ DEL TRATTAMENTO E BASE GIURIDICA**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    I dati di geolocalizzazione vengono raccolti e utilizzati per fornire servizi
                    personalizzati e migliorare l'esperienza dell'utente. La base giuridica per il
                    trattamento è il consenso dell'utente.
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    3. **DESTINATARI O CATEGORIE DI DESTINATARI DEI DATI PERSONALI**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    I dati di geolocalizzazione non verranno condivisi con nessun ente esterno,
                    sono di puro uso dell'azienda
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    4. **TRASFERIMENTO DI DATI PERSONALI**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    I dati personali non vengono trasferiti al di fuori dell'Unione Europea.
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    5. **PERIODO DI CONSERVAZIONE DEI DATI**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    I dati di geolocalizzazione saranno conservati fino alla cancellazione
                    dell'account da parte dell'utente, e dopo il loro processing da parte
                    dell'azienda
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    6. **DIRITTI DELL'INTERESSATO**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    L'utente ha il diritto di accedere, rettificare, cancellare i propri dati
                    personali, limitare o opporsi al loro trattamento, diritto alla portabilità
                    dei dati, diritto di revocare il consenso, e diritto di proporre reclamo
                    a un'autorità di controllo.
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    7. **NATURA OBBLIGATORIA O FACOLTATIVA DEL CONSENSO**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                    La fornitura dei dati è facoltativa, ma la mancata fornitura dei dati può
                    limitare la capacità di fornire servizi personalizzati.
              </Text>
              <Text style={[styles.title, { color: CMAT_BLUE }]}>
                    8. **ESISTENZA DI UN PROCESSO DECISIONALE AUTOMATIZZATO**
              </Text>
              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                       Non esiste un processo decisionale automatizzato, compresa la profilazione.
              </Text>

              <Text style={[styles.subtitle, { color: CMAT_BLUE }]}>
                       Per ulteriori informazioni sul trattamento dei dati personali, si prega di
                       contattare segreteria@merimp.com o ufficio.personale@merimp.com
              </Text>
        </>
    );
};

const styles = StyleSheet.create({
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