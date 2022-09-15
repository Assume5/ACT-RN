import { Children, createContext, useState } from "react";
import { Device } from "react-native-ble-plx";
import { IDeviceData } from "../types";
import { IDevice, IDeviceCtx } from "../types/Device";

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
  updateMonitoringState: (device: Device) => {},
} as IDeviceCtx);

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
    const index = devices.findIndex((item) => item.device.id === device.id);
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
          monitoring: false,
        },
      ]);
    } else {
      const temp = [...devices];
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
        monitoring: false,
      };
      setDevices(temp);
    }
  };

  const updateMonitoringState = (device: Device) => {
    const index = devices.findIndex((item) => item.device.id === device.id);
    const temp = [...devices];
    temp[index].monitoring = true;
    setDevices(temp);
  };

  const disconnect = (device: Device) => {};

  const value = { devices, connect, disconnect, updateMonitoringState };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};
