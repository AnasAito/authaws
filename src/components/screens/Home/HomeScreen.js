import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  Image,
  AsyncStorage
} from "react-native";
//import Amplify, { Storage } from "@aws-amplify/core";
import { Text } from "native-base";
import Auth from "@aws-amplify/auth";
import { Query } from "@apollo/react-components";
import { gql } from "apollo-boost";

import Cards from "./components/cards";

import { ScrollView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { TouchableWithoutFeedback } from "react-native";
import Constants from "expo-constants";
import { Icon } from "native-base";
import Loading from "./components/loading";

const Tasks = gql`
  query tasks($filter: TaskOrderByInput) {
    tasks(orderBy: $filter, where: { published: true }) {
      id
      name
      taskScore
      type
      description
      Owner
      votes {
        id
        user {
          username
        }
      }
    }
  }
`;

export default function HomeScreen(props) {
  const [queryname, setqueryname] = useState(Tasks);
  const maper = { Nouveaux: "createdAt_DESC", Populaires: "taskScore_DESC" };
  let inputRef = React.createRef();
  const [value, setvalue] = useState("Nouveaux");
  const [dis, setdis] = useState([]);
  const [username, setusername] = useState("");
  useEffect(() => {
    // Create an scoped async function in the hook
    async function loaddisabled() {
      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      let token = "";
      await Auth.currentAuthenticatedUser().then(user => {
        token = "dis".concat(
          user.signInUserSession.accessToken.payload.username
        );
        setusername(user.signInUserSession.accessToken.payload.username);
      });
      const value = await AsyncStorage.getItem(token);
      let final = JSON.parse(value).filter(onlyUnique);
      console.log(final);
      setdis(final);
    }
    // Execute the created function directly
    loaddisabled();
  }, []);
  const [refreshing, setrefreshing] = useState(false);
  //console.log(disabled);
  const pop = tasks => {
    console.log(tasks);
  };
  return (
    <View style={styles.container}>
      <Query
        query={Tasks}
        fetchPolicy={"cache-and-network"}
        variables={{ filter: maper[value] }}
      >
        {({ loading, error, data, refetch }) => {
          if (loading)
            return (
              <ScrollView
                style={{ backgroundColor: "#fff" }}
                scrollsToTop={true}
                ref={inputRef}
              >
                <View style={styles.Tabs}>
                  {["Nouveaux", "Populaires"].map(elem => {
                    let added =
                      value === elem
                        ? {
                            color: "#E2A829"
                          }
                        : {};
                    return (
                      <TouchableWithoutFeedback
                        style={[styles.nav]}
                        key={elem}
                        onPress={() => {
                          setvalue(elem);
                        }}
                      >
                        <Text style={[styles.text, added]}>
                          {elem == "Nouveaux" ? "Plus récentes" : "Plus notées"}
                        </Text>
                      </TouchableWithoutFeedback>
                    );
                  })}
                </View>

                <Loading />
              </ScrollView>
            );
          if (error) return <Text>`Error! ${error.message}`</Text>;
          // console.log(data.votes);
          return (
            <ScrollView
              style={{ backgroundColor: "#fff" }}
              scrollsToTop={true}
              ref={inputRef}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={refreshing}
                  onRefresh={() => {
                    //console.log(networkStatus);

                    refetch();
                    setrefreshing(false);
                    //console.log("refetch");
                  }}
                />
              }
            >
              <View style={styles.Tabs}>
                {["Nouveaux", "Populaires"].map(elem => {
                  let added =
                    value === elem
                      ? {
                          color: "#E2A829"
                        }
                      : {};
                  return (
                    <TouchableWithoutFeedback
                      style={[styles.nav]}
                      key={elem}
                      onPress={() => {
                        if (elem === "Favoris") {
                          setqueryname(Tasks);
                        }
                        setvalue(elem);
                      }}
                    >
                      <Text style={[styles.text, added]}>
                        {elem == "Nouveaux" ? "Plus récentes" : "Plus notées"}
                      </Text>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>

              <Cards
                tasks={data}
                tobedisabl={dis}
                navigation={props.navigation}
                username={username}
              />
            </ScrollView>
          );
        }}
      </Query>
      <BlurView tint="default" intensity={100} style={styles.static}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => inputRef.current.scrollTo({ animated: true }, 0)}
          >
            <Icon
              name="home"
              size={35}
              style={{ color: "#1D7B9D", marginTop: 3 }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#E2A829" }}>
            Khdimaty
          </Text>

          <TouchableOpacity
            onPress={() => props.navigation.navigate("Rewards")}
          >
            <Icon name="gift" size={35} style={{ color: "#1D7B9D" }} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    //backgroundColor: "#ee1"

    // marginTop: 15
  },
  static: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0
  },
  header: {
    alignItems: "center",
    //backgroundColor: "#ee9",
    marginTop: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  Tabs: {
    height: 60,
    backgroundColor: "#1D7B9D",

    marginHorizontal: 15,
    marginTop: 120,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 30
  },
  nav: {
    width: 100,
    height: 38,

    alignSelf: "center",
    opacity: 1,
    borderRadius: 5,
    borderColor: "#000",

    justifyContent: "center"
  },
  text: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold"
  },
  notBlurred: {
    ...StyleSheet.absoluteFill,
    top: Constants.statusBarHeight
  }
});
