import React,{Component} from 'react';
import {
  View,Text,TextInput,KeyboardAvoidingView,StyleSheet,TouchableOpacity,TouchableHighlight,Alert,FlatList,Image} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class MedRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      medName:"",
      reasonToRequest:"",
      isMedRequestActive:"",
      requestedMedName:"",
      medStatus:"",
      requestId:"",
      userDocId:"",
      docId:"",
      imageLink:"",
      dataSource:"",
      showFlatList:false,
      requestedImageLink:""
    }
  }

  async getMedsFromApi(medName){
this.setState({medName:medName});
if(medName.length > 2){
  var meds = await BookSearch.searchbook(medName,"AIzaSyAOJiPAGeZVNXIjxCMzv5D7x3Pb7ZD0RmU")
  this.setState({
    dataSource:meds.data,
    showFlatList:true
  })
}
  }

  getMedRequest=()=>{
var medRequest= db.collection("requested_meds").where("user_id","==",this.state.userId).get()
snapshot.forEach((doc)=>{
 if(doc.data().med_status==="requested"){
   this.setState({
     requestId:doc.data().request_id,
     requestedMedName:doc.data().med_name,
     medStatus:doc.data().med_status,
     docId:doc.id,
     requestedImageLink:doc.data().image_link
   })
 }
})
  }

  isMedRequestActive () {
db.collection("users").where("email_id","==",this.state.userId)
onSnapshot((snapshot) => {
snapshot.forEach((doc)=>{
  this.setState({
    isMedRequestActive:doc.data().isMedRequestActive,
    userDocId:doc.id
  })
})
})
  }

  recievedMed=(medName) => {
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection("recieved_meds").add({
      "user_id": userId,
      "med_name": medName,
      "request_id": requestId,
      "med_status":"recieved"
    })
  }

  sendNotification=()=>{
    
  db.collection("users").where("request_id","==",this.state.requestId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var donorId= doc.data().donor_id
      var medName= doc.data().med_name
    })
    db.collection("all_notifications").add({
      "targeted_user_id":donorId,
      "message":name+" "+lastName+" recieved the med"+medName,
      notification_status:"unread",
      med_name:medName
    })
  })
  }

  updateMedRequestStatus=()=>{
    db.collection("requested_meds").doc(this.state.docId).update({
      "med_status":"recieved",
    })
    db.collection("users").where("email_id","==",this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      db.collection("users").doc(doc.id).update({
        isMedRequestActive:false
      })
    
    })
  })
}

renderItem=({item,i})=>{
return(
<TouchableHighlight style={{alignItems:'center',backgroundColor:"#dddddd",padding:10,width:"90%"}} 
activeOpacity={0.8}
underlayColor={"#dddddd"}
onPress={()=>{this.setState({
  showFlatList:false,
  medName:item.volumeInfo.title,
})}}
bottomDivider>
<Text>{item.volumeInfo.title}</Text>
 </TouchableHighlight>
)
}

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (medName,reasonToRequest)=>{
    var meds= await  BookSearch.searchbook(medName,"AIzaSyAOJiPAGeZVNXIjxCMzv5D7x3Pb7ZD0RmU")
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_meds').add({
        "user_id": userId,
        "med_name":medName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "med_status":"requested",
        "date":firebase.firestore.FieldValue.serverTimestamp(),
        "image_link":meds.data[0].volumeInfo.imageLinks.smallThumbnail
    })
    await this.getMedRequest()
    db.collection("users").where("email_id","==",userId).get()
    .then((snapshot) =>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
          isMedRequestActive:true
        })
      })
    })
    this.setState({
        medName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Med Requested Successfully")
  }


  render(){
    if(this.state.isMedRequestActive===true){
      return(
        <View style={{flex:1,justifyContent:"center"}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:"center",alignItems:'center',padding:10,margin:10}}>
          <Text> Med Name</Text>
      <Text>{this.state.requestedMedName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:"center",alignItems:'center',padding:10,margin:10}}>
          <Text> Med Status</Text>
      <Text>{this.state.medStatus}</Text>
          </View>
          <TouchableOpacity style={{borderColor:"orange",borderWidth:1,backgroundColor:"orange",width:300,alignSelf:"center",alignItems:'center',height:30,marginTop:30}}
          
          onPress={()=>{
            this.sendNotification()
            this.updateMedRequestStatus()
              this.recievedMed(this.state.requestedMedName)
          }}
          >
            <Text>I recieved the med</Text>
          </TouchableOpacity>
        </View>
      )
    }

    else{
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Medicine" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput style ={styles.formTextInput}
             placeholder={"enter medicine name"} 
             onChangeText={text => this.getMedsFromApi(text)} 
             onClear={text => this.getMedsFromApi('')} 
             value={this.state.medName} 
             />
            {this.state.showFlatList?(
              <FlatList style={{marginTop:10}} 
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              keyExtractor={(item,index)=>index.toString()}
              />
            ):(
              <View style={{alignItems:'center'}}>
              <TextInput
                style={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the medicine"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.medName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
              </View>
            )}
            </KeyboardAvoidingView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:100,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
