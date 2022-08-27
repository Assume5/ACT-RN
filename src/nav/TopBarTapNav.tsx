import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DeviceDetail from "../screens/DeviceDetail/DeviceDetail";
import PastDetails from "../screens/PastDetails/PastDetails";
import { Colors } from "../theme/color";

const TopBarTapNav = () => {
  const TopTab = createMaterialTopTabNavigator();
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
          color: "white",
          textTransform: "capitalize",
        },
        tabBarStyle: { backgroundColor: Colors.primaryBg },
        tabBarIndicatorStyle: { backgroundColor: Colors.invertedPrimary },
        swipeEnabled: false,
      }}
    >
      <TopTab.Screen
        name="Current"
        component={DeviceDetail}
        options={{
          title: "Current Data",
        }}
      />
      <TopTab.Screen
        name="Past"
        component={PastDetails}
        options={{
          title: "Past Data",
        }}
      />
    </TopTab.Navigator>
  );
};

export default TopBarTapNav;

const styles = StyleSheet.create({});
