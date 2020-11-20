import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       donorId : firebase.auth().currentUser.email,
       donorName : "",
       allDonations : []
     }
     this.requestRef= null
   }


   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.donorId)
     .onSnapshot((snapshot)=>{
       var allDonations = snapshot.docs.map(document => document.data());
       this.setState({
         allDonations : allDonations,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.med_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="med" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={[styles.button,{backgroundColor:item.request_status==="Med Sent" ?"green":"#ff5722"}]} 
          onPress={()=>{
            this.sendMed(item)
          }} >
             <Text style={{color:'#ffff'}}>Send Med</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )
   sendNotification=(medDetails,requestStatus)=>{
    var requestId = medDetails.request_id
    var donorId = medDetails.donor_id
    db.collection("all_notifications").where("request_id","==",requestId).where("donor_id","==",donorId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message="";
    if(requestStatus==="Med Sent"){
      message = this.state.donorName + "has sent you the med"
    }
    else{
      message = this.state.donorName + "has shown interest in donating the med"
    }
    db.collection("all_notifications").doc(doc.id).update({
      "message": message,
      "notification_status":"unread",
      "date":firebase.firestore.FieldValue.serverTimestamp(),
    })
      })
    })
    }

sendMed=(medDetails)=>{
if(medDetails.request_status==="Med Sent"){
  var requestStatus= "Donar Interested"
  db.collection("all_donations").doc(medDetails.doc_id).update({
    "request_status":"Donar Interested"
  })
  this.sendNotification(medDetails,requestStatus)
}
else{
  var requestStatus= "Med Sent"
  db.collection("all_donations").doc(medDetails.doc_id).update({
    "request_status":"Med Sent"
  })
  this.sendNotification(medDetails,requestStatus)
}
}

   componentDidMount(){
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all med Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
