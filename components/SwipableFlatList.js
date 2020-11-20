import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert, Dimensions,ListItem,FlatList} from 'react-native';
  import {Icon} from "react-native-elements";
import db from '../config';
import firebase from 'firebase';
import { SwipeListView } from 'react-native-swipe-list-view';


export default class SwipableFlatList extends Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications:this.props.allNotifications,
        };
    }

onSwipeValueChange=(swipeData)=>{
var allNotifications= this.state.allNotifications
const {key,value}=swipeData
if(value<Dimensions.get("window").width()){
    const newData= [...allNotifications]
    const prevIndex= allNotifications.findIndex(item=>item.key===key)
    this.updateMarkasRead(allNotifications[prevIndex])
    newData.splice(prevIndex,1)
    this.setState(({allNotifications:newData}))
}
}

updateMarkasRead=(notification)=>{
db.collection("all_notifications").doc(notification.doc_id).update({
    "notification_status":"read"
})
}

renderItem=(data)=>{
<ListItem
leftComponent={<Icon name="Book" type="font-awesome" color="#696969"/>}
title={data.item.book_name}
titleStyle={{color: 'black', fontWeight: 'bold' }}
subtitle={data.item.message}
bottomDivider
/>
}

renderHiddenItem=()=>{
    <View style={styles.rowBack}> 
    <View style={[styles.backButton, styles.backBtnRight]}>
        <Text style={[styles.backTextWhite]}></Text>
    </View>
    </View>
}

    render (){
        return(
            <View style={[styles.container]}>
               <SwipeListView
               disableRightSwipe
               data={this.state.allNotifications}
               renderItem={this.renderItem}
               renderHiddenItem={this.renderHiddenItem}
               rightOpenValue={-Dimensions.get("window").width}
               previewRowKey={"0"}
               previewOpenValue={"-40"}
               previewOpenDelay={3000}
               onSwipeValueChange={this.onSwipeValueChange}
               />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        flex:1
    },

    rowBack:{
        alignItems:'center',
        backgroundColor:"#29b646",
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft:15
    },

    backButton:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:"absolute", 
        top:0, 
        width:100
    },

    backBtnRight:{
        backgroundColor:"#29b6f6",
        right:0,
    },

    backTextWhite:{
        color:"white",
        fontWeight:"bold",
        fontSize:15
    }
})