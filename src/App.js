import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAi65f5LeSWLfhdASsiqDSXdttaK7zN5Vw",
  authDomain: "analog-figure-302913.firebaseapp.com",
  projectId: "analog-figure-302913",
  storageBucket: "analog-figure-302913.appspot.com",
  messagingSenderId: "423006351063",
  appId: "1:423006351063:web:10d357f230b02382d40a92",
  measurementId: "G-HXYEL37MVZ"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      
      </header>
      <slectio>
        { user ? <ChatRoom /> : <SignIn />}
      </slectio>
    </div>
  );
}


function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <bottem onClick={signInWithGoogle}>Sign In With Google</bottem>
  )
}


function SignOut(){
  return auth.currentUser && (
    <bottem onClick={ () => auth.signOut()}>Sign Out</bottem>
  )
}


function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [fromValue, setFromValue] = useState('');
  const sendMessage = async(e) =>{
    e.preventDefault();
    const { uid, photoUrl } = auth.currentUser;
    await messagesRef.add({
      text: fromValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoUrl
    })
    setFromValue('');
    dummy.currentscrollIntoView({ behavior: 'smooth'});
  } 
  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={fromValue} onChange={(e) => setFromValue(e.target.value)}/>
        <bottem type="submit">🕊️</bottem>
      </form>
    </>
  )
}


function ChatMessage(props){
  const { text, uid, photoUrl } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  retuen (
    <div className={`message ${messageClass}`}>
    <img src={photoUrl} />   
    <p>{text}</p>
    </div>
  )
}


export default App;
