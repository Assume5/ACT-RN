import {
  Animated,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Easing,
  StyleSheet,
  PanResponder,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../theme/color";

interface Props {
  children: JSX.Element;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const { width, height } = Dimensions.get("screen");

const BOTTOM_SHEET_HEIGHT = height / 1.5;

const BottomSheet: React.FC<Props> = ({ children, show, setShow }) => {
  const animate = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const overlayRef = useRef<View>(null);
  const containerRef = useRef<View>(null);

  const [positionY, setPositionY] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => setPositionY(gestureState.dy),
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) setPositionY(gestureState.dy);
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log(positionY);
        if (gestureState.dy < 0) {
          setPositionY(0);
        } else {
          closeBottomSheet();
        }
        pan.flattenOffset();
      },
    })
  ).current;

  const slideUp = (setValue: number, toValue: number) => {
    animate.setValue(setValue);
    Animated.timing(animate, {
      toValue,
      duration: 400,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 1) {
        setShow(false);
        setPositionY(0);
      }
    });
  };

  const showBottomSheet = () => {
    slideUp(1, 0);
    animate.addListener((v) => {
      if (containerRef.current) {
        containerRef.current.setNativeProps({
          style: {
            bottom: -BOTTOM_SHEET_HEIGHT * v.value,
          },
        });
      }
    });
  };

  useEffect(() => {
    if (show) {
      showBottomSheet();

      return () => {
        animate.removeAllListeners();
      };
    }
  }, [show]);

  const closeBottomSheet = () => {
    slideUp(0, 1);
    animate.addListener((v) => {
      if (containerRef.current) {
        containerRef.current.setNativeProps({
          style: {
            bottom: -BOTTOM_SHEET_HEIGHT * +v.value,
          },
        });
      }
    });
  };

  return (
    <>
      {show && (
        <Pressable
          style={styles.overlayContainer}
          onPress={() => {
            closeBottomSheet();
          }}
        >
          <Animated.View style={styles.overlay} ref={overlayRef} />
        </Pressable>
      )}

      <Animated.View
        style={[styles.container, { transform: [{ translateY: positionY }] }]}
        ref={containerRef}
      >
        <Animated.View>
          <Animated.View
            style={styles.pressContainer}
            {...panResponder.panHandlers}
          >
            <View style={styles.grabber} />
          </Animated.View>
          {show && children}
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -BOTTOM_SHEET_HEIGHT,
    height: BOTTOM_SHEET_HEIGHT,
    width,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: 0,
  },
  pressContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  grabber: {
    width: 80,
    borderTopWidth: 10,
    borderRadius: 5,
    borderTopColor: Colors.primaryBg,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    flex: 1,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: { flex: 1, backgroundColor: "white", opacity: 0.2 },
});
