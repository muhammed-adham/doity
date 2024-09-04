import React, { useEffect, useState } from "react";
import userStore from "../../context/store";
import supabase from "../../utils/supabaseConfig";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userName, setUserName } = userStore();
  const [inputData, setInputData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  // on input change handler
  const onInputHandler = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  // sign in by email and password handler
  const signUnHandler = async (e) => {
    e.preventDefault();
    const { email, password, fullName } = inputData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Handle sign-up errors
        console.error("Sign-up error:", error.message);
        // Display an error message to the user
        toast.error(error.message);
        return;
      }

      // Sign-up was successful
      console.log("Sign-up successful:", data);
      // Redirect the user to the desired page or show a success message
      toast.success(
        "Check your email."
      );
      navigate("/verify");
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error);
      // Display a generic error message to the user
      toast.error("An error occurred. Please try again later.");
    }
  };

  // sign in with github button handler
  const signInWithGitHandler = async () => {
    setLoading(true);
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      toast.error(error.message);
    } else {
      setUserName(user?.data?.user?.user_metadata?.full_name);
    }
  };

  // check user handler
  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      // console.log(user?.data?.user?.user_metadata?.full_name);
      setUserName(user?.data?.user?.email);
    };
    checkUser();
  }, []);

  // if auth redirect to home page
  useEffect(() => {
    if (userName) {
      navigate("/home");
      setLoading(false);
    } else setLoading(false);
  }, [userName]);
  return (
    <>
      {loading ? <Loader /> : null}
      <div className=" flex items-center justify-between ">
        <div className="bg-section ">
          <NavLink to={"/"} className="sign-title ">
            <h2 className="text-textColor">log in</h2>
          </NavLink>
          <NavLink to={"/sign-up"} className="sign-title top-[24rem]">
            <h2 className="text-textColor">sign up</h2>
          </NavLink>
        </div>
        <div className="form-section flex flex-col gap-6 items-center px-6 w-[62rem]">
          <div className="logo-container text-center ">
            <h3 className="text-primaryColor">United we do</h3>
            <h1>doity list</h1>
          </div>
          {/* <div className="sign-banner w-[24.375rem] h-[24.375rem] ">
            <img src="/doity-mark.svg" alt="" />
          </div> */}
          <div className="sign-form pb-16">
            <form
              className="flex flex-col items-center gap-4 py-6 px-4 bg-foreground shadow-md w-[24.375rem] "
              onSubmit={signUnHandler}
            >
              <h2 className="opacity-20 ">sign in</h2>
              <input
                onInput={onInputHandler}
                onChange={onInputHandler}
                required
                type="fullName"
                name="fullName"
                id="fullName"
                placeholder="Full name.."
                className="bg-grayColor p-4 w-full input"
              />
              <input
                onInput={onInputHandler}
                onChange={onInputHandler}
                required
                type="email"
                name="email"
                id="email"
                placeholder="Email.."
                className="bg-grayColor p-4 w-full input"
              />
              <input
                onInput={onInputHandler}
                onChange={onInputHandler}
                required
                type="password"
                name="password"
                id="password"
                minLength={6}
                placeholder="Password.."
                className="bg-grayColor p-4 w-full input"
              />
              <input
                type="submit"
                value={"sign up"}
                className="btnPrimary bg-textColor text-foreground text-foreground px-4 py-2 text-lg capitalize font-bold"
              />
              <span>
                Already have account?
                <Link to={"/"}> Log in</Link>
              </span>
            </form>
          </div>
          <div
            className="btnPrimary flex items-center justify-center gap-10 p-4 bg-accentColor w-full"
            onClick={signInWithGitHandler}
          >
            <div className="git-container h-[2.5rem]">
              <img src="/github-mark-white.png " alt="" />
            </div>
            <h3 className="text-white">sign in with gitHub</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
