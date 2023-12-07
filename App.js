import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
//import { ModalPortal } from 'react-native-modals';

import Provider from "./provider/provider";

import { MERIMP_BLUE, STATUSBAR_COLOR } from "./utils/config";
import MyNavigator from "./AppNavigator";

const App: () => React$Node = () => {
  return (
    <Provider>
      <StatusBar barStyle="dark-content" backgroundColor={STATUSBAR_COLOR} />
      <MyNavigator />
    </Provider>
  );
};

export default App;
