import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import MedRequestScreen from '../screens/MedRequestScreen';


export const AppTabNavigator = createBottomTabNavigator({
  DonateMeds : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/give-med.jpg")} style={{width:20, height:20}}/>,
      tabBarLabel : "Donate Meds",
    }
  },
  MedRequest: {
    screen: MedRequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/recieve-med.jpg")} style={{width:20, height:20}}/>,
      tabBarLabel : "Med Request",
    }
  }
});
