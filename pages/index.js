import React, {useEffect} from "react";
import { socket } from "@components/socket";
import truncate from "@components/truncate";
import toast, { Toaster } from 'react-hot-toast';
import alertName from "@components/alertName";
import alertImage from "@components/alertImage";
import getAvatar from "@components/getAvatar";

export default function Home() {
  useEffect(() => {
    function onConnect() {
      toast.success('Połączono z serwerem - TTVUpdates')
    }

    function onDisconnect() {
      toast.error("Rozłączono z serwerem - TTVUpdates")
    }

    function onFooEvent(value) {
      callNotify(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-alert', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-alert', onFooEvent);
    };
  }, [])
  
  async function callNotify(value){
    const avatar = await getAvatar(value.user_login);

    notify(value, avatar)
  }

  const notify = (data, avatar) => toast((t) => (
    <div className="alert-box">
      <div style={{marginRight: "10px"}} className="d-flex align-items-center">
        <img src={avatar} className="avatar" width={35}/>
      </div>
      <div>
        <h1>{truncate(data.user_login)}</h1>
        <p>przesyła {alertName(data.type)}</p>
      </div>
      <div style={{marginLeft: "auto"}} className="d-flex">
        <img src={`/images/${alertImage(data.type)}`} width={45} className="emoji" style={{zIndex: 3}}/>
        <h1 className="emoji-amount">x{data.amount}</h1>
      </div>
    </div>
  ),{
    duration: 3000,
    style: {
      borderRadius: '2rem',
      background: 'linear-gradient(90deg, black, transparent)',
      color: '#fff',
      padding: 0
    },
  });

  return (
    <>
      <Toaster 
        position="top-left"
      />
    </>
  );
}
