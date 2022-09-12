import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../theme/color";
import DeviceDetail from "../screens/DeviceDetail/DeviceDetail";
import { Ionicons } from "@expo/vector-icons";
import PastDetails from "../screens/PastDetails/PastDetails";
import SearchDevices from "../components/SearchDevices/SearchDevices";
import TopBarTapNav from "./TopBarTapNav";
import Account from "../screens/Account/Account";
import Devices from "../screens/Devices/Devices";
import IconButton from "../components/ui/IconButton";
const BottomTap = createBottomTabNavigator();

const BottomTapNav = () => {
  return (
    <BottomTap.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryBg,
        },
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: "white",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryBg,
          borderTopColor: Colors.grey,
        },
        headerTitleAlign: "center",
        tabBarActiveTintColor: Colors.invertedPrimary,
        unmountOnBlur: true,
      }}
    >
      <BottomTap.Screen
        name="Devices"
        component={Devices}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTap.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      <BottomTap.Screen
        name="SearchDevices"
        component={SearchDevices}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </BottomTap.Navigator>
  );
};

export default BottomTapNav;
