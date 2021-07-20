import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Video, Audio } from 'expo-av';
import db from "./firebase";
import firebase from "firebase/app";

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribeFromNewSnapshots = db
      .collection("Chats")
      .doc("myfirstchat")
      .onSnapshot((snapshot) => {
        console.log("New Snapshot!");
        setMessages(snapshot.data().messages);
      });

      return function cleanupBeforeUnmounting() {
        unsubscribeFromNewSnapshots();
      };
    }, []);

  console.log(messages);
  const onSend = useCallback((messages = []) => {
    db.collection("Chats").doc("myfirstchat").update({ messages: firebase.firestore.FieldValue.arrayUnion(messages[0])});
  
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //     db.collection("Chats")
  //     .doc("myfirstchat")
  //     .get()
  //     .then((snapshot) => {
  //       console.log(snapshot.id);
  //       console.log(snapshot.data());
  //       },
  //     },
  //   ])
  // }, [])


  return (
      // <View style={{ padding: 20 }}>
      //     <Video
      //      resizeMode="contain"
      //      useNativeControls
      //      shouldPlay={false}
      //      source={{ uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}}
      //      style={styles.video}
      //    />
      // </View>
      <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user = {{_id: 1, name: "Erica", avatar: "https://placeimg.com/140/140/any"}}
      inverted = {true}
      showUserAvatar = {true}
      // placeholder = {"Type something"}
      // alwaysShowSend = {true}
      renderUsernameOnMessage = {true}
      />
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
