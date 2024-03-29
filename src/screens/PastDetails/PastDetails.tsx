import React, { useEffect, useRef, useState } from "react";
// import * as React from 'react'
import { PanResponder, Dimensions, View } from "react-native";
import { AreaChart, XAxis, YAxis } from "react-native-svg-charts";
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import * as shape from "d3-shape";

export default Chart;

function Chart() {
  const apx = (size = 0) => {
    let width = Dimensions.get("window").width;
    return (width / 750) * size;
  };

  const [dateList, setDateList] = useState([
    "2021-08-31 15:09:00",
    "2021-08-31 15:10:00",
    "2021-08-31 15:11:02",
    "2021-08-31 15:12:01",
    "2021-08-31 15:13:00",
    "2021-08-31 15:14:01",
    "2021-08-31 15:15:02",
    "2021-08-31 15:16:03",
    "2021-08-31 15:17:00",
    "2021-08-31 15:18:02",
    "2021-08-31 15:19:00",
    "2021-08-31 15:20:01",
    "2021-08-31 15:21:00",
    "2021-08-31 15:22:02",
    "2021-08-31 15:23:00",
    "2021-08-31 15:24:01",
    "2021-08-31 15:25:02",
    "2021-08-31 15:26:02",
    "2021-08-31 15:27:00",
    "2021-08-31 15:28:02",
    "2021-08-31 15:29:00",
    "2021-08-31 15:30:01",
    "2021-08-31 15:31:02",
    "2021-08-31 15:32:01",
    "2021-08-31 15:33:03",
    "2021-08-31 15:34:00",
    "2021-08-31 15:35:02",
    "2021-08-31 15:36:02",
    "2021-08-31 15:37:00",
    "2021-08-31 15:38:01",
  ]);
  const [priceList, setPriceList] = useState([
    47022.9649875, 47097.6349875, 47132.3149875, 47137.6449875, 47164.9949875,
    47182.6549875, 47151.5249875, 47124.4749875, 47148.8249875, 47142.2649875,
    47124.3849875, 47134.1249875, 47200.0049875, 47228.6649875, 47246.6749875,
    47255.0549875, 47299.9949875, 47374.8549875, 47417.2312875, 47372.0149875,
    47383.2149875, 47433.9349875, 47403.9149875, 47365.3949875, 47381.0049875,
    47455.1349875, 47460.8249875, 47499.9949875, 47486.1549875, 47505.6449875,
  ]);
  const size = useRef(dateList.length);

  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    })
  );

  const updatePosition = (x: number) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0); // x0 position
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth; //xN position
    const xDistance = chartWidth / size.current; // The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }
    
    // The selected coordinate x :
    // (x - x0)/ xDistance = value
    let value = +((x - x0) / xDistance).toFixed(0);
    if (value >= size.current - 1) {
      value = size.current - 1; // Out of chart range, automatic correction
    }

    setPositionX(Number(value));
  };
  type t = {
    x: (v: number) => number;
    y: (v: number) => number;
    ticks: number[];
  };
  const CustomGrid = ({ x, y, ticks }: t) => {
    return (
      <G>
        {
          // Horizontal grid
          ticks.map((tick) => (
            <Line
              key={tick}
              x1="0%"
              x2="100%"
              y1={y(tick)}
              y2={y(tick)}
              stroke="#EEF3F6"
            />
          ))
        }
        {
          // Vertical grid
          priceList.map((_, index) => (
            <Line
              key={index.toString()}
              y1="0%"
              y2="100%"
              x1={x(index)}
              x2={x(index)}
              stroke="#EEF3F6"
            />
          ))
        }
      </G>
    );
  };

  const CustomLine = ({ line }: { line: string }) => {
    return (
      <Path
        key="line"
        d={line}
        stroke="#FEBE18"
        strokeWidth={apx(6)}
        fill="none"
      />
    );
  };

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="rgb(134, 65, 244)" />
        <Stop offset="100%" stopColor="rgb(66, 194, 244)" />

        <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
        <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({ x, y, ticks }: t) => {
    if (positionX < 0) {
      return null;
    }

    const date = dateList[positionX];

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(priceList[positionX]) - apx(10)}
        >
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)} // borderRadius
            ry={apx(12)} // borderRadius
            width={apx(300)}
            height={apx(96)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill="rgba(224, 188, 136, 1)"
          >
            ${priceList[positionX]}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="#FEBE18"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />

          <Circle
            cy={y(priceList[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#FEBE18"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = { top: apx(40), bottom: apx(40) };

  return (
    <View
      style={{
        backgroundColor: "#1c1c1c",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: apx(750 - 50),
          height: apx(570),
          justifyContent: "center",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
          <AreaChart
            style={{ flex: 1 }}
            data={priceList}
            // curve={shape.curveNatural}
            curve={shape.curveMonotoneX}
            contentInset={{ ...verticalContentInset }}
            svg={{ fill: "url(#gradient)" }}
          >
            <CustomLine />
            <CustomGradient />
            <Tooltip />
          </AreaChart>
        </View>
      </View>
    </View>
  );
}
