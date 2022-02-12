import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, Alert, Modal, Pressable, FlatList,ScrollView } from 'react-native';
import {Card} from 'react-native-shadow-cards';
import ConfessForm from '../../ConfessForm';
//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const handleModalVisibility = function(bool) {
    setModalVisible(bool);
    getData();
  }
  const [data, setData] =useState([]);
  const [isLoading, setisLoading] =useState(false);
  const [message, setMessage] = useState('');

  const getData = async() =>{
    try {
      setisLoading(true);
      return fetch('http://192.168.29.183:8080/confession/confessions')
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.confessions)
      })
      .catch((e) => console.log(e))
      

    } catch (error) {
      console.log(error)
    }
  }
  console.log(data);
  const {values} = data

  
  useEffect(() => {
   getData();
  },[])
 
  return (
    <View style={{backgroundColor:'white'}}>
      <ScrollView 
      horizontal={false}
      showsHorizontalScrollIndicator={false}>
      <View>
      <Image style={styles.image} source={{ uri: props.photoUrl }}/>
      <Text style={styles.header}>Stes Confessions</Text>
      </View>
      {data.map((item, index) => (
        <View style={{flex:1}} key={item._id}>
        <Card style={{padding: 10, margin: 10, borderRadius:18, elevation:10,alignSelf:'center',backgroundColor:'white'}}>
          <Text style={styles.date}>{item.createdAt}</Text>
          <Text style={styles.UserName}>{item.username}</Text>
          <Text style={styles.Confession}>{item.message}</Text>
      </Card>
        </View>
        
        
  ))}
    </ScrollView>
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
      width:65,
      marginStart:300,
      height:55,
      alignContent:'center',
      borderRadius:100,
    },
    UserName:{
      color:'black',
      fontSize:27,
      fontWeight:'bold',
    },
    Confession:{
      color:'black',
      fontSize:17,
    },
    date:{
      color:'#806d06'
    }
})
export default MainPage;