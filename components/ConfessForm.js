import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, SafeAreaView, TextInput } from "react-native";
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { IP_ADD } from '@env';

const ConfessForm = ({ modalVisible, handleModalVisibility }) => {
    const [college, onChangeCollege] = useState("SIT");
    const [confession, onChangeConfession] = useState(null);
    const [formError, setFormError] = useState(false);
    const [colleges, setColleges] = useState([]);

    const getColleges = async () => {
      axios.get(`${IP_ADD}:8080/college/colleges`)
        .then((res) => {
          setColleges(res.data.colleges);
        })
        .catch((err) => console.log("GET Colleges Error:-", err))
    }

    useEffect(() => {
      getColleges();
    },[])

    const handleSubmitClick = async function(bool) {
        const data = {
            college,
            message: confession
        }
        const token = await SecureStore.getItemAsync('token');
        if(college && confession) {
            axios.post(`${IP_ADD}:8080/user/confession`, data, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    if(res.data.success) {
                        console.log(res.data.result);
                        handleModalVisibility(bool);
                    }
                })
                .catch((e) => console.log(e));
        }
        else {
            setFormError(!formError)
        }
    }

    const handleFormChange = function(type, value) {
        setFormError(false);
        type == "college" ? onChangeCollege(value) : onChangeConfession(value);
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
                            <View style={styles.collegePicker}>
                              <Picker
                                selectedValue={college}
                                style={{ height: 50, width: "100%" }}
                                mode='dropdown'
                                dropdownIconColor= 'black'
                                onValueChange={(itemValue, itemIndex) => onChangeCollege(itemValue)}
                              >
                                {
                                  colleges.map((college, index) => {
                                    return <Picker.Item key={index} label={college.name} value={college.name} />
                                  })
                                }
                              </Picker>
                            </View>
                            <TextInput
                                style={styles.inputMultiline}
                                onChangeText={(value) => handleFormChange("confession", value)}
                                value={confession}
                                placeholder="Confession"
                                multiline={true}
                            />
                            {   
                                formError ? 
                                <Text style={styles.formError}>Please enter college and confession to continue.</Text>
                                :
                                <React.Fragment />
                            }
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
  formError:{
    color:'red',
    fontSize:15,
    margin: 12,
    marginTop: 8
  },
  collegePicker: {
    margin: 12,
    borderWidth: 1,
    // padding: 10,
  }
});

export default ConfessForm;