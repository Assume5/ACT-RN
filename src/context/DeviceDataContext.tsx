import { Children, createContext, useState } from "react";
import { IDeviceData } from "../types";

export const DeviceDataContext = createContext({
  temperatureC: 0,
  temperatureF: 0,
  humidity: 0,
  updateTemperatureC: (temp: number) => {},
  updateTemperatureF: (temp: number) => {},
  updateHumidity: (humidity: number) => {},
});

type Props = {
  children: JSX.Element;
};

export const DeviceDataContextProvider = ({ children }: Props) => {
  const [temperatureC, setTemperatureC] = useState(-999);
  const [temperatureF, setTemperatureF] = useState(-999);
  const [humidity, setHumidity] = useState(-999);

  const updateTemperatureC = (temp: number) => {
    setTemperatureC(temp);
  };
  const updateTemperatureF = (temp: number) => {
    setTemperatureF(temp);
  };
  const updateHumidity = (humidity: number) => {
    setHumidity(humidity);
  };

  const value = {
    temperatureC,
    temperatureF,
    humidity,
    updateTemperatureC,
    updateTemperatureF,
    updateHumidity,
  };

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
};
