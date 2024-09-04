import React, { useEffect, useState } from "react";
import userStore from "../../context/store";
import supabase from "../../utils/supabaseConfig";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const Sign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userName, setUserName } = userStore();
  const [themeState, setThemeState] = useState();
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  // theme toggle
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
        darkMode();
      } else if (window.matchMedia("(prefers-color-scheme:light)").matches) {
        lightMode();
      }
    } else {
      if (localStorage.getItem("theme") === "dark") {
        darkMode();
      } else if (localStorage.getItem("theme") === "light") {
        lightMode();
      }
    }
  },[]);
  // theme mode handlers
  const darkMode = () => {
    document.querySelector("body").classList.add("dark");
    // document.getElementById("dark-mode-input").checked = true;
    localStorage.setItem("theme", "dark");
    setThemeState("dark");
  };
  const lightMode = () => {
    document.querySelector("body").classList.remove("dark");
    // document.getElementById("dark-mode-input").checked = false;
    localStorage.setItem("theme", "light");
    setThemeState("light");
  };
  // on input change handler
  const onInputHandler = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  // sign in by email and password handler
  const signInHandler = async (e) => {
    e.preventDefault();
    const { email, password, fullName } = inputData;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      // Sign-up was successful
      console.log("Sign-up successful:", data);
      toast.success("welcome");
      navigate("/home");
    } catch (error) {
      toast.error("Please try again later.");
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
        <div className="form-section flex flex-col gap-6 items-center px-6 w-[62rem] ">
          <div className="logo-container text-center ">
            <h3 className="text-primaryColor">United we do</h3>
            <h1>doity list</h1>
          </div>
          {/* <div className="sign-banner w-[24.375rem] h-[24.375rem] ">
            <img src="/doity-mark.svg" alt="" />
          </div> */}
          <div className="sign-form pb-16">
            <form
              className="flex flex-col items-center gap-4 py-6 px-4 bg-foreground shadow-md w-[24.375rem]"
              onSubmit={signInHandler}
            >
              <h2 className="opacity-20 ">sign in</h2>
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
                value={"log in"}
                className="btnPrimary bg-textColor text-foreground text-foreground px-4 py-2 text-lg capitalize font-bold"
              />
              <span>
                Don't have an account?
                <Link to={"/sign-up"}> Sign up</Link>
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

export default Sign;
