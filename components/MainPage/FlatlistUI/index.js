import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, Alert, Modal, Pressable, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Card} from 'react-native-shadow-cards';
import ConfessForm from '../../ConfessForm';
import { SimpleLineIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';  

import { IP_ADD } from '@env';
import axios from 'axios';

//Fetch the font
const fetchFonts = async () =>
   Font.loadAsync({
    'Header': require('../../../assets/fonts/FredokaOne-Regular.ttf'),
    'username' : require('../../../assets/fonts/DMSerifDisplay-Regular.ttf'),
    'style': require('../../../assets/fonts/Aldrich-Regular.ttf')
  });

//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const [college, onChangeCollege] = useState("All Colleges");
  const [colleges, setColleges] = useState([]);
  const [fontLoaded, setFontLoaded ] = useState(false);

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
  const likeFunction = (id) =>{
    alert(`Confession Liked: ${id}`)
  }

  const dislikeFunction = (id) =>{
    alert(`Confession disliked: ${id}`)
  }

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
            <Image style={styles.image} source={{ uri: props.photoUrl }}/>
          <Text style={styles.header}>  STES Confessions</Text> 
        </View>
        <View style={styles.filter}>
          <Picker
            selectedValue={college}
            style={{ height: 60, color: 'black', width: "45%", margin: 10 }}
            mode='dropdown'
            onValueChange={(itemValue, itemIndex) => onChangeCollege(itemValue)}
            dropdownIconColor= 'black'
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
        <Text style={{fontSize:15,fontWeight:'bold',padding:10,color:'white'}}>Thank You!</Text>
      </View>
    );
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

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
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-around',marginStart:230,marginTop:20}}>
              <TouchableOpacity
              onPress={() => likeFunction(item._id)}
             >
             <SimpleLineIcons name="like" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={{width:'50%'}}
              onPress={() => dislikeFunction(item._id)}
             >
             <SimpleLineIcons name="dislike" size={24} color="black" />
            </TouchableOpacity>
              </View>
            </Card>
          </View>
          }
        decelerationRate={'normal'}
      />
    </View>
    <ConfessForm modalVisible={modalVisible} handleModalVisibility={handleModalVisibility} />
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.add}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
  </View>
  );
}
const styles= StyleSheet.create({
    header: {
        alignSelf:'center',
        fontSize: 30,
        marginTop:-39,
        marginStart:25,
        alignItems:'center',
        color:'black',
        elevation:10,
        fontFamily:'Header'
        
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
      fontSize:25,
      fontWeight:'900',
      fontFamily:'username',
    },
    Confession:{
      color:'black',
      fontSize:18,
      opacity:0.57,
      fontFamily:'style'
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
    },
    likeButton:{
      height:30,
      width:30,
    },
    dislikeButton:{
      marginTop:5,
      height:30,
      width:30,
    },
    add: {
      position: 'absolute',
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom:100,
      backgroundColor: '#03A9F4',
      borderRadius: 30,
      elevation: 8
    },
    addIcon: {
      fontSize: 50,
      marginTop:-8,
      color: 'white',
    }
})
export default MainPage;
// marginStart:190,
// marginTop:10,
// height:40,
// width:40,

// marginStart:250,
//       marginTop:-30,
//       height:40,
//       // width:40