import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="h-[350px]">
          <ModalHeader className="flex justify-center font-sans text-[40px]">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-between">
            <Image
              className="rounded-full"
              src={user.pic}
              alt={user.name}
              boxSize="150px"
            />
            <Text fontSize={{ base: "28px", md: "30px" }} className="font-sans">
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
