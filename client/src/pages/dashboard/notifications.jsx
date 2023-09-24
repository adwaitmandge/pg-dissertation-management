import React, { useEffect, useState } from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { UserState } from "@/context/UserProvider";
import DocViewer from "react-doc-viewer";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function Notifications() {
  const { user } = UserState();
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  const [showAlerts, setShowAlerts] = useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });

  const [pendingThesis, setPendingThesis] = useState([]);
  
  const getPendingThesis = async () => {
    try {
      let endpoint = "";
      if (user.role === "Mentor") {
        console.log("I am mentor");
        endpoint = "thesis-notifications";
      } else if (user.role === "Student") {
        console.log("I am a student");
        endpoint = "getfeedback";
      }

      const res = await fetch(`http://localhost:5000/api/thesis/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      setPendingThesis(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPendingThesis();
  }, [user]);

  console.log("Hi");
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
            Alerts
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {pendingThesis?.map((thesis, index) => (
            <Link
              to={`/dashboard/preview/thesis/${thesis._id}`}
              state={{ thesis: thesis }}
              key={index}
            >
              {user.role === "Student" && (
                <>
                  {thesis?.feedback}
                  {thesis?.status === "Accept" && (
                    <Alert
                      key={index}
                      show={showAlerts["green"]}
                      color={"green"}
                      dismissible={{
                        onClose: () =>
                          setShowAlerts((current) => ({
                            ...current,
                            [color]: false,
                          })),
                      }}
                    >
                      {thesis?.status}
                    </Alert>
                  )}
                  {thesis?.status === "Pending" && (
                    <Alert
                      key={index}
                      show={showAlerts["orange"]}
                      color={"orange"}
                      dismissible={{
                        onClose: () =>
                          setShowAlerts((current) => ({
                            ...current,
                            [color]: false,
                          })),
                      }}
                    >
                      {thesis?.status}
                    </Alert>
                  )}
                  {thesis?.status === "Reject" && (
                    <Alert
                      key={index}
                      show={showAlerts["red"]}
                      color={"red"}
                      dismissible={{
                        onClose: () =>
                          setShowAlerts((current) => ({
                            ...current,
                            [color]: false,
                          })),
                      }}
                    >
                      {thesis?.status}
                    </Alert>
                  )}
                </>
              )}
              {user.role === "Mentor" && (
                <>
                  {thesis?.student.name}
                  <Alert
                    key={index}
                    show={showAlerts["green"]}
                    color={"green"}
                    dismissible={{
                      onClose: () =>
                        setShowAlerts((current) => ({
                          ...current,
                          [color]: false,
                        })),
                    }}
                  >
                    {thesis?.student.name}
                  </Alert>
                </>
              )}
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
