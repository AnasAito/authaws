import React from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated
} from "react-native";
import Auth from "@aws-amplify/auth";
import Profile from "./profile";
import { Container, Header, Body, Title } from "native-base";
export default class ProfileScreen extends React.Component {
  state = { username: "" };
  componentDidMount = async () => {
    await this.getusername();
    //use this to query user info
  };
  // Remember logged in users
  getusername = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({
          username: user.username
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    // console.log(this.state.username);
    return (
      <Container style={{ marginVertical: 15 }}>
        <Header style={{ backgroundColor: "#fff", alignItems: "center" }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Khdimaty</Text>
        </Header>
        <Profile
          username={"ANASIO"}
          age={20}
          sex={"Homme"}
          statut={"Student"}
          local={"Bengherir,Morocco"}
          level={4}
          score={200}
          mytaskCount={23}
          interests={[]}
        />
      </Container>
    );
  }
}
