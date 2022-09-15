import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import ESP32 from "../screens/ESP32/ESP32";
import { Colors } from "../theme/color";
import BottomTapNav from "./BottomTapNav";

export default function Screens() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primaryBg,
            },
            headerTitleStyle: {
              fontSize: 18,
            },
            headerTintColor: "white",
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="overview"
            component={BottomTapNav}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="ESP32" component={ESP32} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
