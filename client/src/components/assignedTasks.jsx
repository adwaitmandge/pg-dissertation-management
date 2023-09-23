import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@chakra-ui/react";
import { UserState } from "@/context/UserProvider";
import UpdateModal from "./miscellaneous/UpdateModal";
import DeleteModal from "./miscellaneous/DeleteModal";

const ToDo = ({ toDo, deleteTask, updateTask, markDone }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});


  const getMonth = (num) => {
    if (num == 1) return "Jan";

    if (num == 2) return "Feb";
    if (num == 3) return "Mar";
    if (num == 4) return "Apr";
    if (num == 5) return "May";
    if (num == 6) return "Jun";
    if (num == 7) return "Jul";
    if (num == 8) return "Aug";
    if (num == 9) return "Sep";
    if (num == 10) return "Oct";
    if (num == 11) return "Nov";
    if (num == 12) return "Dec";
  };

  const { user } = UserState();
  return (
    <>
      {toDo?.map((task, index) => {
        const { isCompleted, creator } = task;
        const date = task?.deadline?.slice(0, 10);
        const monthNum = task?.deadline?.slice(5, 7);
        const month = getMonth(monthNum);
        const day = task?.deadline?.slice(8, 10);
        console.log("Is user._id === creator", user._id === creator);
        return (
          <React.Fragment key={task._id}>
            <div className="col relative mb-[20px] flex rounded-[6px] bg-gray-100 pt-[10px] pr-[140px] pl-[10px] pb-[15px] text-center text-[22px]">
              <div className={task.isCompleted ? "... flex line-through" : ""}>
                <div className="flex items-center">
                  <span className="mr-[8px] flex h-[26px] w-[26px] items-center justify-center rounded-[50%] text-center text-[18px] text-[#999] ">
                    {index + 1}
                  </span>
                  <span className="flex">{task.task}</span>
                </div>
              </div>

              <div className="... absolute top-[50%] right-[15px] inline-block -translate-y-[50%]">
                {user._id === task.creator && (
                  <span
                    className={`mr-[20px] cursor-pointer`}
                    title="Edit"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowUpdateModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </span>
                )}
                {user._id === task.creator && (
                  <Button
                    className={`mr-[20px] cursor-pointer `}
                    title="Delete"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                )}
                {user?.role != "Mentor" && (
                  <button
                    className="pointer-events-auto mr-[20px] mb-[10px] inline-block text-[#00ff89] hover:text-[#ff5e00]"
                    title={`${
                      task.isCompleted ? "Completed" : "Not Completed"
                    }`}
                    onClick={(e) => markDone(task)}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </button>
                )}
                <span className="text-sm font-bold">
                  Due {`${day} ${month}`}
                </span>
              </div>
            </div>

            {selectedTask && (
              <DeleteModal
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                deleteTask={deleteTask}
                task={selectedTask}
              />
            )}
            {selectedTask && (
              <UpdateModal
                isVisible={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateTask={updateTask}
                task={selectedTask}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ToDo;
