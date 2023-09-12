import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import { UserState } from "@/context/UserProvider";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import MyChats from "@/components/MyChats";
import Chatbox from "@/components/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = UserState();

  return (
    <div className="w-[100%] bg-gray-200 ">
      {user && <SideDrawer />}
      <Box
        className="flex h-[91.5vh] w-[100%] justify-between p-[10px] "
        // d="flex"
        // justifyContent="space-between"
        // w="100%"
        // h="91.5vh"
        // p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
