import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import LoginButton from "@/widgets/Buttons/Login";
import LogoutButton from "@/widgets/Buttons/Logout";

const SCOPES = "https://www.googleapis.com/auth/drive";
// const CLIENT_ID =
//   "1038266043641-2fvvhnqhfg1dr6hbfa0bdvb8r41ik8b3.apps.googleusercontent.com";

// const API_KEY = "AIzaSyAVtw85VUc0wLAhu36J91XnabIXRVkIIyM";

const CLIENT_ID =
  "175944090009-nq8233t83oulbdi2ruplq5jm2el8fsod.apps.googleusercontent.com";

const API_KEY = "AIzaSyAACq19jCUo1JogPvmUoOhqrecHu5nqaGg";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }

    gapi.load("client:auth2", start);
  });

  const createFile = (tag) => {
    console.log(tag);

    const accessToken = gapi.auth.getToken().access_token;
    console.log(accessToken);

    fetch(`https://docs.googleapis.com/v1/documents?title=${tag}`, {
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    })
      .then((res) => {
        return res.json();
      })
      .then((val) => {
        console.log(val);
        console.log(val.documentId);
        window.open(
          `https://docs.google.com/document/d/${val.documentId}/edit`,
          "_blank"
        );
      });
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
        {/* <LoginButton />
        <LogoutButton />
        <button
          onClick={() => createFile("GPT DOC")}
          type="button"
          class="mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create DOC
        </button> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
