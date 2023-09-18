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

  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });

  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["blue", "green", "orange", "red"];

  const [pendingThesis, setPendingThesis] = useState([]);

  const getPendingThesis = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/thesis/thesis-notifications",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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
            >
              {thesis?.student?.name}
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
                {thesis?.student?.name}
              </Alert>
            </Link>
          ))}
        </CardBody>
      </Card>
      {/* <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Alerts with Icon
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map((color) => (
            <Alert
              key={color}
              show={showAlertsWithIcon[color]}
              color={color}
              icon={
                <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
              }
              dismissible={{
                onClose: () =>
                  setShowAlertsWithIcon((current) => ({
                    ...current,
                    [color]: false,
                  })),
              }}
            >
              A simple {color} alert with an <a href="#">example link</a>. Give
              it a click if you like.
            </Alert>
          ))}
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Notifications;
