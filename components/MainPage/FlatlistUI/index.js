import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, Alert, Modal, Pressable, FlatList,ScrollView, Dimensions } from 'react-native';
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
  const [isLoading, setisLoading]= useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const getData = async() =>{
    try {
      setisLoading(true);
      return fetch('http://192.168.29.183:8080/confession/confessions')
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.confessions.reverse())
        setIsFetching(false);
      })
      .catch((e) => console.log(e))
      

    } catch (error) {
      console.log(error)
    }
  }
  console.log(data);
  const {values} = data

  const onRefresh = () => {
    setIsFetching(true);
    getData();
  };

  
  useEffect(() => {
   getData();
  },[])
 
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
      <View style={styles.headerFooterStyle}>
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
      </View>
    )

  }

  const Footer = () => {
    //View to set in Footer
    return (
      <View style={styles.headerFooterStyle}>
        <Text>The End!</Text>
      </View>
    );
  };
 
  return (
  <View style={{backgroundColor:'#000000'}}>
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
      <View style={{flex:1,padding:1, elevation:10}}>
      <Card style={{padding: 11, margin: 10, borderRadius:25, elevation:10,alignSelf:'center',backgroundColor:'#404040'}}>
        <Text style={styles.date}>{item.createdAt}</Text>
        <Text style={styles.UserName}>{item.username}</Text>
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
        color:'white'
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
      color:'white',
      fontSize:27,
      fontWeight:'bold',
    },
    Confession:{
      color:'white',
      fontSize:17,
    },
    date:{
      color:'#0ee83a'
    },
    headerFooterStyle: {
      fontSize: 35,
      marginTop:30,
      fontWeight:'bold',
      color:'black'
    },
})
export default MainPage;