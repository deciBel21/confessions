import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, SafeAreaView, TextInput } from "react-native";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { IP_ADD } from '@env';

const ConfessForm = ({ modalVisible, handleModalVisibility }) => {
    const [username, onChangeUsername] = React.useState(null);
    const [confession, onChangeConfession] = React.useState(null);

    const handleSubmitClick = async function(bool) {
        const data = {
            username,
            message: confession
        }
        const token = await SecureStore.getItemAsync('token');
        console.log("TOKEN", token)
        axios.post(`${IP_ADD}:8080/user/confession`, data, { headers: { 'Authorization': `Bearer ${token}` } })
            .then((res) => {
                if(res.data.success) {
                    console.log(res.data.result);
                    handleModalVisibility(bool);
                }
            })
            .catch((e) => console.log(e));
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    handleModalVisibility(!modalVisible);
                }}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <SafeAreaView>
                            <Text style={styles.header}>Confess</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeUsername}
                                value={username}
                                placeholder="Username"
                            />
                            <TextInput
                                style={styles.inputMultiline}
                                onChangeText={onChangeConfession}
                                value={confession}
                                placeholder="Confession"
                                multiline={true}
                            />
                        </SafeAreaView>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleSubmitClick(!modalVisible)}
                            >
                            <Text style={styles.textStyle}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    height: "100%",
    width: "100%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingTop: 70,
    paddingBottom: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    margin: 12,
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    // backgroundColor: "#F194FF",
    backgroundColor: "#000",
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
    backgroundColor: "#000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputMultiline: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top"
  },
  header: {
    alignSelf:'center',
    fontSize: 35,
    // marginTop:-42,
    marginBottom: 20,
    fontWeight:'bold',
    alignItems:'center',
    color:'black'
  },
});

export default ConfessForm;