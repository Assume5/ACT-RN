import { StyleSheet, View } from "react-native";
import React from "react";
import { ConnectingLine } from "../../components/ConnectingLine/ConnectingLine";
import SearchDevices from "../../components/SearchDevices/SearchDevices";

const Account = () => {
  return (
    <View style={styles.container}>
      <ConnectingLine />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});
