import { Box, useToast, Button, Stack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import axios from "axios";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { UserState } from "@/context/UserProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = UserState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      className={`${
        selectedChat ? "hidden" : "flex"
      } w-[100%] flex-col items-center rounded-lg border bg-white p-3 md:flex md:w-[31%]`}
    >
      <Box className="flex w-[100%] items-center justify-between px-3 pb-3 font-sans text-[28px] md:text-[30px]">
        My Chats
        <GroupChatModal>
          <Button
            className={`flex text-[17px] md:text-[10px] lg:text-[17px]`}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box className="flex w-[100%] flex-col overflow-y-hidden rounded-lg bg-[#f8f8f8] p-3">
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
