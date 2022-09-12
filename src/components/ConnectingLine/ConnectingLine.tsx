import { Animated, StyleSheet, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, { Line } from "react-native-svg";
import Icon from "../../components/ui/Icon";
import { MaterialIcons } from "@expo/vector-icons";

const AnimatedLine = Animated.createAnimatedComponent(Line);
export const ConnectingLine = () => {
  const animated = useRef(new Animated.Value(0)).current;

  const lineRef = useRef<View>(null);

  const animation = (toValue: number) => {
    animated.setValue(0);
    return Animated.timing(animated, {
      delay: 0,
      toValue,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        animation(toValue);
      }, 250);
    });
  };

  useEffect(() => {
    animation(250);
    animated.addListener((v) => {
      if (lineRef?.current) {
        // console.log(lineRef.current.props.y2);
        lineRef.current.setNativeProps({
          y2: v.value,
        });
      }
    });

    return () => {
      animated.removeAllListeners();
    };
  }, []);
  return (
    <View style={styles.rootContainer}>
      <Icon icon="md-phone-portrait-sharp" size={50} color={"black"} />
      <Svg height={250} width={5}>
        <AnimatedLine
          ref={lineRef}
          stroke="black"
          strokeWidth={5}
          strokeDasharray="7, 7"
          x1="0"
          y1="0"
          x2="0"
          y2={0}
        />
      </Svg>
      <MaterialIcons name="devices-other" size={50} color="black" />
    </View>
  );
};
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
