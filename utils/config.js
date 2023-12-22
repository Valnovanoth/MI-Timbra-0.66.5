import { StyleSheet } from "react-native";

let debug = false;
let host = debug ? "192.168.0.63" : "sigfox.merimp.com";
let port = debug ? "1880" : "1880";

export const WS_GENERATE_NONCE = `http://${host}:${port}/generateNonce`;
export const WS_URL = `http://${host}:${port}/timbratureNonce`;

export const WS_BADGE_CODE = `http://${host}:${port}/badge`;
export const WS_REQUEST_ASSOCIATION = `http://${host}:${port}/richiesta`;
export const WS_CHECK_ASSOCIATION_REQUESTED = `http://${host}:${port}/isRequested`;
export const WS_LAST_TIMBRATURE = `http://${host}:${port}/lastAccess`;

export const WS_GIVE_CONSENT = `http://${host}:${port}/giveConsent`;
export const WS_HAS_CONSENT = `http://${host}:${port}/hasConsent`;
export const WS_GET_PASSWORD = `http://${host}:${port}/getPassword`;
export const WS_HAS_PASSWORD = `http://${host}:${port}/hasPassword`;
export const WS_FORGOT_PASSWORD = `http://${host}:${port}/forgotPassword`; // unsets it so he can Register again
export const WS_GET_LAST_COSTCODE = `http://${host}:${port}/getLastCostCode`;

export const WS_GATE_OPEN = `http://${host}:${port}/openGate`;

export const WS_IS_DEVICE_REGISTERED = `http://${host}:${port}/isDeviceRegistered`;

export const WS_REGISTER = `http://${host}:${port}/register`;
export const WS_CHECK_PENDING_DELETION = `http://${host}:${port}/checkPendingDeletion`;
export const WS_LOGIN = `http://${host}:${port}/login`;

// true to enable debug alerts
export const DEBUG_ALERTS = false;

export const BADGE_IN = "in";
export const BADGE_OUT = "out";

export const DEFAULT_REGION = {
  identifier: "REGION1",
  uuid: null,
};
export const REGION0 = {
  identifier: "REGION1",
  uuid: "c7c1a1bf-bb00-4cad-8704-9f2d2917ded2",
  major: 1,
  minor: 1
};
export const REGIONGATE0 = {
  identifier: "REGIONGATE1",
  uuid: "c7c1a1bf-bb00-4cad-8704-9f2d2917ded3",
  major: 2,
  minor: 1
};
export const REGION1 = {
  identifier: "REGION1",
  uuid: "c7c1a1bf-bb00-4cad-8704-9f2d2917ded2",
  major: 1,
  minor: 1,
};
export const REGION2 = {
  identifier: "REGION1",
  uuid: "c7c1a1bf-bb00-4cad-8704-9f2d2917ded2",
  major: 1,
  minor: 2,
};
export const DEFAULT_BEACON = {
  proximity: "immediate",
  major: 1,
  distance: 0.6216304791867999,
  rssi: -65,
  minor: 1,
  uuid: "c7c1a1bf-bb00-4cad-8704-9f2d2917ded2",
};

export const THEME = StyleSheet.create({
  header: {
    backgroundColor: "#1e3956",
  },
});

export const MERIMP_BLUE = "#1e3956";
export const CMAT_GRAY = "#d7d7d7";
export const CMAT_BLUE = "#0b0e2d";

export const CMAT_MAIL = "it@merimp.com";

export const STATUSBAR_COLOR = CMAT_GRAY;
export const HEADER_BACKGROUND = CMAT_GRAY;
export const HEADER_TITLE_COLOR = CMAT_BLUE;
export const HEADER_TITLE_TEXT = "MI TIMBRA";
