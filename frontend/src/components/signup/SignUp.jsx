import React, { useRef, useState, useEffect } from "react";
import leftImage from "../assets/leftimage.png";
import rightImage from "../assets/Group 100.jpg";
import logo from "../assets/Logo.png";
import gsap from "gsap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../signup/signUp.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword,setShowConfirmPassword] = useState(false)
  const [isActive, setIsActive] = useState(false);
  const [isOtp, setIsOtp] = useState(
    JSON.parse(localStorage.getItem("isOtp")) || false
  );
  const [storedEmail, setStoredEmail] = useState(
    localStorage.getItem("email") || ""
  );
  const signUpRef = useRef();
  const loginRef = useRef();
  const inputRef = useRef();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password");
  const onSignUpSubmit = async (data) => {
    try {
      const { password, email, name, mobileNumber } = data;

      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        mobileNumber,
        password,
      });
      setIsOtp(true);
      setStoredEmail(email);
      localStorage.setItem("isOtp", JSON.stringify(true));
      localStorage.setItem("email", email);
      reset();
      console.log(response.data.message);
    } catch (error) {
      console.log("error while submitting", error);
    }
  };
  const onOtpSubmit = async (data) => {
    const { otp } = data;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verifypasscode",
        {
          email: storedEmail,
          otp,
        }
      );
      setIsOtp(false);
      localStorage.removeItem("isOtp");
      localStorage.removeItem("email");
      reset();
      setIsActive(false);
      console.log(response.data.message);
    } catch (error) {
      console.log("Error while verification", error);
    }
  };
  const onLoginSubmit = async (data) => {
    const { email, password } = data;
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('token',response.data.token);
      console.log(response.data.message);
      navigate("/sending-mail");
    } catch (error) {
      console.log("Error while login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isOtp") === "true") {
      setIsOtp(true);
    }
  }, []);
  useEffect(() => {
    //Setting bg directly through gsap
    gsap.set(signUpRef.current, {
      backgroundImage: "linear-gradient(to right, black, #EE2922)",
    });
    gsap.set(loginRef.current, {
      backgroundColor: "#EE2922",
    });
  }, [isOtp]);

  useEffect(() => {
    if (isActive) {
      //Sign Up button to gradient and Login button to solid
      gsap.to(signUpRef.current, {
        backgroundImage: "linear-gradient(to right, black, #EE2922)",
        duration: 0.5,
      });
      gsap.to(loginRef.current, {
        backgroundColor: "#EE2922",
        backgroundImage: "none", // Ensure no gradient is applied
        duration: 1,
      });
    } else {
      //Login to gradient and signUp to solid
      gsap.to(loginRef.current, {
        backgroundImage: "linear-gradient(to left, black, #EE2922)",
        duration: 0.5,
      });
      gsap.to(signUpRef.current, {
        backgroundColor: "#EE2922",
        backgroundImage: "none", // Ensure no gradient is applied
        duration: 0.5,
      });
    }
  }, [isActive]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      inputRef.current,
      {
        opacity: 0,
        x: -50,
        duration: 0.5,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
      }
    );
  }, [isActive]);

  return (
    <section className="xl:h-screen w-full bg-black flex">
      <div className="xl:h-screen xl:w-24 h-screen w-7 bg-[#EE2922] flex justify-center items-end relative">
        <img
          src={leftImage}
          alt="left"
          className="absolute bottom-24 xl:bottom-5 xl:h-[300px] xl:w-[100px]"
        />
      </div>

      <div>
        <img
          src={rightImage}
          alt="right"
          className="xl:h-[280px] xl:w-[150px] absolute right-0 h-24 w-12"
        />
      </div>
      {/* {Main div} */}
      <div className="flex flex-col mt-9 xl:flex-row items-center xl:justify-evenly w-full px-4">
        <div className="flex flex-col items-center gap-4 text-center mb-6">
          <img src={logo} alt="Logo" className="xl:h-[40px] h-[28px] w-auto" />
          <p className="text-white text-2xl lg:text-4xl font-light">
            Authorized Access
          </p>
        </div>
        {isOtp ? (
          <div className="h-[300px] w-full lg:w-[400px] border mt-10 xl:mt-0 rounded-lg shadow-md">
            <button
              className={`w-full bg-gradient-to-r from-black to-[#EE2922] text-white font-bold py-2 rounded-lg`}
            >
              Passcode
            </button>
            <form
              className="mt-4 px-3"
              ref={inputRef}
              onSubmit={handleSubmit(onOtpSubmit)}
            >
              <div className="mb-4">
                <input
                  type="email"
                  className="name w-full border-0 border-b-2 border-gray-400 bg-transparent text-white pt-6 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#EE2922] focus:placeholder-opacity-0"
                  placeholder="Email"
                  {...register("email")}
                  onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="name w-full border-0 border-b-2 border-gray-400 bg-transparent text-white pt-6 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#EE2922] focus:placeholder-opacity-0"
                  placeholder="OTP"
                  {...register("otp")}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="xl:w-full w-[120px] bg-[#EE2922]  text-white py-2 rounded-lg hover:bg-red-600 transition mt-6"
                >
                  VERIFY
                </button>
              </div>
              <div className="text-white font-light text-center text-[14px] mt-3">
                <button
                  className="underline"
                  onClick={(e) => {
                    setIsOtp(false);
                  }}
                >
                  Sign up?
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={`${
              isActive ? "h-[460px]" : "h-[280px]"
            } w-full lg:w-[400px] border mt-10 xl:mt-0 rounded-lg shadow-md px-3 py-2 mb-6`}
          >
            <div className="flex justify-between">
              <button
                ref={signUpRef}
                className={`w-1/2 text-white py-2 rounded-l-lg`}
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
              <button
                ref={loginRef}
                className={`w-1/2 text-white py-2 rounded-r-lg`}
                onClick={() => setIsActive(false)}
              >
                Login
              </button>
            </div>

            {isActive ? (
              <form ref={inputRef} onSubmit={handleSubmit(onSignUpSubmit)}>
              {/* Name Input */}
              <div className="mainDiv">
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="input"
                  placeholder="Name"
                />
                <label
                  htmlFor="name"
                  className="label"
                >
                  Name
                </label>
              </div>
            
              {/* Email Input */}
              <div className="mainDiv">
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    },
                  })}
                  className="input"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="label"
                >
                  Email
                </label>
              </div>
            
              {/* Phone Input */}
              <div className="mainDiv">
                <input
                  type="text"
                  id="mobilenumber"
                  {...register("mobileNumber", { required: "Mobile Number is required" })}
                  className="input"
                  placeholder="Phone No."
                />
                <label
                  htmlFor="mobilenumber"
                  className="label"
                >
                  Phone No.
                </label>
              </div>
            
              {/* Password Input */}
              <div className="mainDiv">
                <input
                  type={showPassword? "text":"password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6 },
                  })}
                  className="input"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="label"
                >
                  Password
                </label>
                <div className="absolute right-3 top-1/2 translate-y-[-50%] text-gray-500 cursor-pointer" onClick={()=>{
                  setShowPassword(!showPassword)
                }}>
                  {showPassword ? <FaEye/>: <FaEyeSlash/>}
                </div>
              </div>
            
              {/* Confirm Password Input */}
              <div className="mainDiv">
                <input
                  type={showconfirmPassword? "text":"password"}
                  id="confirmpassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className="input"
                  placeholder="Confirm Password"
                />
                <label
                  htmlFor="confirmpassword"
                  className="label"
                >
                  Confirm Password
                </label>
                <span className="absolute right-3 top-1/2 translate-y-[-50%] text-gray-500 cursor-pointer" onClick={()=>{
                  setShowConfirmPassword(!showconfirmPassword)
                }}>
                  {showconfirmPassword ? <FaEye/>: <FaEyeSlash/>}
                </span>
                {errors.confirmPassword && (
      <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
    )}
              </div>
            
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EE2922] text-white mt-3 py-2 font-semibold rounded-lg hover:bg-red-600 transition"
              >
                SIGN UP
              </button>
            
              {/* Passcode Link */}
              <div className="text-white font-light text-center text-[14px] mt-3">
                <button
                  className="underline"
                  onClick={() => {
                    setIsOtp(true);
                  }}
                >
                  Have a passcode?
                </button>
              </div>
            </form>
            
            ) : (
              <form
                className="mt-4"
                ref={inputRef}
                onSubmit={handleSubmit(onLoginSubmit)}
              >
                <div className="mainDiv">
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    },
                  })}
                  className="input"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="label"
                >
                  Email
                </label>
              </div>
              <div className="mainDiv">
                <input
                  type={showPassword? "text":"password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6 },
                  })}
                  className="input"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="label"
                >
                  Password
                </label>
                <div className="absolute right-3 top-1/2 translate-y-[-50%] text-gray-500 cursor-pointer" onClick={()=>{
                  setShowPassword(!showPassword)
                }}>
                  {showPassword ? <FaEye/>: <FaEyeSlash/>}
                </div>
              </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="xl:w-1/2 w-[120px] bg-[#EE2922]  text-white py-2 rounded-lg hover:bg-red-600 transition mt-6"
                  >
                    LOGIN
                  </button>
                  <a
                    href="/"
                    className="text-white font-light ml-5 xl:text-sm text-[12px] underline mt-8"
                  >
                    Forgot your password?
                  </a>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SignUp;
