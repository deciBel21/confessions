import { View, Text, Image,StyleSheet,TouchableOpacity } from 'react-native';
import React from 'react';
//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  return (
    <View>
    <Image style={styles.image} source={{ uri: props.photoUrl }}/>
    <Text style={styles.header}>SITS Confessions</Text>
    <TouchableOpacity
        onPress={() => console.log("Add Form")}
    >
        <Image
            style={styles.addButton}
            source={require('../../../assets/add.png')}
         />
    </TouchableOpacity>
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
        marginStart:10,
        marginTop:50,
        width: 40,
        height: 40,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 3,
        borderRadius: 150
    },
    addButton:{
        marginTop: 635,
        width: 65,
        marginStart:300,
        height: 55,
        alignContent:'center',
        padding: 10,
        borderRadius: 100,
    },
})
export default MainPage;