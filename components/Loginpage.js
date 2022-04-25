import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as GoogleSignIn from 'expo-google-sign-in';
import MainPage from './MainPage/FlatlistUI';
import React from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import analytics from '@react-native-firebase/analytics';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { signedIn: false, name: "", photoUrl: "", email: "" }
    this.HandleClick = this.HandleClick.bind(this);
    this.saveToken = this.saveToken.bind(this);
    this.initAsync = this.initAsync.bind(this);
    // this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
  }

  initAsync = async () => {
    try {
      await GoogleSignIn.initAsync({
        clientId: "1046990969461-46imsbn933ngi4dcbrkpmj9aneit1npm.apps.googleusercontent.com"
      })
      this.getUserDetails();
    } catch (error) {
      Alert.alert(
        "INIT ASYNC ERROR:-",
        JSON.stringify(error),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log("INIT ASYNC ERROR:- ", error)
    }
  }

  getUserDetails = async () => {
    try {
      const user = await GoogleSignIn.signInSilentlyAsync();
      if (user) this.setState({
        photoUrl: user.photoURL,
        signedIn: true
      });
    } catch (error) {
      Alert.alert(
        "signInSilentlyAsync() ERROR:-",
        JSON.stringify(error),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log("Google sign in error:- ", error)
    }
  }

  componentDidMount() {
    this.initAsync();
  }

  saveToken = async (key, value) => {
    await SecureStore.setItemAsync(key, value)
  }

  //Function to handle onPress.
  HandleClick = async () => {
    try {
      let result;
      if (!__DEV__) {
        // await analytics().logLogin({
        //   method: 'google'
        // })
        await GoogleSignIn.askForPlayServicesAsync();
        result = await GoogleSignIn.signInAsync();
        console.log("Result Google", result);
      }
      else {
        result = await Google.logInAsync({
          androidClientId: "930696648655-06s4lto3e1hps4728fapcg5cnm4h9t2a.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        })
        console.log("Result.user", result.user)
      }
      if (result.type === "success") {
        const { uid, id, email, givenName, familyName, photoUrl, photoURL, firstName, lastName, name } = result.user;
        const data = {
          email,
          firstName: __DEV__ ? givenName : firstName,
          lastName: __DEV__ ? familyName : lastName,
          avatar: __DEV__ ? photoUrl : photoURL,
          googleId: __DEV__ ? id : uid
        }
        axios.post(`${this.props.URL}/user/login`, data)
          .then(async (response) => {
            if (response.data.success) {
              this.setState({
                signedIn: true,
                email: email,
                name: `${firstName} ${lastName}`,
                photoUrl: __DEV__ ? photoUrl : photoURL
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
      Alert.alert(
        "HANDLE CLICK ERROR:-",
        JSON.stringify(e),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log("error", e)
    }
  }

  render() {
    return (
      <View >
        {this.state.signedIn ? (
          // User verfied => Land to main page.
          console.log(`User Loged In! with name: ${this.state.name} , email: ${this.state.email} and photoUrl: ${this.state.photoUrl}`),
          //Navigate user to the Flast List for now the MainPage which is the UI component for the Flatlist.
          <MainPage URL={this.props.URL} name={this.state.name} photoUrl={this.state.photoUrl} />
        ) : (
          //If not veified => loginPage.
          <View>
            <Text style={styles.introText}>Welcome to STES Confessions!</Text>
            <TouchableOpacity
              onPress={this.HandleClick}
              style={styles.roundButton1}>
              <Image style={styles.siwg} source={require('../assets/siwg.png')}
              ></Image>
            </TouchableOpacity>
            {/* <Text onPress={this.HandleClick}
              style={styles.loginText}>To continue, please {"signup."}</Text> */}
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
  siwg: {
    width: 282,
    height: 70,
  },
  introText: {
    color: 'black',
    fontSize: 38,
    padding: 1,
    marginTop: 125,
    alignContent: 'center',
    marginStart: 20,
  },
  roundButton1: {
    marginTop: 350,
    // width: 50,
    // height: 150,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // padding: 20,
    // borderRadius: 100,
  },
  loginText: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 15,
    opacity: 0.4,
    marginTop: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  copyright: {
    color: 'black',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 800,
    fontWeight: 'bold',
    fontSize: 15,
  }
});
