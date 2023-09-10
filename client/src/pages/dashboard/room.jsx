import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
const Room = () => {
  const { roomId } = useParams();

  const config = async (element) => {
    const appID = 1144031819;
    const serverSecret = "9e858d359894ece88c0629069f0cc7dc";
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Rohan"
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
      <div ref={config} ></div>
    </div>
  );
};
export default Room;
