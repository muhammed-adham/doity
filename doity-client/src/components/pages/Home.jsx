import React, { useEffect, useState } from "react";
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";
import userStore from "../../context/store";
import supabase, {
  deleteRow,
  getTasks,
  insertTask,
  updateRow,
} from "../../utils/supabaseConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MdDelete, MdModeEdit } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const { userName, setUserName } = userStore();
  const [taskData, setTaskData] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [themeState, setThemeState] = useState();
  const [updateState, setUpdateState] = useState(false);
  const [updateInputData, setUpdateInputData] = useState({});

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
  });
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
  const toggleHandler = () => {
    if (themeState === "dark") {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
    setThemeState((prev) => !prev);
  };

  // sign out handler
  const signOutHandler = async () => {
    toast("Good Bye!", {
      icon: "👋🏻",
      style: { color: "black" },
    });
    await supabase.auth.signOut();
    setUserName(null);
  };

  // check user handler
  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      setUserName(user?.data?.user?.email);
    };
    checkUser();
  }, []);

  // if auth redirect to home page
  useEffect(() => {
    if (!userName) {
      navigate("/");
    }
  }, [userName]);

  // input changes handler
  const inputHandler = (e) => {
    setTaskData((prev) => e.target.value);
    setUpdateInputData({
      ...updateInputData,
      task: e.target.value,
    });
  };

  // add task
  const { mutate: addTask } = useMutation({
    mutationFn: () => {
      if (taskData) {
        toast.promise(insertTask(taskData), {
          loading: "Adding...",
          success: <b>Task added successfully!</b>,
          error: <b>Could not save.</b>,
        });
        setAllTasks((prevTasks) => [...prevTasks, { task: taskData }]);

        setTaskData("");
      } else {
        toast.error("Empty Task");
      }
    },
  });
  // update handler
  const updateHandler = (task, id) => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setTaskData(task);
    setUpdateInputData({ task, id });
    setUpdateState(true);
  };
  // update task state
  const taskState = async (done, id) => {
    await supabase.from("tasks").update({ done }).eq("id", id).select();
  };
  // fetch update
  const { mutate: updateTask } = useMutation({
    mutationFn: () => {
      const { task, id } = updateInputData;
      if (task && id) {
        toast.promise(updateRow(task, id), {
          loading: "Updating...",
          success: <b>Task added successfully!</b>,
          error: <b>Could not save.</b>,
        });
        setAllTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === id ? { ...t, task } : t))
        );
        setTaskData("");
      } else {
        toast.error("Empty Task");
      }
      setUpdateState(false);
    },
  });
  //get tasks
  const { data: tasks, refetch } = useQuery({
    queryFn: getTasks,
    queryKey: ["tasks"],
  });
  // delete task
  const deleteHandler = (id) => {
    deleteRow(id);
    toast.success("Deleted successfully!");
    setAllTasks((prev) => prev.filter((item) => item.id !== id));
  };

  // initial value for all tasks state
  useEffect(() => {
    getTasks();
    if (tasks) {
      setAllTasks(tasks);
    }
  }, [tasks]);

  // Subscribe to changes
  useEffect(() => {
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new.task;
          if (eventType) {
            getTasks();
            toast(
              (t) => (
                <span>
                  Task has been <b>{eventType}</b>
                  <button
                    className="bg-textColor p-2 shadow-md ml-4  text-foreground font-bold"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Dismiss
                  </button>
                </span>
              ),
              { style: { color: "black" } }
            );
          }
        }
      )
      .subscribe();
  }, []);

  return (
    <>
      <section className="flex flex-col justify-center items-center gap-6">
        <header className="flex py-6 px-20 justify-between items-center shadow-md w-full">
          <div
            className="theme-toggle flex p-1 items-center justify-between bg-grayColor w-[6.125rem] rounded-full cursor-pointer"
            onClick={toggleHandler}
          >
            <div
              className={`sun px-2 ${themeState === "dark" ? "hidden" : null}`}
            >
              <BsFillSunFill />
            </div>
            <div className="btn-toggle rounded-full w-[2.5rem] h-[2.5rem] bg-darkGrayColor shadow-lg"></div>
            <div
              className={`moon px-2 ${themeState === "dark" ? null : "hidden"}`}
            >
              <BsMoonStarsFill />
            </div>
          </div>
          <div className="user-name-header text-primaryColor">
            <h3>{userName}</h3>
          </div>
          <div
            className="sign-out-container text-textColor opacity-50 hover:opacity-100 hover:text-dangerColor cursor-pointer"
            onClick={signOutHandler}
          >
            <h3>sign out</h3>
          </div>
        </header>
        <div className="main-container flex  px-6 flex-col items-center gap-6 w-fit">
          <h1> doity list</h1>
          <h2 className="text-accentColor self-start">what's next?..</h2>
          <div className="add-note flex justify-between items-center w-full">
            <input
              className="input h-[1.2rem] w-[18rem] p-6 bg-grayColor "
              type="text"
              placeholder="add task.."
              onInput={inputHandler}
              onChange={inputHandler}
              value={taskData}
            />
            <div
              onClick={updateState ? updateTask : addTask}
              className="btnPrimary h-12 w-full max-w-[6rem] bg-accentColor text-foreground flex justify-center items-center"
            >
              <h3>{updateState ? "edit" : "add"}</h3>
            </div>
          </div>
          <div className="task-cards-container w-full flex flex-col gap-4 relative">
            {allTasks?.toReversed().map((el, idx) => {
              return (
                <div
                  className="task-card w-full cursor-pointer relative"
                  key={idx}
                >
                  <form className="flex justify-start items-center px-4 gap-4 bg-foreground shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.4)] h-16">
                    <input
                      type="checkbox"
                      id={`task-${idx}`}
                      className="hidden"
                      onChange={(event) => {
                        const isChecked = event.target.checked;
                        taskState(isChecked, el.id);
                        // Do something with the checked value here
                      }}
                      checked={el.done ? true : false}
                    />
                    <div className="checkbox border-4 border-primaryColor  w-8 h-8 rounded-full"></div>
                    <label
                      htmlFor={`task-${idx}`}
                      className="w-full cursor-pointer h-16 ab flex items-center absolute left-0 w-fill pl-16"
                    >
                      {el?.task}
                    </label>
                  </form>
                  <div className="actions-container absolute top-4 -right-24 flex items-center gap-4">
                    <MdModeEdit
                      className="size-8 text-primaryColor hover:text-dangerColor"
                      onClick={() => updateHandler(el.task, el.id)}
                    />
                    <MdDelete
                      className="size-8 text-primaryColor hover:text-dangerColor"
                      onClick={() => deleteHandler(el.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="main-banner w-[24.375rem] h-[24.375rem] ">
          <img src="/doity-mark.svg" alt="" />
        </div>
      </section>
    </>
  );
};

export default Home;
