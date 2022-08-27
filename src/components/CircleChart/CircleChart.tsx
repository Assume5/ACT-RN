import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Svg, { Circle, CircleProps, G } from "react-native-svg";
import { Colors } from "../../theme/color";
import { useIsFocused } from "@react-navigation/native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  delay?: number;
  max?: number;
}

const CircleChart: React.FC<Props> = ({
  percentage,
  radius = 60,
  strokeWidth = 10,
  duration = 1500,
  color = Colors.ideal,
  delay = 0,
  max = 100,
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  const halfCircle = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef<View>(null);
  const inputRef = React.useRef<TextInput>();

  const animation = (toValue: number) => {
    return Animated.timing(animated, {
      delay: 0,
      toValue,
      duration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
    animated.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}`,
        });
      }
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      animated.removeAllListeners();
    };
  }, [percentage]);

  return (
    <View>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation={"-90"} origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx={"50%"}
            cy={"50%"}
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill={"transparent"}
            strokeOpacity={0.2}
          />
          <Circle
            ref={circleRef}
            cx={"50%"}
            cy={"50%"}
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill={"transparent"}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <AnimatedInput
        ref={inputRef}
        underlineColorAndroid={"transparent"}
        editable={false}
        defaultValue="0"
        style={[styles.inputText, { color: color }]}
      />
    </View>
  );
};

export default CircleChart;

const styles = StyleSheet.create({
  inputText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
