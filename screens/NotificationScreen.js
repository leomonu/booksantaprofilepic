import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem,Icon } from 'react-native-elements'
import MyHeader from '../components/MyHeader';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import firebase from 'firebase';
import db from '../config';
export default class NotificationScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef = null
    }
    getNotifications=()=>{
        this.notificationRef = db.collection('all_notifications').where('notification_status','==','unread')
        .where('targeted_user_id','==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications = [];
            snapshot.docs.map((doc)=>{
                    var notification = doc.data()
                    notification['doc_id'] = doc.id
                    allNotifications.push(notification)

            })
            this.setState({
               allNotifications:allNotifications 
            })
        })
    }
    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef();
    }
    keyExtractor=(item,index)=>{
        index.toString();
    }
    renderItem = ({item,index})=>{
        return(
        <ListItem
        key=  {index}
        leftElement = {<Icon
            name = 'book'
            type = 'font-awesome'
            color = '#696969'
        />}
        title = {item.book_name}
        titleStyle = {{color:'black',fontWeight:'bold'}}
        subtitle = {item.message}
        bottomDivider
        />
        )
    }
    render(){
        return(
            <View>
               <View style = {{flex:0.1}}>
                    <MyHeader
                        title = {'Notification'}
                        navigation = {this.props.navigation}
                    />

               </View>
               <View style = {{flex:0.1}}>
                    {
                        this.state.allNotifications.length === 0?
                        (
                            <View style= {{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text style = {{fontSize:25}}>
                                    You have no Notifications
                                </Text>
                            </View>

                        ):(
                            <SwipeableFlatlist
                                allNotifications = {this.state.allNotifications}
                            />
                        )
                    }
               </View>
            </View>
        )
    }
}