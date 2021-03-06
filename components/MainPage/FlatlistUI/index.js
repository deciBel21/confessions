import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,TouchableOpacity, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Card} from 'react-native-shadow-cards';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';  
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import ConfessForm from '../../ConfessForm';

//Fetch the font
const fetchFonts = async () =>
   Font.loadAsync({
    // 'Header': require('../../../assets/fonts/FredokaOne-Regular.ttf'),
    'Header': require('../../../assets/fonts/Roboto-Medium.ttf'),
    'Confession': require('../../../assets/fonts/Roboto-Regular.ttf'),
    'username' : require('../../../assets/fonts/DMSerifDisplay-Regular.ttf'),
    'style': require('../../../assets/fonts/Aldrich-Regular.ttf')
  });

//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const [college, onChangeCollege] = useState("All Colleges");
  const [colleges, setColleges] = useState([]);
  const [sort, onChangeSort] = useState("New Confessions");
  const [sorts, setSorts] = useState([]);
  const [fontLoaded, setFontLoaded ] = useState(false);
  const [userId, setuserId] = useState('')

  const handleModalVisibility = function(bool) {
    setModalVisible(bool);
    getData();
  } 
  const [data, setData] = useState([]);
  const [isLoading, setisLoading]= useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const getColleges = async () => {
    axios.get(`${props.URL}/college/colleges`)
      .then((res) => {
        setColleges(res.data.colleges);
      })
      .catch((err) => console.log("GET Colleges Error:-", err))
  }

  const getSort = async () => {
    axios.get(`${props.URL}/sort/sorts`)
      .then((res) => {
        setSorts(res.data.sorts);
      })
      .catch((err) => console.log("GET Sort Error:-", err))
  }

  const getData = async() =>{
    try {
      setisLoading(true);
      if(college === "All Colleges" ) {
        if(sort === "New Confessions"){
          return fetch(`${props.URL}/confession/confessions`)
          .then((response) => response.json())
          .then((responseJson) => {
            setData(responseJson.confessions.reverse())
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
        }
        if(sort === "Most Liked"){
          return fetch(`${props.URL}/confession/confessions`)
          .then((response) => response.json())
          .then(responseJson => {
            const most_liked_confessions =
                responseJson.confessions
                  .sort((a,b) => a.likes>b.likes)
                  .reverse()
                  .filter( most_liked_confession => most_liked_confession.likes!=0)
            setData(most_liked_confessions)
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
      }
        if(sort === "Most Disliked"){
          return fetch(`${props.URL}/confession/confessions`)
          .then((response) => response.json())
          .then(responseJson => {
            const most_disliked_confessions =
                responseJson.confessions
                  .sort((a,b) => a.dislikes>b.dislikes)
                  .reverse()
                  .filter( most_disliked_confession => most_disliked_confession.dislikes!=0)
            setData(most_disliked_confessions)
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
        }
      }    
      else {
        if(sort ==='New Confessions'){
          return fetch(`${props.URL}/confession/confessions/${college}`)
          .then((response) => response.json())
          .then(responseJson => {
            setData(responseJson.confessions.reverse())
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
        }

        if(sort === 'Most Liked'){
          return fetch(`${props.URL}/confession/confessions/${college}`)
          .then((response) => response.json())
          .then(responseJson => {
            const most_liked_confessions =
                responseJson.confessions
                  .sort((a,b) => a.likes>b.likes)
                  .reverse()
                  .filter( most_liked_confession => most_liked_confession.likes!=0)
            setData(most_liked_confessions)
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
        }
        if(sort === 'Most Disliked'){
          return fetch(`${props.URL}/confession/confessions/${college}`)
          .then((response) => response.json())
          .then(responseJson => {
            const most_disliked_confessions =
                responseJson.confessions
                  .sort((a,b) => a.dislikes>b.dislikes)
                  .reverse()
                  .filter( most_disliked_confession => most_disliked_confession.dislikes!=0)
            setData(most_disliked_confessions)
            setIsFetching(false);
          })
          .catch((e) => console.log(e))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const likeFunction = async (confession) => {
    const token = await SecureStore.getItemAsync('token');
    let postData = {
      userId, 
      confessionId: confession._id
    }
    const confessions = [ ...data ];
    const confessionFound = confessions.find( ({ _id }) => _id === confession._id);
    const likeFound = confessionFound.likes.find(like => like.userId == userId);
    postData.disliked = false;
    postData.liked = likeFound ? false : true;
    axios.post(`${props.URL}/confession/like_dislike`, postData, {
      headers: {
        'Authorization': `Bearer ${token}`
      } 
    })
    .then(async (res) => {
      await getData();
    })
    .catch(err => console.log("LIKE ERROR:-", err))

    // setData(
    //   data.map((el, index) => {
    //     if(el._id == confession._id) {
    //       let found = false;
    //       el.likes = el.likes.map((obj, ind) => {
    //         if(obj.userId == userId) {
    //           obj.liked = !obj.liked;
    //         }
    //         return obj;
    //       })
    //       return el;
    //     }
    //   })
    // )
  }

  const dislikeFunction = async (confession) => {
    const token = await SecureStore.getItemAsync('token');
    let postData = {
      userId, 
      confessionId: confession._id
    }
    const confessions = [ ...data ];
    const confessionFound = confessions.find( ({ _id }) => _id === confession._id);
    const dislikeFound = confessionFound.dislikes.find(like => like.userId == userId);
    postData.liked = false;
    postData.disliked = dislikeFound ? false : true;
    axios.post(`${props.URL}/confession/like_dislike`, postData, {
      headers: {
        'Authorization': `Bearer ${token}`
      } 
    })
    .then(async (res) => {
      getData();
    })
    .catch(err => console.log("DISLIKE ERROR:-", err))
  }

  const onRefresh = () => {
    getData();
    getColleges();
    getSort();
  };

  const setUserIdToState = async () => {
    const userId = await SecureStore.getItemAsync('userId');
    setuserId(userId);
  }

  const liked = (confession) => {
    const likeFound = confession.likes.find(like => like.userId == userId);
    return likeFound ? true : false;
  }
  
  const disliked = (confession) => {
    const dislikeFound = confession.dislikes.find(dislike => dislike.userId == userId);
    return dislikeFound ? true : false;
  }
  
  useEffect(() => {
    console.log("NODE ENV:- ", __DEV__)
    setUserIdToState();
    getColleges();
    getSort();
    getData();
  },[college, userId, sort])

  const getTime = (iso) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // Current Date
    const current = new Date();
    // cons
    const isoMS = new Date(iso);
    const difference = Math.round((current - isoMS)/1000);

    // Seconds
    if(difference < 60) {
      return difference != 1 ? difference + ' seconds ago' : difference + ' second ago';
    }
    else {
      // Minutes
      const minutes = Math.floor(difference / 60);
      if(minutes < 60) {
        return minutes != 1 ? minutes + ' minutes ago' : minutes + ' minute ago';
      }
      else {
        // Hours
        const hours = Math.floor(minutes / 60);
        if(hours < 24) {
          return hours != 1 ? hours + ' hours ago' : hours + ' hour ago';
        }
        else {
          // Days
          const days = Math.floor(hours / 24);
          if(days <= 7) {
            return days != 1 ? days + ' days ago' : days + ' day ago';
          }
          else {
            // Date, month, year
            return `${isoMS.getDate()} ${months[isoMS.getMonth()]}, ${isoMS.getFullYear()}`
          }
        }
      }
    }
  }
 
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
            style={{ height: 60, color: 'black', width: "45%", margin: 10, marginTop: 25, marginBottom: 2 }}
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
          <Picker
            selectedValue={sort}
            style={{ height: 60, color: 'black', width: "45%", margin: 10, marginTop: 25, marginBottom: 2 }}
            mode='dropdown'
            onValueChange={(itemValue, itemIndex) => onChangeSort(itemValue)}
            dropdownIconColor= 'black'
            >
            <Picker.Item label='New Confessions' value='New Confessions' />
            {
              sorts.map((sort, index) => {
                return <Picker.Item  key={index} label={sort.sort} value={sort.sort} />
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
            <Card style={{padding: 10, margin: 10, marginBottom: 5, borderRadius:10, elevation:10,alignSelf:'center',backgroundColor:'#F5F5F5', boxShadow: 'none', shadowColor: '#fff'}}>
              <Text style={styles.date}>{getTime(item.createdAt)}</Text>
              <Text style={styles.UserName}>{item.college}</Text>
              <Text style={styles.Confession}>{item.message}</Text>
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-around',marginStart:230,marginTop:20}}>
                <TouchableOpacity
                  onPress={() => likeFunction(item)}
                >
                  {
                    liked(item) 
                    ? 
                    <Entypo name="thumbs-up" size={24} color="black" />
                    :
                    <Feather name="thumbs-up" size={24} color="black" />
                  }
                </TouchableOpacity>
                <Text>{ item.likes ? item.likes.length : '' }</Text>
                <TouchableOpacity
                  onPress={() => dislikeFunction(item)}
                >
                  {
                    disliked(item)
                    ?
                    <Entypo name="thumbs-down" size={24} color="black" />
                    :
                    <Feather name="thumbs-down" size={24} color="black" />
                  }
                </TouchableOpacity>
                <Text>{ item.dislikes ? item.dislikes.length : '' }</Text>
              </View>
            </Card>
          </View>
          }
        decelerationRate={'normal'}
      />
    </View>
    <ConfessForm URL={props.URL} modalVisible={modalVisible} handleModalVisibility={handleModalVisibility} />
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
        marginTop:-44,
        marginStart:25,
        alignItems:'center',
        color:'black',
        elevation:10,
        // fontWeight:'bold',
        fontFamily:'Header',
        fontWeight: 'bold'
    },
    image: {
        width:45,
        height:45,
        marginTop:15,
        marginLeft: 10,
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
      fontFamily:'Header',
      marginTop: 9,
      marginBottom: 2,
      letterSpacing: 0.3,
    },
    Confession:{
      color:'black',
      fontSize: 15,
      letterSpacing: 0.3,
      lineHeight: 21,
      // opacity:0.57,
      fontFamily:'Confession'
    },
    date:{
      fontSize: 12,
      opacity:0.57,
      color:'#000',
      fontFamily:'Confession'
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
      right: 15,
      bottom:80,
      backgroundColor: '#000',
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