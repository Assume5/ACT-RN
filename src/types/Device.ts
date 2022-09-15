import { Device } from "react-native-ble-plx";

export type IDevice = {
  device: Device;
  connected: boolean;
  isWriteable: boolean;
  writeUUID: string | null;
  writeServiceUUID: string | null;
  isReadable: boolean;
  readUUID: string | null;
  readServiceUUID: string | null;
  isNotifiable: boolean;
  notifyUUID: string | null;
  notifyServiceUUID: string | null;
  monitoring: boolean;
};

export type IDeviceCtx = {
  devices: IDevice[];
  disconnect: (device: Device) => void;
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
  ) => void;
  updateMonitoringState: (device: Device) => void;
};

export type IDevicesList = {
  [key: string]: Device;
};
