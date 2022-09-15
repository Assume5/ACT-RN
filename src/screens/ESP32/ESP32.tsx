import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../theme/color";
import CircleChart from "../../components/CircleChart/CircleChart";
import { DeviceDataContext } from "../../context/DeviceDataContext";
import { DeviceContext } from "../../context/DevicesContext";
import { Buffer } from "buffer";
import Loading from "../../components/ui/Loading";

type IData = {
  name: string;
  percentage: number;
  color: string;
};

interface Props {
  route?: {
    params: {
      id: string;
    };
  };
}
const ESP32 = ({ route }: Props) => {
  const devicesCtx = useContext(DeviceContext);
  const deviceDataCtx = useContext(DeviceDataContext);
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    const init = async () => {
      const device = devicesCtx.devices.find(
        (item) => item.device.id === route!.params.id
      );
      if (
        device &&
        device.notifyServiceUUID &&
        device.notifyUUID &&
        !device.monitoring
      ) {
        const isConnected = await device?.device.isConnected();
        if (!isConnected) {
          await device?.device.connect();
        }
        await device.device.discoverAllServicesAndCharacteristics();
        await device.device.monitorCharacteristicForService(
          device.notifyServiceUUID,
          device.notifyUUID,
          async (err, characteristic) => {
            if (characteristic && characteristic.value) {
              const data = Buffer.from(characteristic.value, "base64");
              const dataJson = data.toJSON();
              const dataString = String.fromCharCode.apply(null, dataJson.data);
              if (dataString.includes("Temperature-F")) {
                const data = dataString.replace(/[^0-9\.]+/g, "");
                deviceDataCtx.updateTemperatureF(+data);
              }
              if (dataString.includes("Temperature-C")) {
                const data = dataString.replace(/[^0-9\.]+/g, "");
                deviceDataCtx.updateTemperatureC(+data);
              }
              if (dataString.includes("Humidity")) {
                const data = dataString.replace(/[^0-9\.]+/g, "");
                deviceDataCtx.updateHumidity(+data);
              }
            }

            if (err) {
              console.log("ERROR TEST READ: ", err);
            }
          },
          "cancel"
        );

        devicesCtx.updateMonitoringState(device.device);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const humidity = deviceDataCtx.humidity;
    const tempF = deviceDataCtx.temperatureF;
    const tempC = deviceDataCtx.temperatureC;

    if (tempF === -999 || tempC === -999 || humidity === -999) return;
    const humidityColor =
      humidity >= 30 && humidity <= 60
        ? Colors.ideal
        : humidity <= 10 || humidity >= 80
        ? Colors.danger
        : Colors.warning;

    const tempFColor =
      tempF >= 60 && tempF <= 80
        ? Colors.ideal
        : tempF <= 30 || tempF >= 90
        ? Colors.danger
        : Colors.warning;
    setData([
      {
        name: "humidity",
        percentage: humidity,
        color: humidityColor,
      },
      {
        name: "°F",
        percentage: tempF,
        color: tempFColor,
      },
    ]);
  }, [deviceDataCtx]);

  return (
    <View style={styles.container}>
      {!data.length ? (
        <Loading />
      ) : (
        <View style={styles.chartContainer}>
          {data.map((item) => {
            return (
              <View key={item.name} style={styles.singleChart}>
                <Text style={styles.chartText}>{item.name}</Text>
                <CircleChart {...item} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ESP32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryBg,
  },
  chartContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  singleChart: {
    flex: 1,
    alignItems: "center",
  },
  chartText: {
    textAlign: "center",
    fontSize: 15,
    textTransform: "capitalize",
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
});
