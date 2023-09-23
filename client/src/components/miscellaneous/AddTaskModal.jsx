import { useState } from "react";

const AddTaskModal = ({ isVisible, onClose, taskCreationHandler, student }) => {
  const [newTask, setNewTask] = useState({
    task: "",
    date: "",
    time: "",
  });

  console.log(student);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
        <div class="relative h-full w-full max-w-md md:h-auto">
          <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <svg
                onClick={onClose}
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <button class="sr-only" onClick={() => onClose()}>
                Close modal
              </button>
            </button>
            <div class="p-6 text-center">
              <svg
                aria-hidden="true"
                class="mx-auto mb-3 h-14 w-14 text-gray-400 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="mb-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                Assign Task
              </h3>
              <div className="mt-[10px] mb-[20px]">
                <input
                  type="text"
                  id="first_name"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Assign New Task"
                  value={newTask.task}
                  onChange={(e) =>
                    setNewTask({ ...newTask, task: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  id="first_name"
                  class="mt-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Set a deadline"
                  onChange={(e) => {
                    setNewTask({ ...newTask, date: e.target.value });
                    console.log(newTask);
                  }}
                  required
                />
                <input
                  type="time"
                  id="first_name"
                  class="mt-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Set a deadline"
                  onChange={(e) => {
                    setNewTask({ ...newTask, time: e.target.value });
                    console.log(newTask);
                  }}
                  required
                />
              </div>
              <button
                data-modal-hide="popup-modal"
                type="button"
                class="mr-2 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                onClick={() => taskCreationHandler(newTask, student)}
              >
                Assign
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
