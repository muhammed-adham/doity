import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../../utils/supabaseConfig";
import toast from "react-hot-toast";

const OnBoard = () => {
  const [searchParams] = useSearchParams();
  //   const type = searchParams.get("type");
  //   const token = searchParams.get("token_hash");
  const { token_hash, type } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const navigate = useNavigate();

  const verifyUser = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({ token_hash, type });
      if (error) {
        toast.error("Something went wrong!");
      }
      toast.success("Welcome");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const verify = async () => {
      const session = await verifyUser(token_hash, type);
      if (session) {
        navigate("/home");
        toast.success("welcome");
      }
    };
    verify();
  }, [token_hash, type, navigate]); // Add dependencies to the effect

  return (
    <>
      <section className=" w-full h-[100vh] flex items-center justify-center">
        <h1 className="animation-logo">doity list</h1>
        <div className="loader-dots bg-transparent backdrop-blur-0 pt-32">
          <div className="dots-group">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OnBoard;
