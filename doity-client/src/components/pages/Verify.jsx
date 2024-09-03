import React from "react";
import { CiShare1 } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Verify = () => {
  return (
    <>
      <div className="check-email flex w-full justify-center items-center flex-col h-[100vh] gap-4">
            <h1>Doity list</h1>
        <div className="title flex gap-4 items-center">
          <MdEmail className="size-10" />
          <h2>Check Your Inbox</h2>
        </div>
        <p>Confirm your identity by clicking the link we sent</p>
        <div
          className="button flex justify-between h-16 w-80  hover:shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.25)] items-center p-4 cursor-pointer bg-primaryColor text-textColor"
          onClick={() =>
            (window.location.href =
              "https://mail.google.com/mail/u/0/#search/from%3A(supabase)+in%3Aanywhere")
          }
        >
          <div className="image-container">
          <img src="/gmail.svg" alt="" className="w-fit " />
          </div>
          <b>Open Gmail</b>
          <CiShare1 />
        </div>
        <Link to={"/"}>Home Page</Link>
      </div>
    </>
  );
};

export default Verify;
