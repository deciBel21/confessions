import React, { useState } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, Alert, Modal, Pressable } from 'react-native';

import ConfessForm from '../../ConfessForm';
//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const handleModalVisibility = function(bool){
    setModalVisible(bool);
  }
  return (
    <View>
      <Image style={styles.image} source={{ uri: props.photoUrl }}/>
      <Text style={styles.header}>Stes Confessions</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        >
        <Image
          style={styles.addButton}
          source={require('../../../assets/add.png')}
        />
      </TouchableOpacity>
      <ConfessForm modalVisible={modalVisible} handleModalVisibility={handleModalVisibility} />
    </View>
  );
}
const styles= StyleSheet.create({
    header: {
        alignSelf:'center',
        fontSize: 35,
        marginTop:-42,
        marginStart:25,
        fontWeight:'bold',
        alignItems:'center',
        color:'black'
    },
    image: {
        alignContent:'center',
        marginTop: 50,
        marginStart:10,
        width: 40,
        height: 40,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 3,
        borderRadius: 150
    },
    addButton:{
      marginTop:635,
      width:65,
      marginStart:300,
      height:55,
      alignContent:'center',
      padding:10,
      borderRadius:100,
    }
})
export default MainPage;