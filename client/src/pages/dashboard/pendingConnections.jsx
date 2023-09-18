import React, { useEffect, useState } from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { UserState } from "@/context/UserProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useToast } from "@chakra-ui/react";

export function PendingConnections() {
  const { user } = UserState();
  const [allConnections, setAllConnections] = useState([]);

  const toast = useToast();

  const acceptConnection = async (id) => {
    try {
      console.log("Inside function");
      console.log("The id is ", id);
      const body = { id: id };

      const res = await fetch("http://localhost:5000/api/connections/accept", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setAllConnections(data);
      toast({
        title: "Connection Added!.",
        description: "New connection has been added.",
        status: "success",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const rejectConnection = async (id) => {
    try {
      console.log("Inside function");
      console.log("The id is ", id);
      const body = { id: id };

      const res = await fetch("http://localhost:5000/api/connections/reject", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setAllConnections(data);
      toast({
        title: "Connection Denied!.",
        description: "You have rejected the connection.",
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const getConnections = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/connections/pending", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      setAllConnections(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getConnections();
  }, [user]);

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Connection History
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {allConnections.length == 0 && (
            <div className="-mt-8 text-xl">You have no pending connections</div>
          )}
          <div className="-mt-4">
            {allConnections?.map((connection) => {
              if (connection.status == "Pending")
                return (
                  <div class="flex w-full  items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div>
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {connection.from.name}
                      </h5>
                      <p class="font-normal text-gray-700 dark:text-gray-400">
                        Hi! I would like to connect with you!
                      </p>
                    </div>
                    <div className="mt-3 space-x-1">
                      <button
                        onClick={() => acceptConnection(connection._id)}
                        type="button"
                        class="mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectConnection(connection._id)}
                        type="button"
                        class="mr-2 mb-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PendingConnections;
