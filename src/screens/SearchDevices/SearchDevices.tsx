import {
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";
import IconButton from "../../components/ui/IconButton";
import { Colors } from "../../theme/color";
import { Buffer } from "buffer";
import {
  DEVICE_NOTIFY_UUID,
  DEVICE_SERVICE_UUID,
  DEVICE_WRITE_UUID,
} from "../../utils/constants";
import { DeviceDataContext } from "../../context/DeviceDataContext";
type DevicesList = {
  [key: string]: Device;
};

const SearchDevices = () => {
  const bleManager = new BleManager();
  const [devices, setDevices] = useState<DevicesList>({});
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device>();
  const deviceDataCtx = useContext(DeviceDataContext);

  const scan = async () => {
    setScanning(true);
    setScanned(true);
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ]);
    const temp: DevicesList = {};

    bleManager.startDeviceScan(null, null, (err, device) => {
      console.log("Scanning...");
      if (device && device.id && device.name && device.isConnectable) {
        temp[device.id] = device;
        setDevices(temp);
      }
    });

    setTimeout(() => {
      setScanning(false);
      bleManager.stopDeviceScan();
    }, 5 * 1000);
  };

  const connect = async (device: Device) => {
    const connected = await device.connect();
    const deviceConnect =
      await connected.discoverAllServicesAndCharacteristics();
    console.log("Connected to", device.name);
    setConnectedDevice(deviceConnect);
  };

  const testRead = async () => {
    if (connectedDevice) {
      await connectedDevice.monitorCharacteristicForService(
        DEVICE_SERVICE_UUID,
        DEVICE_NOTIFY_UUID,
        async (err, characteristic) => {
          if (characteristic && characteristic.value) {
            const data = Buffer.from(characteristic.value, "base64");
            const dataJson = data.toJSON();
            console.log(String.fromCharCode.apply(null, dataJson.data));
          }

          if (err) {
            console.log("ERROR TEST READ: ", err);
          }
        }
      );
    }
  };

  const testWrite = async () => {
    if (connectedDevice) {
      await connectedDevice.discoverAllServicesAndCharacteristics();
      const u1 = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
      const u2 = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        DEVICE_SERVICE_UUID,
        DEVICE_WRITE_UUID,
        Buffer.from(`${"FUCK YOU TIANYO"}\r\n`).toString("base64")
      );
    }
  };

  return (
    <View style={styles.container}>
      {!scanning && (
        <View style={styles.iconContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.pressContainer,
              pressed && styles.pressed,
            ]}
            android_ripple={{ color: Colors.invertedPrimary }}
            onPress={() => scan()}
          >
            <IconButton size={20} icon={"bluetooth"} color={"white"} />
            <Text style={styles.text}>
              {scanned ? "Scan Again" : "Start Scanning"}
            </Text>
          </Pressable>
        </View>
      )}
      {scanning && (
        <View style={styles.iconContainer}>
          <IconButton size={20} icon={"bluetooth"} color={"white"} />
          <Text style={styles.text}>Scanning...</Text>
        </View>
      )}
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(devices).map((id) => {
          return (
            <View key={id} style={styles.deviceContainer}>
              <>
                <IconButton
                  icon="phone-portrait-sharp"
                  size={16}
                  color="white"
                />
                <View style={styles.deviceTextContainer}>
                  <Text style={styles.text}>{devices[id].name}</Text>
                  <Text style={styles.text}>{devices[id].id}</Text>
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
                    onPress={() => connect(devices[id])}
                  >
                    <IconButton
                      size={20}
                      icon={"md-add-circle-outline"}
                      color={"white"}
                    />
                    <Text style={styles.text}>Connect</Text>
                  </Pressable>
                </View>
              </>
            </View>
          );
        })}
      </ScrollView>
      <Pressable onPress={() => testRead()} style={styles.pressContainer}>
        <Text>Test Read</Text>
      </Pressable>

      <Pressable onPress={() => testWrite()} style={styles.pressContainer}>
        <Text>Test Write</Text>
      </Pressable>
    </View>
  );
};

export default SearchDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "white",
    width: 200,
    marginTop: 16,
  },
  text: {
    color: "white",
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
  scrollContainer: {
    flex: 1,
    marginVertical: 24,
  },
  deviceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "white",
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
});
