import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useContext, useState } from "react";
import { BleManager } from "react-native-ble-plx";
import { DeviceContext } from "../../context/DevicesContext";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";
import { IDeviceCtx, IDevicesList } from "../../types/Device";
import DevicesList from "./DevicesList";
import ScanningButton from "./ScanningButton";
import Loading from "../ui/Loading";

const SearchDevices = () => {
  const bleManager = new BleManager();
  const [devices, setDevices] = useState<IDevicesList>({});
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const deviceCtx = useContext(DeviceContext) as IDeviceCtx;

  const scan = async () => {
    setScanning(true);
    setScanned(true);
    const temp: IDevicesList = {};

    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ]);
    console.log("Scanning...");

    bleManager.startDeviceScan(null, null, (err, device) => {
      if (device && device.id && device.name) {
        temp[device.id] = device;
        setDevices({ ...temp, [device.id]: device });
      }

      if (err) {
        setScanning(false);
        setScanned(false);
        bleManager.stopDeviceScan();

        if (err.errorCode === 601) {
          Alert.alert(err.message, "Please enable your location services", [
            {
              text: "OKAY",
              style: "default",
            },
          ]);
        }
        if (err.errorCode === 102) {
          Alert.alert(err.message, "Please enable bluetooth", [
            {
              text: "OKAY",
              style: "default",
            },
          ]);
        } else {
          Alert.alert(err.message, "", [
            {
              text: "OKAY",
              style: "default",
            },
          ]);
        }
      }
    });

    setTimeout(() => {
      setScanning(false);
      bleManager.stopDeviceScan();
    }, 5 * 1000);
  };

  return (
    <View style={styles.container}>
      <ScanningButton scanning={scanning} scan={scan} scanned={scanned} />
      {!Object.keys(devices).length && scanning && <Loading color="black" />}
      <DevicesList
        deviceCtx={deviceCtx}
        devicesList={devices}
        setDeviceList={setDevices}
      />
    </View>
  );
};

export default SearchDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
});
