import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import "./room.css";
const Room = () => {
  const { roomId } = useParams();

  const config = async (element) => {
    const appID = 1988490080;
    const serverSecret = "313754a6250a951c2758535aad7bcd50";
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
