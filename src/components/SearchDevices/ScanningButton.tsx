import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "../ui/Icon";
import { Colors } from "../../theme/color";

interface Props {
  scanning: boolean;
  scanned: boolean;
  scan: () => void;
}

const ScanningButton: React.FC<Props> = ({ scanning, scanned, scan }) => {
  return (
    <>
      {!scanning && (
        <View style={styles.iconContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.pressContainer,
              pressed && styles.pressed,
            ]}
            android_ripple={{ color: Colors.invertedPrimary }}
            onPress={() => scan()}
          >
            <Icon size={20} icon={"bluetooth"} color={"black"} />
            <Text style={styles.text}>
              {scanned ? "Scan Again" : "Start Scanning"}
            </Text>
          </Pressable>
        </View>
      )}
      {scanning && (
        <View style={styles.iconContainer}>
          <Icon size={20} icon={"bluetooth"} color={"black"} />
          <Text style={styles.text}>Scanning...</Text>
        </View>
      )}
    </>
  );
};

export default ScanningButton;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "black",
    width: 200,
    marginTop: 16,
  },
  text: {
    color: "black",
    maxWidth: 120,
  },
  pressContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
