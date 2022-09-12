import { Children, createContext, useState } from "react";
import { Device } from "react-native-ble-plx";
import { IDeviceData } from "../types";
import { IDevice } from "../types/Device";

export const DeviceContext = createContext({
  devices: [] as IDevice[],
  disconnect: (device: Device) => {},
  connect: (
    device: Device,
    connected: boolean,
    isWriteable: boolean,
    writeUUID: string | null,
    writeServiceUUID: string | null,
    isReadable: boolean,
    readUUID: string | null,
    readServiceUUID: string | null,
    isNotifiable: boolean,
    notifyUUID: string | null,
    notifyServiceUUID: string | null
  ) => {},
});

type Props = {
  children: JSX.Element;
};

export const DeviceContextProvider = ({ children }: Props) => {
  const [devices, setDevices] = useState<IDevice[]>([]);

  const connect = (
    device: Device,
    connected: boolean,
    isWriteable: boolean,
    writeUUID: string | null,
    writeServiceUUID: string | null,
    isReadable: boolean,
    readUUID: string | null,
    readServiceUUID: string | null,
    isNotifiable: boolean,
    notifyUUID: string | null,
    notifyServiceUUID: string | null
  ) => {
    console.log("Set Device: ", device.name);
    const index = devices.findIndex((item) => item.device.id === device.id);
    console.log(index);
    if (index === -1) {
      setDevices([
        ...devices,
        {
          device,
          connected,
          isNotifiable,
          isReadable,
          isWriteable,
          writeUUID,
          readUUID,
          notifyUUID,
          writeServiceUUID,
          readServiceUUID,
          notifyServiceUUID,
        },
      ]);
    } else {
      const temp = devices;
      temp[index] = {
        device,
        connected,
        isNotifiable,
        isReadable,
        isWriteable,
        writeUUID,
        readUUID,
        notifyUUID,
        writeServiceUUID,
        readServiceUUID,
        notifyServiceUUID,
      };
      setDevices(temp);
    }
  };

  const disconnect = (device: Device) => {};

  const value = { devices, connect, disconnect };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};
