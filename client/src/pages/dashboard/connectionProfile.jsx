import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import DocViewer, { PDFRenderer, PNGRenderer } from "react-doc-viewer";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { UserState } from "@/context/UserProvider";
import { useEffect, useState } from "react";
import { NavigateBeforeTwoTone, RequestQuote } from "@mui/icons-material";
import { useToast } from "@chakra-ui/react";

export function ConnectionProfile() {
  const { user } = UserState();
  const [allThesis, setAllThesis] = useState([]);
  const [isConnected, setIsConnected] = useState(0);
  const [allConnections, setAllConnections] = useState([]);
  const location = useLocation();
  const connection = location.state;
  const toast = useToast();

  const docs = [
    {
      uri: "https://res.cloudinary.com/dralpqhoq/raw/upload/v1694840138/rb6qrhwvacosxwqrlies.pdf",
    },
  ];

  const navigate = useNavigate();

  const fetchThesis = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/thesis/", {
        methods: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();
      console.log("The data is ", data);
      console.log(data.thesis);
      setAllThesis(data.thesis);
      // setDocs(data.thesis.map((thesis) => thesis.cloudinaryLink));
    } catch (err) {
      console.error(err.message);
    }
  };

  const sendConnection = async () => {
    console.log("Inside send connection");
    toast({
      title: "Connection Request Sent",
      description: "Your request has been sent",
      position: "top-right",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    const body = { from: user?._id, to: connection?._id };

    try {
      const res = await fetch("http://localhost:5000/api/connections/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
      setAllConnections(data);
      setIsConnected(2);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchConnections = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/connections/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      data?.map((request) => {
        console.log(request.to);
        console.log(connection._id);
        if (connection._id == request.to) {
          console.log("Match");
          if (request.status == "Accepted") {
            setIsConnected(1);
          } else if (request.status == "Pending") {
            setIsConnected(2);
          } else if (request.status == "Rejected") {
            setIsConnected(3);
          }
        }
      });

      setAllConnections(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchThesis();
    fetchConnections();
  }, [user]);

  console.log(user);

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={`${connection?.pic}`}
                alt="Picture"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {connection?.name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {connection?.role}
                </Typography>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                disabled={isConnected == 2}
                onClick={sendConnection}
                className={`mr-2 mb-2 cursor-pointer ${
                  connection?._id == user?._id ? "hidden" : ""
                } rounded-full bg-blue-700  px-5 py-2.5 text-center text-sm font-medium text-white 
                 hover:bg-blue-800 focus:outline-none focus:ring-4   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              >
                {isConnected == 1
                  ? "Accepted"
                  : isConnected == 2
                  ? "Pending"
                  : isConnected == 3
                  ? "Rejected"
                  : "Connect"}
              </button>
            </div>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <di>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              <div className="flex flex-col gap-12">
                {platformSettingsData.map(({ title, options }) => (
                  <div key={title}>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      {title}
                    </Typography>
                    <div className="flex flex-col gap-6">
                      {options.map(({ checked, label }) => (
                        <Switch
                          key={label}
                          id={label}
                          label={label}
                          defaultChecked={checked}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </di>
            <ProfileInfoCard
              title="Profile Information"
              description={`${connection?.description}`}
              details={{
                "first name": connection?.name,
                mobile: "(44) 123 1234 123",
                email: connection?.email,
                location: "India",
                social: (
                  <div className="flex items-center gap-4">
                    <i className="fa-brands fa-facebook text-blue-700" />
                    <i className="fa-brands fa-twitter text-blue-400" />
                    <i className="fa-brands fa-instagram text-purple-500" />
                  </div>
                ),
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Projects
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {allThesis?.map(
                ({
                  img,
                  title,
                  description,
                  tag,
                  route,
                  members,
                  cloudinaryLink,
                }) => {
                  console.log(title);
                  return (
                    <Card key={title} color="transparent" shadow={false}>
                      <DocViewer
                        documents={docs}
                        pluginRenderers={[PDFRenderer]}
                      />

                      <CardBody className="py-0 px-1">
                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {" "}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="mt-1 mb-2"
                          onClick={() => navigate(`${cloudinaryLink}`)}
                        >
                          {title}
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {description}
                        </Typography>
                      </CardBody>
                      <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                        <Link to={route}>
                          <Button variant="outlined" size="sm">
                            view project
                          </Button>
                        </Link>
                        <div>
                          {members?.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default ConnectionProfile;
