import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";

interface Props {
  size?: number | "large" | "small" | undefined;
  color?: string;
}

const Loading = ({ size = "large", color = "white" }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
