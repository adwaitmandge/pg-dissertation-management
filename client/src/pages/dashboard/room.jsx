import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import "./room.css";
const Room = () => {
  const { roomId } = useParams();

  const config = async (element) => {
    const appID = 25370775;
    const serverSecret = "0716ad40d73573a18321ca2953bda1a5";
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Username"
    );
    const zp = ZegoUIKitPrebuilt.create(token);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div className="room-page">
      <div className="room-container" ref={config}></div>
    </div>
  );
};
export default Room;
