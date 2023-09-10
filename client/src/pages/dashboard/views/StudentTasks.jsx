import { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useToast } from "@chakra-ui/react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { calcLength } from "framer-motion";
import AddTaskForm from "@/components/AddTaskForm";
import UpdateForm from "@/components/UpdateForm";
import ToDo from "@/components/assignedTasks";
import { UserState } from "@/context/UserProvider";
import AddTaskModal from "@/components/miscellaneous/AddTaskModal";

const StudentTasks = () => {
  const { user } = UserState();

  const toast = useToast();
  const [toDo, setToDo] = useState([]);
  const [count, setcount] = useState(0);
  const [percent, setpercent] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [assignedTasksProgress, setAssignedTasksProgress] = useState(0);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [personalCount, setPersonalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const modalHandler = (student) => {
    setShowModal(true);
  };

  // Temp State
  const [newTask, setNewTask] = useState({
    task: "",
    isCompleted: false,
    deadline: "",
  });
  const [updateData, setUpdateData] = useState("");

  const calculatePersonalProgress = (tasks) => {
    let count = 0;

    tasks?.map((task) => {
      // student is the creator of the task
      if (task.assigned_to.includes(task.creator)) {
        if (task.isCompleted) count++;
      }
    });

    setPersonalCount(count);
    setPersonalProgress((count / tasks?.length) * 100);
  };

  const calculateAssignedProgress = (tasks) => {
    let count = 0;

    tasks?.map((task) => {
      // professor is the creator of the task
      if (task.assigned_to.includes(task.creator)) {
      } else {
        if (task.isCompleted) count++;
      }
    });

    setAssignedTasksProgress((count / tasks.length) * 100);
  };

  const getGoals = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/goals", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Fetching goals");
      const data = await res.json();
      setToDo(data);
      console.log(data);

      const temp1 = [];
      const temp2 = [];
      data.map((task) => {
        if (task.assigned_to.includes(task.creator)) {
          temp1.push(task);
        } else {
          temp2.push(task);
        }
      });

      console.log(temp2);
      calculatePersonalProgress(temp1);
      calculateAssignedProgress(temp2);

      setPersonalTasks(temp1);
      setAssignedTasks(temp2);
    } catch (err) {
      console.error(err.message);
    }
  };

  //////////////////////////////// ADD TASK /////////////////////////////////////////////////////

  const compare = (a, b) => {
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    return 0;
  };

  const taskCreationHandler = async (newTask) => {
    if (!newTask.task) {
      console.log("Cannot assign an empty task");
      return;
    }

    const body = {
      newTask,
    };

    console.log(body);

    console.log("Before sending post request");
    const res = await fetch("http://localhost:5000/api/dashboard/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    });

    console.log("After sending post request");
    const data = await res.json();
    console.log(data);

    setToDo(data);
    setShowModal(false);
    const temp1 = [];
    const temp2 = [];
    data.map((task) => {
      if (task.assigned_to == task.creator) {
        temp1.push(task);
      } else {
        temp2.push(task);
      }
    });

    console.log(temp2);
    calculatePersonalProgress(temp1);
    calculateAssignedProgress(temp2);

    setPersonalTasks(temp1);
    setAssignedTasks(temp2);
  };

  const addTask = async () => {
    if (!newTask.task) {
      toast({
        title: "Cannot assign an empty task",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log("Task is empty ");
      return;
    }
    console.log("NEW TASK BEFORE ADDING CREATOR", newTask);
    console.log("NEW TASK AFTER ADDING CREATOR", newTask);
    const num = Math.floor(Math.random() * 25) + 1;
    newTask.deadline = `2023-02-${num}`;

    try {
      const res = await fetch("http://localhost:5000/api/dashboard/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();
      const temp = [...toDo, data];

      console.log("NEW GOAL ADDED");
      setToDo([...toDo, data]);
      setPersonalTasks([...personalTasks, data]);
      setNewTask({
        task: "",
        isCompleted: false,
        deadline: "",
      });

      calculatePersonalProgress(temp);

      toast({
        title: "New Task Added",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log("Error occurred while creating a task");
      console.log(error);
    }
  };

  //////////////////////////////// UDPATE TASK /////////////////////////////////////////////////////
  const updateTask = async (task, newTitle, date, time) => {
    console.log(newTitle);
    if (!newTitle) {
      toast({
        title: "Please enter something",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const body = { task, newTitle, date, time };

    try {
      const res = await fetch("http://localhost:5000/api/dashboard/goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setToDo(data);

      const temp1 = [];
      const temp2 = [];
      data.map((task) => {
        if (task.assigned_to.includes(task.creator)) {
          temp1.push(task);
        } else {
          temp2.push(task);
        }
      });

      console.log(temp2);
      calculatePersonalProgress(temp1);
      calculateAssignedProgress(temp2);

      setPersonalTasks(temp1);
      setAssignedTasks(temp2);
    } catch (err) {
      console.error(err.message);
    }
  };

  //////////////////////////////// MARK AS DONE OR UNDONE /////////////////////////////////////////////////////

  const markDone = async (task) => {
    console.log("INSIDE MARK DONE");
    try {
      console.log("ABOUT TO SEND A PATCH REQUEST");
      const res = await fetch("http://localhost:5000/api/dashboard/goals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(task),
      });
      console.log("ABOUT TO SEND A PATCH REQUEST");
      const data = await res.json();
      setToDo(data);
      console.log(data);

      // update the personal progress bar if the task is marked done
      let count1 = 0;
      let count2 = 0;

      data.map((task) => {
        // student is the creator of the task
        if (task.assigned_to.includes(task.creator)) {
          // update the count
          if (task.isCompleted) {
            count1++;
          }
        } else {
          if (task.isCompleted) {
            count2++;
          }
        }
      });

      console.log((count2 / assignedTasks.length) * 100);
      setPersonalProgress((count1 / personalTasks.length) * 100);
      setAssignedTasksProgress((count2 / assignedTasks.length) * 100);
    } catch (err) {
      console.error(err.message);
    }
  };

  //////////////////////////////// DELETE TASK /////////////////////////////////////////////////////

  const deleteTask = async (task) => {
    const newTasks = personalTasks.filter(
      (someTask) => someTask._id != task._id
    );
    setPersonalTasks(newTasks);

    try {
      console.log("About to send a delete request");
      const res = await fetch("http://localhost:5000/api/dashboard/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      setToDo(data);

      const temp1 = [];
      const temp2 = [];
      data.map((task) => {
        if (task.assigned_to.includes(task.creator)) {
          temp1.push(task);
        } else {
          temp2.push(task);
        }
      });

      console.log(temp2);
      calculatePersonalProgress(temp1);
      calculateAssignedProgress(temp2);

      setPersonalTasks(temp1);
      setAssignedTasks(temp2);
    } catch (error) {
      console.log("ERROR OCCURRED WHILE DELETING GOALS");
      console.log(error.message);
    }
  };

  useEffect(() => {
    getGoals();
  }, [user]);

  return (
    <>
      <div className="flex w-[100%] flex-col">
        <div className="h-[100%] w-[100%]">
          <div className="bg-gray-200">
            <div className=" flex flex-col p-6 md:space-y-[2%]">
              <span>Personal Progress</span>
              <LinearProgress variant="determinate" value={personalProgress} />
            </div>
            <div className="flex flex-col p-6 md:space-y-[2%]">
              <span>Assignment Progress</span>
              <LinearProgress
                variant="determinate"
                value={assignedTasksProgress}
              />
            </div>
          </div>
        </div>
        <div className="w-[100%] bg-[#E2E8F0] text-center">
          <div className="container text-center ">
            <br />
            <br />
            <h2 className="text-3xl font-medium">Tasks</h2>
            <br />
            <br />

            {/* Adding a Task  */}
            <div className="row">
              <div className="col">
                <input
                  name="task"
                  value={newTask.task}
                  onChange={(e) =>
                    setNewTask({ ...newTask, [e.target.name]: e.target.value })
                  }
                  placeholder="Assign a Task"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-lg btn-success"
                  onClick={modalHandler}
                >
                  Add Task
                </button>
              </div>
            </div>
            <br />

            {/* Display ToDos */}

            {toDo && toDo.length ? "" : "No Tasks..."}

            <ToDo
              toDo={toDo}
              markDone={markDone}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          </div>
          {showModal && (
            <AddTaskModal
              taskCreationHandler={taskCreationHandler}
              isVisible={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StudentTasks;
