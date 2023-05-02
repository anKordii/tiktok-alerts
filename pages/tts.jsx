import React, { useEffect } from "react";
import { socket } from "@components/socket";
import toast, { Toaster } from "react-hot-toast";

export default function Home({ channel }) {
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

    function onRefreshEvent() {
      window.location.reload();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-tts", onFooEvent);
    socket.on("refresh-overlay", onRefreshEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-tts", onFooEvent);
      socket.off("refresh-overlay", onRefreshEvent);
    };
  }, []);

  async function callNotify(value) {
    
    if (channel !== value.channel) {
      return;
    }

    document.querySelector("#radio").volume = 1;

    document.querySelector('#radio').src = `https://ai-cdn.oxynstudios.com/ai.mp3?v=${new Date().getTime()}`;
    document.querySelector("#radio").play();
  }

  return (
    <>
      <Toaster
        position="top-left"
        containerStyle={{
          top: "50%",
        }}
      />
      <audio id="radio" controls="" style="display: none;">
        <source src="" />
      </audio>
    </>
  );
}
export async function getServerSideProps({ query }) {
  const { channel } = query;
  return {
    props: {
      channel: channel || null,
    },
  };
}
