import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem,Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
export default class MyDonationScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:'',
        }
        this.requestRef = null
    }
    getAllDonations = ()=>{
        this.requestRef = db.collection('all_donations').where('donor_id','==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allDonations = []
            snapshot.docs.map((doc)=>{
                var donation = doc.data()
                donation['donor_id'] = doc.id
                allDonations.push(donation)

            })
            this.setState({
                allDonations:allDonations
            })
        })
    }
    getDonorDetails = (donorId) =>{
      db.collection('users').where('email_id','==',donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            donorName:doc.data().first_name+' '+  doc.data().last_name
          })
        })
      })
    }
     keyExtractor = (item,index)=>{
        index.toString()

     }
     
     renderItem = ( {item, i} ) =>{
       return(
        <ListItem
          key={i}
          title={item.book_name}
          subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
          leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          rightElement={
              <TouchableOpacity
               style={[
                 styles.button,
                 {
                   backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
                 }
               ]}
               onPress = {()=>{
                 this.sendBook(item)
               }}
              >
                <Text style={{color:'#ffff'}}>{
                  item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
                }</Text>
              </TouchableOpacity>
            }
          bottomDivider
        />
       )
          }
     componentDidMount(){
        this.getAllDonations()
        this.getDonorDetails(this.state.userId)
     }
     
    sendNotification=(bookDetails,requestStatus)=>{
      var requestId = bookDetails.request_id
      var donorId = bookDetails.donor_id
      db.collection('all_notifications').where('request_id','==',requestId)
      .where('donor_id','==',donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var maessage = '';
          if(requestStatus === 'Book Sent'){
            message = this.state.donorName+' has sent you a book'
          }
          else{
            message = this.state.donorName+ ' has shown interest in donating a book'
          }
          db.collection('all_notifications').doc(doc.id).update({
            message:message,
            notification_status:'unread',
            date:firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
      })
      
    }
  
    sendBook =(bookDetails)=>{
      if(bookDetails.request_status === 'Book Sent'){
        var requestStatus = 'Donor Interested'
        db.collection('all_donations').doc(bookDetails.doc_id).update({
          request_status:requestStatus,
        })
          this.sendNotification(bookDetails,requestStatus)
      }
      else{
        var requestStatus = 'Book Sent'
        db.collection('all_donations').doc(bookDetails.doc_id).update({
            request_status:requestStatus,
        })
        this.sendNotification(bookDetails,requestStatus)
      }
    }
    render(){
        return(
            <View style = {{flex:1}}>
               <MyHeader navigation = {this.props.navigation} title = 'My Donations'/>
               <View style = {{flex:1}}>
                    {this.state.allDonations.length === 0? 
                    (<View style = {styles.subtitle}>
                        <Text>
                            List Of All Book Donations
                        </Text>
                    </View>):
                    (
                        <FlatList
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem = {this.renderItem}
                        />
                    )}
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