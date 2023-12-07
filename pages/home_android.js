import React, { useEffect, useState, useContext, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import RNExitApp from 'react-native-exit-app';

import Geolocation from "@react-native-community/geolocation";

import { PermissionsAndroid } from "react-native";
import { DeviceEventEmitter } from "react-native";
import Beacons from "react-native-beacons-manager";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

import { createOpenLink, createMapLink } from "react-native-open-maps";

import PolicyModal from "./sections/policy_modal";
import LoginModal from "./sections/login_modal";

import Icon from "react-native-vector-icons/FontAwesome";

import {
  WS_URL,
  WS_GENERATE_NONCE,
  WS_GATE_OPEN,
  BADGE_IN,
  BADGE_OUT,
  REGION0,
  REGIONGATE0,
  DEBUG_ALERTS,
  WS_GET_LAST_COSTCODE,
} from "../utils/config";

import { StateContext } from "../provider/provider";
import { truncateString } from "../utils/utils";

const REGION = REGION0;
const REGIONGATE = REGIONGATE0;

let _didRange = null;
let _regionEnter = null;
let _regionExit = null;

let parsedRegion = null;

export default function HomePageAndroid({ navigation }) {
  const state = useContext(StateContext);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [password, setPassword] = useState(null);
  const [badgeCode, setBadgeCode] = useState(null);
  const [costCode, setCostCode] = useState(null);
  const [deviceId, setDeviceId] = useState(state.deviceId._z);
  const [isInRegion, setIsInRegion] = useState(false);
  const [isInGateRegion, setIsInGateRegion] = useState(false);
  const [lastBestBeacon, setLastBestBeacon] = useState(null);
  const [alertEnabled, setAlertEnabled] = useState(DEBUG_ALERTS);
  const [location, setLocation] = useState(null);
  const [isPositionRequesting, setIsPositionRequesting] = useState(false);
  const [isBadging, setIsBadging] = useState(false);
  const [isOpeningGate, setIsOpeningGate] = useState(false);

  useEffect(() => {
    setName(state.user.name);
    setSurname(state.user.surname);
    setPassword(state.user.password);
    setDeviceId(state.deviceId._z);
    setBadgeCode(state.badgeCode);
    //setCostCode(state.lastCostCode);
    //console.log("Last cost code : " + state.lastCostCode);
  }, [state]);

  useEffect(() => {
    setCostCode(state.lastCostCode);
    //console.log("Last cost code : " + state.lastCostCode);
  }, [state.lastCostCode]);

  useEffect(() => {
    console.log("is position requesting:", isPositionRequesting);
  }, [isPositionRequesting]);

  useEffect(() => {
    // AUTO SHUTDOWN AFTER 1 MINUTE
      /*async function autoShutdown() {
        await delay(10000);
        RNExitApp.exitApp();
      }
      autoShutdown();*/

    requestLocationAndNearbyDevicesPermission();
    //requestLocationPermission();
    detectBeacons();
    registerMonitoringListener();
    registerRangingListener();
    return () => {
      unregisterMonitorListener();
      unregisterRangingListener();
    };
  }, []);

    /*useEffect(() => {
      requestLocationPermission();
      detectBeacons();
      registerGateMonitoringListener();
      registerGateRangingListener();
      return () => {
        unregisterGateMonitorListener();
        unregisterGateRangingListener();
      };
    }, []);*/
  /*useEffect(() => {
    //requestLocationPermission();
    //detectBeacons();
    registerGateMonitoringListener();
    registerGateRangingListener();
    return () => {
      unregisterGateMonitorListener();
      unregisterGateRangingListener();
    };
  }, []);*/

  useEffect(() => {
    startMonitoring(REGION);
    startRanging(REGION);
    startMonitoring(REGIONGATE);
    startRanging(REGIONGATE);
    return () => {
      stopMonitoring(REGION);
      stopRanging(REGION);
      stopMonitoring(REGIONGATE);
      stopRanging(REGIONGATE);
    };
  }, []);
    /*useEffect(() => {
      startMonitoring(REGIONGATE);
      startRanging(REGIONGATE);
      return () => {
        stopMonitoring(REGIONGATE);
        stopRanging(REGIONGATE);
      };
    }, []);*/

  /*useEffect(() => {
    startMonitoring(REGION);
    startRanging(REGION);
    return () => {
      stopMonitoring(REGION);
      stopRanging(REGION);
    };
  }, [!isInRegion]);
    useEffect(() => {
      startGateMonitoring(REGIONGATE);
      startGateRanging(REGIONGATE);
      return () => {
        stopGateMonitoring(REGIONGATE);
        stopGateRanging(REGIONGATE);
      };
    }, [!isInGateRegion]);*/


  useEffect(() => {
    if (RNAndroidLocationEnabler) {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then((data) => {
            console.log("Location Services status:", data);
            // The user has accepted to enable the location services
            // data can be :
            //  - "already-enabled" if the location services has been already enabled
            //  - "enabled" if user has clicked on OK button in the popup
          })
          .catch((err) => {
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            //  - ERR03 : Internal error
          });
    }
    return () => {};
  }, []);

  // ON MOUNT
  const getLastCostCode = () => {
    let ret = fetch(WS_GET_LAST_COSTCODE + "?deviceId=" + deviceId, {
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
        if (data[0].dbLastCostCode) {
          setCostCode(data[0].dbLastCostCode);
          console.log("Last cost code : " + data[0].dbLastCostCode);
        }
      })
      .catch((e) => {});
    return ret;
  };
  // componentWillMount Hook hack
  const willMount = useRef(true);
  if (willMount.current) {
    getLastCostCode();
  }
  willMount.current = false;

  const detectBeacons = async () => {
    Beacons.detectIBeacons();
  };
  const startRanging = async (region) => {
    // Start detecting all iBeacons in the nearby
    try {
      //Alert.alert("startRanging - before await");
      await Beacons.startRangingBeaconsInRegion(region);
      //Alert.alert("startRanging - after await");
      if (alertEnabled)
        Alert.alert("MERimp App", "Ranging Started successfully!");
      console.log(`Beacons ranging started succesfully!`);
    } catch (error) {
      console.log(`Beacons ranging not started, error: ${error}`);
    }
  };
  const stopRanging = async (region) => {
    setLastBestBeacon(null);
    try {
      await Beacons.stopRangingBeaconsInRegion(region);
      if (alertEnabled)
        Alert.alert("MERimp App", "Ranging Stopped successfully!");
      console.log(`Beacons ranging stopped succesfully!`);
    } catch (error) {
      console.log(`Beacons ranging not NOT stopped, error: ${error}`);
    }
  };
  const startMonitoring = async (region) => {
    //console.log(region.major);
    // Start detecting all iBeacons in the nearby
    //Alert.alert("startMonitoring");
    try {
      await Beacons.startMonitoringForRegion(region);
      if (alertEnabled)
        Alert.alert("MERimp App", "Monitoring Started successfully!");
      console.log(`Beacons monitoring started succesfully!`);
    } catch (error) {
      console.log(`Beacons monitoring not started, error: ${error}`);
    }
  };
  const stopMonitoring = async (region) => {
    //Alert.alert("stopMonitoring");
    if (region) {
        if (region.major == 1) setIsInRegion(false);
        else if (region.major == 2) setIsInGateRegion(false);
    }
    try {
      await Beacons.stopMonitoringForRegion(region);
      if (alertEnabled)
        Alert.alert("MERimp App", "Monitoring Stopped successfully!");
      console.log(`Beacons monitoring stopped succesfully!`);
    } catch (error) {
      console.log(`Beacons monitoring not NOT stopped, error: ${error}`);
    }
  };
  const registerMonitoringListener = () => {
    // should use NativeEventEmittere, DeviceEventEmitter is deprecated

    // Print a log of the detected iBeacons (1 per second)
    console.log("monitoring listeners registering...");

    _regionEnter = DeviceEventEmitter.addListener(
      "regionDidEnter",
      (region) => {
        console.log("Entered new beacons region!", region); // Result of monitoring

        if (region) {
            if (region.major == 1) setIsInRegion(true);
            else if (region.major == 2) setIsInGateRegion(true);
            else {
            }

            //Alert.alert("Listener - regionEnter");
        }

        if (alertEnabled)
          Alert.alert("Monitoring", "Sei entrato in una regione.");
      }
    );
    _regionExit = DeviceEventEmitter.addListener("regionDidExit", (region) => {
      console.log("Exited beacons region!", region); // Result of monitoring
      setLastBestBeacon(null);

      //Alert.alert("Listener - regionExit");

        if (region) {
            if (region.major == 1) setIsInRegion(false);
            else if (region.major == 2) setIsInGateRegion(false);
        }

      if (alertEnabled) Alert.alert("Monitoring", "Sei uscito da una regione.");
    });
  };
  const unregisterMonitorListener = () => {
    try {
      console.log("monitoring listeners unregistering...");
      _regionEnter.remove();
      _regionExit.remove();
    } catch (error) {
      console.log("Error during monitoring listeners unregistering.", error);
    }
  };
  const registerRangingListener = () => {
    // Print a log of the detected iBeacons (1 per second)
    console.log("listeners registering...");
    _didRange = DeviceEventEmitter.addListener("beaconsDidRange", (data) => {
      if (data.region && data.beacons.length > 0) {

      //Alert.alert("registerRangingListener");

      console.log(data.region);

        if (data.region.identifier == 'REGION1' && data.beacons.length > 0 && data.beacons[0].major == 1) {
          setIsInRegion(true);
        } else if (data.region.identifier == 'REGION1' && data.beacons.length == 0) {
          setIsInRegion(false);
        }

        if (data.region.identifier == 'REGIONGATE1' && data.beacons.length > 0 && data.beacons[0].major == 2) {
          setIsInGateRegion(true);
        } else if (data.region.identifier == 'REGIONGATE1' && data.beacons.length == 0) {
          setIsInGateRegion(false);
        }
      }
      data.beacons.forEach((item) => {
        //console.info('Beacon:', item);
      });
      let b = data.beacons.reduce(
        (ret, item, id, beacons) => {
          if (item.distance < ret.min) {
            return { min: item.distance, beacon: item };
          }
          return ret;
        },
        { min: 100, beacon: null }
      );
      if (b.beacon != null) setLastBestBeacon(b.beacon);
      //setLastBestBeacon(b.beacon);
    });
  };
  const unregisterRangingListener = () => {
    try {
      console.log("listeners unregistering...");
      _didRange.remove();
    } catch (error) {
      console.log("Error during listeners unregistering.", error);
    }
  };
  const checkPosition = () => {
    let pos = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    let url = createMapLink(pos);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Errore", "Non è possibile aprire le mappe.");
    });
  };
  const doBadge = async (type) => {
    Keyboard.dismiss();
    if (!costCode) {
      Alert.alert("Attenzione", "Inserire Centro di Costo valido.");
      return;
    }
    // performing state change only if costCode changes
    if (costCode != state.lastCostCode) state._setLastCostCode(costCode);

    if (!badgeCode) {
      Alert.alert(
        "Attenzione",
        "Codice badge non riconosciuto, contattare amministrazione"
      );
    }

    //! HACK ---> PERCHE LASTBESTBEACON NON MI FUNZIONA PIU
    if ((lastBestBeacon == null && !isInRegion) && location == null) {
      Alert.alert("Attenzione", "Impossibile completare la timbratura.", [
        { text: "Riprova", style: "destructive" },
      ]);
      return;
    }

    let body = {
      name,
      surname,
      password,
      badgeCode,
      costCode,
      deviceId,
      type,
    };

    if (lastBestBeacon) {
      body.beacon = lastBestBeacon;
    }
    if (location) {
      body.position = location.coords;
    }

    //_isRequesting = true;
    setIsBadging(true);

    // GET NONCE FIRST
    let nonceRes = await fetch(WS_GENERATE_NONCE + "?deviceId=" + deviceId, {
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
        /*.then((data) => {
            body.nonce = data[0].nonce;
            console.log(data[0].nonce);
            debugger;
        })*/
        .catch((e) => {
            console.log(e);
        });

    body.nonce = nonceRes.nonce;

    let transactions = await fetch(WS_URL, {
         method: "POST",
         headers: new Headers({ "Content-Type": "application/json" }),
         body: JSON.stringify(body),
     })
        .then((resp) => {
            let status = resp.status;
            //_isRequesting = false;
            setIsBadging(false);
            switch (status) {
              case 200:
                Alert.alert("Confermato", "Timbratura effettuata.");
                setLastBestBeacon(null);
                setLocation(null);
                break;
              default:
                Alert.alert("Errore", "La timbratura non è andata a buon fine.", [
                  {
                    text: "Riprova",
                    style: "cancel",
                  },
                ]);
                break;
            }
        })
        .then(transactions => {
            console.log(body);
            //debugger;
        })
        .catch((e) => {
            console.log(e);
        });
    /*.then((data) => {
        body.nonce = data.nonce;
        console.log(data.nonce);
    })*/
  };

  const doGateOpen = (type) => {
    Keyboard.dismiss();

    /*if (lastBestBeacon == null && location == null) {
      Alert.alert("Attenzione", "Impossibile completare l'apertura del cancello.", [
        { text: "Riprova", style: "destructive" },
      ]);
      return;
    }*/

    let body = {
      name,
      surname,
      password,
      badgeCode,
      costCode,
      deviceId,
    };

    let gateBeacon = {
      identifier : "REGIONGATE0",
      uuid : "c7c1a1bf-bb00-4cad-8704-9f2d2917ded3",
      major : 2,
      minor : 1,
      rssi : 0,
      distance : -1,
      proximity : 'unknown',
      accuracy : -1,
    };

    //setLastBestBeacon(gateBeacon);

    /*if (lastBestBeacon) {
      body.beacon = lastBestBeacon;
    }*/
    body.beacon = gateBeacon;

    if (location) {
      body.position = location.coords;
    }

    /*body.beacon.identifier = "REGIONGATE0";
    body.beacon.uuid = "c7c1a1bf-bb00-4cad-8704-9f2d2917ded3"
    body.beacon.major = 2;
    body.beacon.minor = 1;*/

    console.log(body.beacon);

    setIsOpeningGate(true);

    fetch(WS_GATE_OPEN, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    })
      .then((resp) => {
        let status = resp.status;
        //_isRequesting = false;
        setIsOpeningGate(false);
        switch (status) {
          case 200:
            Alert.alert("Confermato", "Cancello in apertura.");
            setLastBestBeacon(null);
            setLocation(null);
            break;
          default:
            Alert.alert("Errore", "L'apertura del cancello non è andata a buon fine.", [
              {
                text: "Riprova",
                style: "cancel",
              },
            ]);
            break;
        }
      })
      .catch((e) => {
        //_isRequesting = false;
        setIsOpeningGate(false);
        //Alert.alert("Errore", "Errore imprevisto durante l'apertura del cancello.");
      });
  };

  const findCoordinates = () => {
    setIsPositionRequesting(true);

    //!
    setIsPositionRequesting(false);
    let position = {
        coords: {
            latitude: 10,
            longitude: 20,
            accuracy: 10,
        },
        timestamp: 10
    }
    setLocation(position);

    /*Geolocation.getCurrentPosition(
      (position) => {
        setIsPositionRequesting(false);
        setLocation(position);
      },
      (e) => {
        setIsPositionRequesting(false);
        Alert.alert("", e.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );*/
  };
  const requestingSpinner = () => (
    <View
      style={{
        margin: 20,
        paddingVertical: 70,
      }}
    >
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
  const renderSuggestions = () => (
    <View style={{ paddingVertical: 20 }}>
      {state.isBluetoothEnabled ? (
        <Text style={{ fontSize: 18, color: "black" }}>
          <Icon name="bluetooth" color="dodgerblue" size={22} /> Avvicinati al
          punto di badge.
        </Text>
      ) : (
        <Text style={{ fontSize: 18, color: "black" }}>
          <Icon name="bluetooth" color="gray" size={22} /> Attiva il bluetooth.
        </Text>
      )}

      <Text
        style={{
          padding: 15,
          alignSelf: "center",
        }}
      >
        oppure
      </Text>
      <Text style={{ fontSize: 18, color: "black" }}>
        <Icon name="map-marker" color="tomato" size={24} /> Utilizza la
        posizione GPS.
      </Text>
    </View>
  );
  const badgingSection = () => {
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                maxWidth: "75%",
                overflow: "hidden",
                color: "black"
              }}
            >
              Ciao{" "}
              <Text style={styles.subtitle}>
                {truncateString(`${name} ${surname}`, 18)}
              </Text>
            </Text>
            <Button
              title="Info"
              color=""
              onPress={() => {
                navigation.navigate("Info");
              }}
            />
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardText}>Centro di costo</Text>
          <TextInput
            style={styles.cardInput}
            keyboardType="number-pad"
            maxLength={5}
            onChangeText={setCostCode}
            value={costCode}
          />
        </View>
        <View>
          {isBadging ? (
            requestingSpinner()
          ) : (
            <View>
              {isInRegion ? null : (
                <View>
                  {renderSuggestions()}
                  {isPositionRequesting ? (
                    <View style={{}}>
                      <ActivityIndicator size="large" color="tomato" />
                    </View>
                  ) : (
                    <Button
                      title="Cattura Posizione GPS"
                      onPress={() => {
                        Keyboard.dismiss();
                        findCoordinates();
                      }}
                    />
                  )}

                  {/* // DEBUG POSIZIONE */}
                  {false ? <Text>{JSON.stringify(location)}</Text> : null}
                  {location ? (
                    <View>
                      <Text>
                        Latitudine: {location.coords.latitude.toPrecision(2)}{" "}
                        Longitudine: {location.coords.longitude.toPrecision(2)}
                      </Text>
                      <Text>
                        Precisione: {location.coords.accuracy.toPrecision(2)}{" "}
                        metri
                      </Text>
                      <Button
                        title="Controlla Posizione Rilevata"
                        onPress={() => {
                          checkPosition();
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              )}
              <View>
                <View
                  style={{
                    marginTop: 70,
                    marginVertical: 20,
                  }}
                >
                  <Button
                    color="limegreen"
                    disabled={isInRegion || location ? false : true}
                    title="Timbra Ingresso"
                    onPress={() => doBadge(BADGE_IN)}
                  />
                </View>
                <View
                  style={{
                    marginVertical: 20,
                  }}
                >
                  <Button
                    color="tomato"
                    disabled={isInRegion || location ? false : true}
                    title="Timbra Uscita"
                    onPress={() => doBadge(BADGE_OUT)}
                  />
                </View>
                <View
                  style={{
                    marginTop: 70,
                    marginVertical: 20,
                  }}
                >
                  <Button
                    color="turquoise"
                    disabled={isInGateRegion ? false : true}
                    title="Apri Cancello"
                    onPress={() => doGateOpen()}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };
  const debugButtons = () => {
    return (
      <>
        <Button
          title="MONITORING-ON"
          onPress={() => {
            startMonitoring(REGION);
          }}
        />
        <Button
          title="MONITORING-OFF"
          onPress={() => {
            stopMonitoring(REGION);
          }}
        />
        <Button
          title="RANGING-ON"
          onPress={() => {
            startRanging(REGION);
          }}
        />
        <Button
          title="RANGING-OFF"
          onPress={() => {
            stopRanging(REGION);
          }}
        />
      </>
    );
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  return (
    <>
      <PolicyModal />

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <View
            style={{
              padding: 20,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {state.badgeCode ? badgingSection() : null}

            {alertEnabled ? debugButtons() : null}
            <View style={{ flex: 1 }} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    color: "black"
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "black"
  },
  text: {
    fontSize: 16,
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
    minHeight: 40,
    color: "black"
  },
  buttonView: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "deepskyblue",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
});

const requestLocationAndNearbyDevicesPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN],
      {
        title: "Permesso Localizzazione e Accesso Dispositivi Bluetooth nelle vicinanze",
        message:
          "MI Timbra necessita del permesso di accedere alla posizione e ai dispositivi bluetooth per poter funzionare correttamente.",
        buttonNeutral: "Chiedi dopo",
        buttonNegative: "Rifiuta",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      // permission denied
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

/*const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permesso Localizzazione",
        message:
          "MI Timbra necessita del permesso di accedere alla posizione per riuscire ad utilizzare il bluetooth del disposivo.",
        buttonNeutral: "Chiedi dopo",
        buttonNegative: "Rifiuta",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      // permission denied
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};*/