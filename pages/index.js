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
    function onRefreshEvent(){
      window.location.reload();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-alert', onFooEvent);
    socket.on('refresh-overlay', onRefreshEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-alert', onFooEvent);
      socket.off('refresh-overlay', onRefreshEvent);
    };
  }, [])
  
  async function callNotify(value){
    const avatar = await getAvatar(value.user_login);
    const audio = new Audio('/sound/alert.mp3');
    audio.volume = 0.1;
    audio.play();
    notify(value, avatar)
  }

  const notify = (data, avatar) => toast((t) => (
    <div className="alert-box">
      <div style={{marginRight: "10px"}} className="d-flex align-items-center">
        <img src={avatar} className="avatar" width={55}/>
      </div>
      <div>
        <h1>{truncate(data.user_login)}</h1>
        <p>przesyła {alertName(data.type)}</p>
      </div>
      <div style={{marginLeft: "auto"}} className="d-flex">
        <img src={`/images/${alertImage(data.type)}`} width={65} className="emoji" style={{zIndex: 3}}/>
        <h1 className="emoji-amount" style={{textAlign: "right"}}>x{data.amount}</h1>
      </div>
    </div>
  ),{
    duration: 30000000,
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
