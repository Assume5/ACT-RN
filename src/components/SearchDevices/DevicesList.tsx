import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { IDeviceCtx, IDevicesList } from "../../types/Device";
import Icon from "../ui/Icon";
import { connectDevice } from "../../bluethooth/bluethooth";
import { Colors } from "../../theme/color";
import { Device } from "react-native-ble-plx";

interface Props {
  devicesList: IDevicesList;
  setDeviceList: React.Dispatch<React.SetStateAction<IDevicesList>>;
  deviceCtx: IDeviceCtx;
}

const DevicesList: React.FC<Props> = ({
  devicesList,
  deviceCtx,
  setDeviceList,
}) => {
  const onConnectClick = async (device: Device) => {
    const res = await connectDevice(device, deviceCtx);
    if (res.connected) {
      const temp = { ...devicesList };
      delete temp[device.id];
      setDeviceList(temp);
    }
  };
  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(devicesList).map((id) => {
          return (
            <View key={id} style={styles.deviceContainer}>
              <>
                <Icon icon="phone-portrait-sharp" size={16} color="black" />
                <View style={styles.deviceTextContainer}>
                  <Text
                    style={styles.text}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {devicesList[id].name}
                  </Text>
                  <Text
                    style={styles.text}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {devicesList[id].id}
                  </Text>
                </View>
                <View
                  style={[styles.iconContainer, styles.deviceIconContainer]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.pressContainer,
                      pressed && styles.pressed,
                    ]}
                    android_ripple={{ color: Colors.invertedPrimary }}
                    onPress={() => onConnectClick(devicesList[id])}
                  >
                    <Icon
                      size={20}
                      icon={"md-add-circle-outline"}
                      color={"black"}
                    />
                    <Text style={styles.text}>Connect</Text>
                  </Pressable>
                </View>
              </>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default DevicesList;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginVertical: 24,
  },
  deviceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "black",
    padding: 8,
  },
  deviceTextContainer: {
    marginHorizontal: 16,
  },
  deviceIconContainer: {
    width: 120,
    marginTop: 0,
    borderWidth: 0,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "black",
    width: 200,
    marginTop: 16,
  },
  text: {
    color: "black",
    maxWidth: 120,
  },
  pressContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
