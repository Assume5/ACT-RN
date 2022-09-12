import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../../components/ui/IconButton";
import SearchDevices from "../../components/SearchDevices/SearchDevices";
import BottomSheet from "../../components/BottomSheet/BottomSheet";
import { Colors } from "../../theme/color";
import { DeviceContext } from "../../context/DevicesContext";
import Icon from "../../components/ui/Icon";
const { width, height } = Dimensions.get("screen");

const Devices = () => {
  const devicesCtx = useContext(DeviceContext);
  const navigation = useNavigation();
  const [addNewDevice, setAddNewDevice] = useState(false);

  const onHeaderRightClick = () => {
    setAddNewDevice(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon="add"
            size={25}
            color="white"
            onPress={onHeaderRightClick}
          />
        );
      },
    });
  }, []);

  useEffect(() => {
    //fetching connected devices on db or local storage
  }, []);

  return (
    <View
      style={[
        styles.container,
        !devicesCtx.devices.length && { justifyContent: "center" },
      ]}
    >
      {devicesCtx.devices.length > 0 &&
        devicesCtx.devices.map((device) => {
          return (
            <View style={styles.deviceContainer} key={device.device.id}>
              <Icon icon="phone-portrait" color="white" size={18} />
              <Text style={styles.text}>{device.device.name}</Text>
              <Text style={styles.text}>
                {device.connected ? "Connected" : "Not Connect"}
              </Text>
            </View>
          );
        })}
      {!devicesCtx.devices.length && (
        <View style={styles.emptyDevicesContainer}>
          <IconButton
            icon="add-circle-sharp"
            size={75}
            color="white"
            onPress={onHeaderRightClick}
          />
          <Text style={styles.text}>No Devices Connected Yet.</Text>
        </View>
      )}

      <BottomSheet show={addNewDevice} setShow={setAddNewDevice}>
        <>
          <SearchDevices />
        </>
      </BottomSheet>
    </View>
  );
};

export default Devices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height,
    backgroundColor: Colors.primaryBg,
    paddingVertical: 20,
  },
  emptyDevicesContainer: {
    width,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text: {
    color: "white",
  },
  deviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 2,
    borderColor: "white",
    width: width - 15,
    borderRadius: 10,
    marginBottom: 15,
  },
});
