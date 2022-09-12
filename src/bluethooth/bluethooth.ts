import { BleManager, Device } from "react-native-ble-plx";
import { IDeviceCtx } from "../types/Device";
import { Buffer } from "buffer";

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
        console.log(j.serviceUUID);
        if (j.isWritableWithResponse || j.isWritableWithoutResponse) {
          isWriteable = true;
          writeUUID = j.uuid;
          writeServiceUUID = j.serviceUUID;
          console.log("isWritableWithResponse:", j.serviceUUID, j.uuid);
        }

        if (j.isReadable) {
          isReadable = true;
          readUUID = j.uuid;
          readServiceUUID = j.serviceUUID;
          console.log("isReadable:", j.serviceUUID, j.uuid);
        }

        if (j.isNotifiable) {
          isNotifiable = true;
          notifyUUID = j.uuid;
          notifyServiceUUID = j.serviceUUID;
          console.log("isNotifiable:", j.serviceUUID, j.uuid);
        }
      }
    }
    console.log(
      device.name,
      await device.isConnected(),
      isNotifiable,
      isReadable,
      isWriteable,
      writeUUID,
      writeServiceUUID,
      readUUID,
      readServiceUUID,
      notifyUUID,
      notifyServiceUUID
    );

    deviceCtx.connect(
      device,
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
  } catch (error) {
    console.log(`Error connecting to device ${device.name}: ${error}`);
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
