import React from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  ImageBackground,
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
import { Container, Item, Input, Icon } from "native-base";

export default class SignInScreen extends React.Component {
  state = {
    username: "",
    password: "",

    isHidden: false
  };

  async signIn() {
    const { username, password } = this.state;
    await Auth.signIn(username, password)
      .then(user => {
        // this.setState({ user });

        this.props.navigation.navigate("AuthLoading");
      })
      .catch(err => {
        if (!err.message) {
          console.log("Error when signing in: ", err);
          Alert.alert("Error when signing in: ", err);
        } else {
          console.log("Error when signing in: ", err.message);
          Alert.alert("Error when signing in: ", err.message);
        }
      });
  }

  onChangeText(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              <View style={styles.Logo}>
                <View
                  style={{
                    flex: 1
                  }}
                />
                <View
                  style={{
                    marginBottom: 6,
                    marginLeft: 2,
                    marginRight: 3
                  }}
                >
                  <Text style={styles.text3}>KHDIMATY</Text>
                  <View style={styles.rect7} />
                </View>
              </View>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <View style={{ height: 200 }}></View>
                  <Item rounded style={styles.itemStyle}>
                    <Icon active name="person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#adb4bc"
                      keyboardType={"email-address"}
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={event => {
                        this.refs.SecondInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText("username", value)
                      }
                    />
                  </Item>
                  <Item rounded style={styles.itemStyle}>
                    <Icon active name="lock" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="go"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref="SecondInput"
                      onChangeText={value =>
                        this.onChangeText("password", value)
                      }
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "column"
  },

  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#5a52a5"
  },
  infoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 200,
    bottom: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff"
  },
  itemStyle: {
    marginBottom: 20
  },
  iconStyle: {
    color: "#5a52a5",
    fontSize: 28,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#667292",
    padding: 14,
    marginBottom: 100,
    borderRadius: 24
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 400,
    bottom: 180,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  Logo: {
    height: 111,
    alignSelf: "center",
    marginBottom: 300
  },
  text3: {
    color: "#25cdec",
    fontSize: 50,
    marginBottom: 4
  },
  rect7: {
    height: 8,
    backgroundColor: "#01A7C2"
  }
});
