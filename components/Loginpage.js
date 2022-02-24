import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native';
import * as Google from 'expo-google-app-auth';
import MainPage from './MainPage/FlatlistUI';
import React from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {IP_ADD} from '@env';
 
export default class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {signedIn: false, name: "", photoUrl: "",email:""}
    this.HandleClick=this.HandleClick.bind(this);
    this.saveToken = this.saveToken.bind(this);
  }
  saveToken = async(key, value) => {
    await SecureStore.setItemAsync(key, value)
  }

    //Function to handle onPress.
     HandleClick = async() =>{
      try {
        const result = await Google.logInAsync({
          androidClientId: "819068882370-ug04p1qchq01hsqn57q36vshm26i1doe.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        })
        console.log("Result.user", result.user)
        console.log(IP_ADD)
        if (result.type === "success") {
          const { id, email, givenName, familyName, photoUrl, name } = result.user;
          const data = {
            email,
            firstName: givenName,
            lastName: familyName,
            avatar: photoUrl,
            googleId: id
          }
          axios.post(`${IP_ADD}:8080/user/login`, data)
            .then(async (response) => {
              if(response.data.success) {
                this.setState({
                  signedIn: true,
                  email:email,
                  name: name,
                  photoUrl: photoUrl
                });

                // Save token in local storage
                this.saveToken("token", response.data.token);
                this.saveToken("userId", response.data.userId);
              }
            })
        } else {
          console.log("cancelled")
        }
      } catch (e) {
        console.log("error", e)
      }
  }

  render(){
  return (
    <View >
    {this.state.signedIn ? (
      // User verfied => Land to main page.
      console.log(`User Loged In! with name: ${this.state.name} , email: ${this.state.email} and photoUrl: ${this.state.photoUrl  }`),
      //Navigate user to the Flast List for now the MainPage which is the UI component for the Flatlist.
      <MainPage name= {this.state.name} photoUrl={this.state.photoUrl}/>
    ) : (
      //If not veified => loginPage.
      <View>
      <Text style={styles.introText}>Welcome to STES Confessions!</Text>
      <TouchableOpacity
        onPress={this.HandleClick}
        style={styles.roundButton1}>
        <Image source={require('../assets/gicon.png')}
        ></Image>
      </TouchableOpacity>
      <Text  onPress={this.HandleClick}
      style={styles.loginText}>To continue, please {"signup."}</Text>
      <Text style={styles.copyright}>
          © 2022 DK Tech.
      </Text>
      </View>
    )}
    </View>
  );
  }
};
//Styling.
const styles = StyleSheet.create({
    introText:{
        color:'black',
        fontSize:38,
        padding:1,
        marginTop:125,
        alignContent:'center',
        marginStart:20,
    },
    roundButton1:{
        marginTop: 300,
        width: 50,
        height: 150,
        alignContent:'center',
        alignSelf:'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    },
    loginText:{
      color:'black',
      alignSelf:'center',
      fontSize:15,
      opacity:0.4,
      marginTop:-70,
      fontWeight:'bold',
      textDecorationLine:'underline',
    },
    copyright:{
      color:'black',
      alignSelf:'center',
      position:'absolute',
      marginTop:800,
      fontWeight:'bold',
      fontSize:15,
    }
});
