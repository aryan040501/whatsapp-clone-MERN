import Chat from "./Chat";
import Sidebar from "./Sidebar";
import "./App.css"
import Pusher from 'pusher-js'
import {useEffect, useState} from 'react'
import axios from "./axios"


function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get('/messages/sync').then(response =>{
      console.log(response.data)
      setMessages(response.data);
    })
  }, [])

  useEffect(()=>{
    const pusher = new Pusher('50ef11eb9b8fdd0c8a7c', {
      cluster: 'ap2'
    });
  
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  },[messages])

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar/>
        <Chat messages={messages}/>
      </div>
    </div>
    
  );
}

export default App;
