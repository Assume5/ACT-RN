import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../theme/color";
import CircleChart from "../../components/CircleChart/CircleChart";
import { useIsFocused } from "@react-navigation/native";
import BottomModal from "../../components/BottomModal/BottomModal";

const DeviceDetail = () => {
  const [data, setData] = useState([
    {
      name: "humidity",
      percentage: 60,
      color: Colors.warning,
    },
    {
      name: "°C",
      percentage: 20,
      color: Colors.ideal,
    },
    {
      name: "Danger",
      percentage: 100,
      color: Colors.danger,
    },
  ]);

  return (
    <>
      <View style={styles.container}>
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
      </View>
    </>
  );
};

export default DeviceDetail;

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
