import { BleError, BleManager, Device } from "react-native-ble-plx";
import { IDeviceCtx } from "../types/Device";
import { Buffer } from "buffer";
import { Alert } from "react-native";

export const connectDevice = async (device: Device, deviceCtx: IDeviceCtx) => {
  try {
    const connected = await device.connect();
    if (await connected.isConnected()) {
      console.log("Connected to", device.name);
    } else {
      console.log("Unable to connect", device.name);
    }

    await connected.discoverAllServicesAndCharacteristics();

    const services = await connected.services();
    let isWriteable = false;
    let isReadable = false;
    let isNotifiable = false;
    let writeUUID = null;
    let readUUID = null;
    let notifyUUID = null;
    let writeServiceUUID = null;
    let notifyServiceUUID = null;
    let readServiceUUID = null;
    for (const i of services) {
      const char = await i.characteristics();
      for (const j of char) {
        if (j.isWritableWithResponse || j.isWritableWithoutResponse) {
          isWriteable = true;
          writeUUID = j.uuid;
          writeServiceUUID = j.serviceUUID;
        }

        if (j.isReadable) {
          isReadable = true;
          readUUID = j.uuid;
          readServiceUUID = j.serviceUUID;
        }

        if (j.isNotifiable) {
          isNotifiable = true;
          notifyUUID = j.uuid;
          notifyServiceUUID = j.serviceUUID;
        }
      }
    }

    deviceCtx.connect(
      connected,
      await device.isConnected(),
      isWriteable,
      writeUUID,
      writeServiceUUID,
      isReadable,
      readUUID,
      readServiceUUID,
      isNotifiable,
      notifyUUID,
      notifyServiceUUID
    );

    return { connected: true };
  } catch (error: any) {
    console.log(`Error connecting to device ${device.name}: ${error}`);

    if (error.errorCode !== 203) {
      deviceCtx.connect(
        device,
        false,
        false,
        null,
        null,
        false,
        null,
        null,
        false,
        null,
        null
      );
      Alert.alert(`Unable to connect ${device.name}`, error.message, [
        {
          text: "Ok",
          style: "cancel",
        },
        { text: "Try again", onPress: () => connectDevice(device, deviceCtx) },
      ]);
    } else {
      Alert.alert(`Unable to connect ${device.name}`, error.message, [
        {
          text: "Ok",
          style: "cancel",
        },
      ]);
    }

    return { connected: false, error };
  }
};

export const write = async (
  device: Device,
  writeServiceUUID: string,
  writeUUID: string
) => {
  if (!(await device.isConnected())) {
    await device.connect();
  }

  await device.writeCharacteristicWithoutResponseForService(
    writeServiceUUID,
    writeUUID,
    Buffer.from(`${"TEST TEST"}\r\n`).toString("base64")
  );
};
