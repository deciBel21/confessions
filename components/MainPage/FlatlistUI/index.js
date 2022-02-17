import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, Alert, Modal, Pressable, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Card} from 'react-native-shadow-cards';
import ConfessForm from '../../ConfessForm';

import { IP_ADD } from '@env';
import axios from 'axios';

//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const [college, onChangeCollege] = useState("All Colleges");
  const [colleges, setColleges] = useState([]);

  const handleModalVisibility = function(bool) {
    setModalVisible(bool);
    getData();
  }
  const [data, setData] =useState([]);
  const [isLoading, setisLoading]= useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const getColleges = async () => {
    axios.get(`${IP_ADD}:8080/college/colleges`)
      .then((res) => {
        setColleges(res.data.colleges);
      })
      .catch((err) => console.log("GET Colleges Error:-", err))
  }

  const getData = async() =>{
    try {
      setisLoading(true);
      if(college === "All Colleges") {
        return fetch(`${IP_ADD}:8080/confession/confessions`)
                .then((response) => response.json())
                .then((responseJson) => {
                  setData(responseJson.confessions.reverse())
                  setIsFetching(false);
                })
                .catch((e) => console.log(e))
      }
      else {
        axios.get(`${IP_ADD}:8080/confession/confessions/${college}`)
          .then((res) => {
            setData(res.data.confessions);
          })
          .catch((err) => {
            console.log("Confession College Error:-", err);
          })
          .finally(() => setisLoading(false))
      }

    } catch (error) {
      console.log(error)
    }
  }
  const {values} = data

  const onRefresh = () => {
    setIsFetching(true);
    getData();
  };

  
  useEffect(() => {
    getColleges();
    getData();
  },[college])
 
  // const renderItem = (data) =>{
  //   return(
  //     data.map((item, index) => (
  //       <View style={{flex:1}} key={item._id}>
  //       <Card style={{padding: 10, margin: 10, borderRadius:18, elevation:10,alignSelf:'center',backgroundColor:'white'}}>
  //         <Text style={styles.date}>{item.createdAt}</Text>
  //         <Text style={styles.UserName}>{item.username}</Text>
  //         <Text style={styles.Confession}>{item.message}</Text>
  //     </Card>
  //       </View>)
  //   )
  //   )}

  const Header = () =>{
    return(
      <React.Fragment>
        <View style={styles.headerFooterStyle}>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Image style={styles.image} source={{ uri: props.photoUrl }}/>
          </TouchableOpacity>
          <Text style={styles.header}>  STES Confessions</Text> 
        </View>
        <View style={styles.filter}>
          <Picker
            selectedValue={college}
            style={{ height: 60, color: 'black', width: "45%", margin: 10 }}
            mode='dropdown'
            onValueChange={(itemValue, itemIndex) => onChangeCollege(itemValue)}
            dropdownIconColor= '#fff'
            >
            <Picker.Item label='All Colleges' value='All Colleges' />
            {
              colleges.map((college, index) => {
                return <Picker.Item  key={index} label={college.name} value={college.name} />
              })
            }
          </Picker>
        </View>
      </React.Fragment>
    )

  }

  const Footer = () => {
    //View to set in Footer
    return (
      <View style={{alignSelf:'center'}}>
        <Text style={{fontSize:15,fontWeight:'bold',padding:10}}>Thank You!</Text>
      </View>
    );
  };
 
  return (
  <View style={{backgroundColor:'white'}}>
    <View style={{padding:10}}>
      
      <FlatList 
        keyExtractor={(item, index) => 'key'+index}
        data={data}
        onRefresh={onRefresh}
        refreshing={isFetching}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        renderItem={({item}) =>
          <View style={{flex:1,padding:1, elevation:10,marginTop:1}}>
            <Card style={{padding: 10, margin: 10, borderRadius:25, elevation:10,alignSelf:'center',backgroundColor:'#defcf8'}}>
              <Text style={styles.date}>{item.createdAt}</Text>
              <Text style={styles.UserName}>{item.college}</Text>
              <Text style={styles.Confession}>{item.message}</Text>
            </Card>
          </View>
          }
        decelerationRate={'normal'}
      />
    </View>
    <ConfessForm modalVisible={modalVisible} handleModalVisibility={handleModalVisibility} />
  </View>
  );
}
const styles= StyleSheet.create({
    header: {
        alignSelf:'center',
        fontSize: 35,
        marginTop:-45,
        marginStart:25,
        fontWeight:'bold',
        alignItems:'center',
        color:'black',
        elevation:10,
        
    },
    image: {
        width:45,
        height:45,
        marginTop:15,
        borderColor: "rgba(0,0,0,0.2)",
        borderRadius: 150,
    },
    addButton:{
      alignSelf:'center',
      position:'relative',
      width:50,
      height:50,
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
      color:'#27bf13'
    },
    headerFooterStyle: {
      fontSize: 35,
      marginTop:30,
      fontWeight:'bold',
      color:'black',
    },
    filter: {
      flexDirection: 'row',
      color: '#fff'
    }
})
export default MainPage;