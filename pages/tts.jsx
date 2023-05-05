import React, { useEffect } from "react";
import { socket } from "@components/socket";
import toast, { Toaster } from "react-hot-toast";

export default function Home({ channel, volume }) {

  useEffect(() => {
    if (!channel) {
      toast.error("Zapomniałeś/aś o ?channel= w URL strony.", {
        duration: 6000,
      });

      setInterval(() => {
        toast.error("Zapomniałeś/aś o ?channel= w URL strony.", {
          duration: 6000,
        });
      }, 3000);
    }
  }, [channel]);

  useEffect(() => {
    function onConnect() {
      toast.success("Połączono z serwerem - TTVUpdates");
    }

    function onDisconnect() {
      toast.error("Rozłączono z serwerem - TTVUpdates");
    }

    function onFooEvent(value) {
      callNotify(value);
    }

    function onFreeFooEvent(value) {
      callNotifyFree(value);
    }

    function onSkipTTS(value){
      if (channel !== value.channel) {
        return;
      }
      const tag = document.querySelector("#radio");

      tag.pause();
    }

    function onRefreshEvent() {
      window.location.reload();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-tts", onFooEvent);
    socket.on("new-free-tts", onFreeFooEvent);
    socket.on("skip-tts", onSkipTTS);
    socket.on("refresh-overlay", onRefreshEvent);
    
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-tts", onFooEvent);
      socket.off("new-free-tts", onFreeFooEvent);
      socket.off("skip-tts", onSkipTTS);
      socket.off("refresh-overlay", onRefreshEvent);
    };
    
  }, []);

  function callNotifyFree(value){
    if (channel !== value.channel) {
      return;
    }

    const tag = document.querySelector("#radio");

    tag.volume = volume;
    tag.src = `https://api.streamelements.com/kappa/v2/speech?voice=pl-PL-Wavenet-C&text=${value.msg}`;
    tag.play();
  }

  function callNotify(value) {
    
    if (channel !== value.channel) {
      return;
    }

    const tag = document.querySelector("#radio");

    tag.volume = volume;
    tag.src = `https://ai-cdn.oxynstudios.com/ai-${value.channel}.mp3?v=${new Date().getTime()}`;
    tag.play();

  }

  return (
    <>
      <Toaster
        position="top-left"
        containerStyle={{
          top: "50%",
        }}
      />
      <audio id="radio" style={{display: "none"}}>
        <source src="" />
      </audio>
    </>
  );
}
export async function getServerSideProps({ query }) {
  const { channel, volume } = query;
  return {
    props: {
      channel: channel || null,
      volume: Number(volume) || 0.5
    },
  };
}
