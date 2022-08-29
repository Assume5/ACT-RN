import { Children, createContext, useState } from "react";
import { IDeviceData } from "../types";

export const DeviceDataContext = createContext({
  data: {
    humidity: "",
    temperatureC: "",
    temperatureF: "",
  } as IDeviceData,
  updateData: (
    humidity: string,
    temperatureC: string,
    temperatureF: string
  ) => {},
});

type Props = {
  children: JSX.Element;
};

export const DeviceDataContextProvider = ({ children }: Props) => {
  const [data, setData] = useState<IDeviceData>({
    humidity: "",
    temperatureC: "",
    temperatureF: "",
  });
  const updateData = (
    humidity: string,
    temperatureC: string,
    temperatureF: string
  ) => {
    setData({
      humidity,
      temperatureC,
      temperatureF,
    });
  };

  const value = { data, updateData };

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
};
