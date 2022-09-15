import Screens from "./src/nav";
import { LogBox } from "react-native";
import { DeviceDataContextProvider } from "./src/context/DeviceDataContext";
import { DeviceContextProvider } from "./src/context/DevicesContext";

export default function App() {
  LogBox.ignoreLogs(["new NativeEventEmitter"]);
  return (
    <>
      <DeviceDataContextProvider>
        <DeviceContextProvider>
          <Screens />
        </DeviceContextProvider>
      </DeviceDataContextProvider>
    </>
  );
}
