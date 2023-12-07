import React, { useState, useContext, useEffect } from "react";
import DeviceInfo from 'react-native-device-info';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { getUniqueId, getManufacturer } from 'react-native-device-info';

import Icon from "react-native-vector-icons/FontAwesome";

import { StateContext } from "../provider/provider";
import { WS_LAST_TIMBRATURE } from "../utils/config";

const versionNumber = DeviceInfo.getVersion();

export default function InfoPage({ navigation }) {
  const state = useContext(StateContext);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [company, setCompany] = useState(null);
  const [badgeCode, setBadgeCode] = useState(null);
  const [timbrature, setTimbrature] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setName(state.user.name);
    setSurname(state.user.surname);
    setBadgeCode(state.badgeCode);
    setCompany(state.user.company);
  }, [state]);

  useEffect(() => {
    // let timbr = [
    //   {
    //     message: "14-12-2020 09:13 in Entrata",
    //   },
    //   {
    //     message: "11-12-2020 18:10 in Uscita",
    //   },
    // ];
    // setTimbrature(timbr);
    fetchLastTimbrature();
    return () => {
      setTimbrature([]);
    };
  }, []);

  const fetchLastTimbrature = () => {
    setRefreshing(true);
    let body = { badgeCode: state.badgeCode };
    let ret = fetch(WS_LAST_TIMBRATURE, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    })
      .then((resp) => {
        setRefreshing(false);

        switch (resp.status) {
          case 200:
            return resp.json();
          default:
            return [];
        }
      })
      .then((data) => {
        setTimbrature(data);
        return data;
      })
      .catch((e) => {
        console.log("info.fetchLastTimbrature error", e);
        setRefreshing(false);
      });
    return ret;
  };

  const renderTimbratura = ({ item }) => {
    return <Text style={styles.text}>{item.message}</Text>;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchLastTimbrature();
    //setRefreshing(false);
    //wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impostazioni</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Nome</Text>
        <TextInput
          style={styles.cardInput}
          onChangeText={setName}
          value={name}
          editable={false}
        />
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Cognome</Text>
        <TextInput
          style={styles.cardInput}
          onChangeText={setSurname}
          value={surname}
          editable={false}
        />
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Azienda</Text>
        <TextInput
          style={styles.cardInput}
          onChangeText={setCompany}
          value={company}
          editable={false}
        />
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Cod. Anagrafica</Text>
        <TextInput
          style={styles.cardInput}
          keyboardType="number-pad"
          onChangeText={setBadgeCode}
          maxLength={6}
          value={badgeCode}
          editable={false}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.subtitle}>Ultime Timbrature</Text>
        <TouchableOpacity onPress={() => fetchLastTimbrature()}>
          <Icon
            style={{
              alignSelf: "center",
              padding: 10,
              marginLeft: 15,
            }}
            name="refresh"
            color="black"
            size={20}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{}}
        renderItem={renderTimbratura}
        keyExtractor={(item, key) => "key" + key}
        data={timbrature}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Button
              title="Indietro"
              color=""
              onPress={() => {
                navigation.navigate("Home");
              }}
            />
           </View>
        </View>

        <View
          style={{
            marginTop: 70,
            marginVertical: 20,
          }}
        >
          <Text style={{
            color: "black"
          }}>Versione: {versionNumber}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "black"
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    color: "black"
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "black"
  },
  text: {
    fontSize: 18,
    color: "black"
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    color: "black"
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
    color: "black"
  },
});

