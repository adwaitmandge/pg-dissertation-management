import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useState } from "react";

const steps = ["Personal Details", "Qualification", "Publications"];

export function SignUp() {
  const [stepLabel, setStepLabel] = useState(0);
  const [showQualificationsPanel, setShowQualificationPanel] = useState(false);
  const [showPersonalDetailsPanel, setShowPersonalDetailsPanel] =
    useState(true);
  const [showPublicationsPanel, setShowPublicationsPanel] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !university ||
      !department ||
      !role ||
      !fieldOfInterest
    ) {
      console.log("Missing Credentials");
    }

    try {
      console.log("About to send request");
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: {
          name,
          email,
          password,
          university,
          department,
          role,
          fieldOfInterest,
        },
      });

      console.log("After the request");
      setLoading(false);
      const data = await res.json();
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/dashboard/home");
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-gray-50 ">
      <section class="overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          {/* <a
            href="#"
            class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              class="mr-2 h-8 w-8"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Flowbite
          </a> */}
          {showPersonalDetailsPanel && (
            <div class="w-[100%] rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
              <Box className="mt-3 w-[100%] overflow-hidden px-2 pt-3">
                <Stepper activeStep={stepLabel} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                  Create an Account
                </h1>
                <form className="flex flex-col space-y-4  md:space-y-6">
                  <div>
                    <label
                      for="email"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="name@company.com"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      class="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="confirmPassword"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      class="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required=""
                    />
                  </div>
                  <button
                    onClick={() => {
                      setStepLabel(stepLabel + 1);
                      setShowPersonalDetailsPanel(false);
                      setShowQualificationPanel(true);
                    }}
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Next
                  </button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account yet?{" "}
                    <a
                      href="/auth/sign-in"
                      class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Sign in
                    </a>
                  </p>
                </form>
              </div>
            </div>
          )}

          {showQualificationsPanel && (
            <div class="w-[100%] rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
              <Box className="mt-3 w-[100%] overflow-hidden px-2 pt-3">
                <Stepper activeStep={stepLabel} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                  Create an Account
                </h1>
                <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label
                      for="fullname"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      onChange={(e) => setName(e.target.value)}
                      id="fullname"
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="Full Name"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="university"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      id="university"
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="University Name"
                      class="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="department"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Department Name
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDepartment(e.target.value)}
                      name="department"
                      id="department"
                      placeholder="Department Name"
                      class="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required=""
                    />
                  </div>

                  <div className="flex items-center justify-start space-x-3">
                    <button
                      onClick={() => {
                        setStepLabel(stepLabel - 1);
                        setShowQualificationPanel(false);
                        setShowPersonalDetailsPanel(true);
                      }}
                      type="button"
                      class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setStepLabel(stepLabel + 1);
                        setShowQualificationPanel(false);
                        setShowPublicationsPanel(true);
                      }}
                      type="button"
                      class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Next
                    </button>
                  </div>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account yet?{" "}
                    <a
                      href="/auth/sign-in"
                      class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Sign in
                    </a>
                  </p>
                </form>
              </div>
            </div>
          )}

          {showPublicationsPanel && (
            <div class="w-[100%] rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
              <Box className="mt-3 w-[100%] overflow-hidden px-2 pt-3">
                <Stepper activeStep={stepLabel} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                  Create an Account
                </h1>
                <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label
                      for="publication"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Publications
                    </label>
                    <input
                      type="text"
                      name="publication"
                      id="publication"
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="Publication Details"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="countries"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select a role
                    </label>
                    <select
                      id="countries"
                      onChange={(e) => setRole(e.target.value)}
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="dep"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Field of Interest
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setFieldOfInterest(e.target.value);
                        console.log("name", name);
                        console.log("email", email);
                        console.log("university", university);
                        console.log("department", department);
                        console.log("password", password);
                        console.log("confirmPassword", confirmPassword);
                        console.log("role", role);
                      }}
                      name="areaOfExpertise"
                      id="areaOfExpertise"
                      placeholder="Area of expertise"
                      class="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required=""
                    />
                  </div>

                  <div className="flex items-center justify-start space-x-3">
                    <button
                      onClick={() => {
                        setStepLabel(stepLabel - 1);
                        setShowPublicationsPanel(false);
                        setShowQualificationPanel(true);
                      }}
                      disabled={loading}
                      type="button"
                      class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Back
                    </button>
                    {loading ? (
                      <button
                        disabled
                        type="button"
                        class=" w-full items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          class="mr-3 inline h-4 w-4 animate-spin text-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        Loading...
                      </button>
                    ) : (
                      <button
                        onClick={(e) => submitHandler(e)}
                        disabled={loading}
                        type="button"
                        class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account yet?{" "}
                    <a
                      href="/auth/sign-in"
                      class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Sign in
                    </a>
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SignUp;
