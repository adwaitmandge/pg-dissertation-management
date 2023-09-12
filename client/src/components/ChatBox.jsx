import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";
import { UserState } from "@/context/UserProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = UserState();

  return (
    <Box
      className={`${
        selectedChat ? "flex" : "hidden"
      } w-[100%] flex-col items-center rounded-lg border bg-white md:flex md:w-[68%]`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
