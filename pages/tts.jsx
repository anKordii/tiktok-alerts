import React, { useEffect, useState } from "react";
import { socket } from "@components/socket";
import toast, { Toaster } from "react-hot-toast";

export default function Home({ channel, volume }) {
  const [status, setStatus] = useState(null);

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
      setStatus(true);
    }

    function onDisconnect() {
      setStatus(null);
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
    tag.src = `https://api.streamelements.com/kappa/v2/speech?voice=id-ID-Wavenet-B&text=${value.msg}`;
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
      <div style={{ position: "absolute", bottom: 0, opacity: 0.2, marginLeft: ".25rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`${
              status ? "bg-online" : "bg-offline"
            } rounded-full dot-pulse`}
            style={{ width: "8px", height: "8px" }}
          />
          <span className={`${status ? "txt-online" : "txt-offline"} txt`}>
            TTVUpdates
          </span>
        </div>
      </div>
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
