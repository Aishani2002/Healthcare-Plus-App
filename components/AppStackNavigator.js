import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import MedDonateScreen from '../screens/MedDonateScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  MedDonateList : {
    screen : MedDonateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  },
},
  {
    initialRouteName: 'MedDonateList'
  }
);
