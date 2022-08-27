import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

const BottomModal = () => {
  return (
    <Modal>
      <View style={styles.container}>
        <Text>Bottom</Text>
      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  root: {},
  container: {
    height: "50%",
    justifyContent: "flex-end",
  },
});
