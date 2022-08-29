import Screens from "./src/screens";
import { LogBox } from "react-native";
import { DeviceDataContextProvider } from "./src/context/DeviceDataContext";

export default function App() {
  LogBox.ignoreLogs(["new NativeEventEmitter"]);
  return (
    <>
      <DeviceDataContextProvider>
        <Screens />
      </DeviceDataContextProvider>
    </>
  );
}
