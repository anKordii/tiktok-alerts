import React, { useEffect, useState } from "react";
import { socket } from "@components/socket";
import truncate from "@components/truncate";
import toast, { Toaster } from "react-hot-toast";
import alertName from "@components/alertName";
import alertImage from "@components/alertImage";
import getAvatar from "@components/getAvatar";
import getPrices from "@components/getPrices";
import getMeTime from "@components/getMeTime";

export default function Home({ channel, mute }) {
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

    function onRefreshEvent() {
      window.location.reload();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-alert", onFooEvent);
    socket.on("refresh-overlay", onRefreshEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-alert", onFooEvent);
      socket.off("refresh-overlay", onRefreshEvent);
    };
  }, []);

  async function callNotify(value) {
    if (channel !== value.channel) {
      return;
    }

    const avatar = await getAvatar(value.user_login);
    const getPrice = getPrices(value.type);
    const overallPrice = getPrice * value.amount;

    if (mute === null || mute === undefined) {
      playSound(overallPrice);
    }

    if (overallPrice > 19999) {
      return notify(value, avatar, getMeTime(overallPrice));
    }

    return notify(value, avatar, getMeTime(overallPrice), true);
  }

  function playSound(cost) {
    if (cost >= 5000000) {
      const audio = new Audio("/sound/5mln.mp3");
      audio.volume = 0.1;
      audio.play();

      return;
    }

    if (cost >= 500000) {
      const audio = new Audio("/sound/500k.mp3");
      audio.volume = 0.1;
      audio.play();

      return;
    }

    return;
  }

  const notify = (data, avatar, time, isblur) =>
    toast(
      (t) => (
        <div className="alert-box">
          <div
            style={{ marginRight: "10px" }}
            className="d-flex align-items-center"
          >
            <img
              src={avatar}
              className="avatar"
              width={55}
              style={isblur && { filter: "blur(5px)" }}
            />
          </div>
          <div>
            <h1>{truncate(data.user_login, 10)}</h1>
            <p>przesyła {alertName(data.type)}</p>
          </div>
          <div style={{ marginLeft: "auto" }} className="d-flex">
            <img
              src={`/images/${alertImage(data.type)}`}
              width={65}
              className="emoji"
              style={{ zIndex: 3 }}
            />
            <h1 className="emoji-amount" style={{ textAlign: "right" }}>
              x{data.amount}
            </h1>
          </div>
        </div>
      ),
      {
        duration: time,
        style: {
          borderRadius: "2rem",
          background: "linear-gradient(90deg, black, transparent)",
          color: "#fff",
          padding: 0,
        },
      }
    );

  return (
    <>
      <Toaster
        position="top-left"
        containerStyle={{
          top: "50%",
        }}
      />
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
  const { channel, mute } = query;
  return {
    props: {
      channel: channel || null,
      mute: mute || null,
    },
  };
}
