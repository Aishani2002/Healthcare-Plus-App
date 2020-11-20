import React ,{Component} from 'react';
import {View,Text,StyleSheet,FlatList} from 'react-native';
import{ListItem,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';
import MyHeader from '../components/MyHeader';
import SwipableFlatList from '../components/SwipableFlatList';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class NotificationScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef=null
    }
    
    getNotification=()=>{
        this.requestRef = db.collection("all_notifications").where("notification_status","==","unread")
        .where("targeted_user_id","==",this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"]=doc.id
                allNotifications.push(notification)
            })
            this.setState({allNotifications: allNotifications})
        })
    }

    componentDidMount(){
        this.getNotification();
    }

    componentWillUnmount(){
        this.notificationRef();
    }
    keyExtractor=(item,index)=> index.toString()
    renderItem=({item,index})=> {
        return(
            <ListItem 
            key={index} 
            leftElement={<Icon name="Med" type="font-awesome" color="#696969"/>}
            title={item.med_name}
            titleStyle={{color: 'black', fontWeight: 'bold' }}
            subTitle={item.message}
            bottomDivider
            />
        )
    }

render() {
    return(
        <View style={styles.container}>
            <View style={{flex:0.1}}>
            <MyHeader title={"Notification"} navigation={this.props.navigation}/>
            </View>
            <View style={{flex:0.9}}>
            {this.state.allNotifications.length===0
            ?(
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}> 
                <Text style={{fontSize: 25}}>
                You have no Notification
                </Text>
                </View>
            ):
            (<SwipableFlatList 
                allNotifications={this.state.allNotifications}
            />
            )
            }
            </View>
        </View>
    )
}
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})