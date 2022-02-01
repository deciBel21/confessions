import { View, Text, Image,StyleSheet } from 'react-native';
import React from 'react';
//This is just a demo for the Main Page UI 
const  MainPage = (props) => {
  return (
    <View>
    <Text style={styles.header}>Welcome:{props.name}</Text>
    <Image style={styles.image} source={{ uri: props.photoUrl }}/>
    </View>
  );
}
const styles= StyleSheet.create({
    header: {
        alignSelf:'center',
        fontSize: 25,
        marginTop:150,
        alignItems:'center',
        color:'black'
    },
    image: {
        alignSelf:'center',
        marginTop: 15,
        width: 150,
        height: 150,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 3,
        borderRadius: 150
    }
})
export default MainPage;