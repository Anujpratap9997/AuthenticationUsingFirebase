import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgGoogle, CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [username,setUsername]=useState('');
  const [phoneNumberIsValid, setPhoneNumberIsValid] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => { },
        },
        auth
      );
    }
  }
  function isValidPhoneNumber(phoneNumber) {
    // Define a regular expression pattern for a valid phone number
    const phonePattern = /^\+?\d{10,15}$/; // Modify this pattern to match your requirements
  
    // Test the provided phoneNumber against the pattern
    return phonePattern.test(phoneNumber);
  }
  

  function onSignup() {
    if (!usernameIsValid || !phoneNumberIsValid) {
      toast.error("Please enter a valid name and phone number.");
      return;
    }
    setLoading(true);
    onCaptchVerify();


    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        toast.success("Logged in successfully!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Incorrect OTP. Please try again.");
        setOtp('')
      });
  }
  function onGoogleSignIn() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // You can access user information from 'result.user'
        setUser(result.user);
        const user=result.user;
        setUsername(user.displayName)
        toast.success("Logged in successfully!");

        // Use the userName as needed
        //console.log("User's name:", userName);
        console.log(user.displayName);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  function onFacebookSignIn() {
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // You can access user information from 'result.user'
        setUser(result.user);
        console.log(result);
        console.log(result._tokenResponse.displayName);
        const user = result._tokenResponse.displayName;
        setUsername(user)
        toast.success("Logged in successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            Dear {username}, You have successfully Login!!!
          </h2>
        ) : (
          <div className="w-100 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to Coachshala
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  Sign in with your phone number
                </label>
                <PhoneInput country={"in"}
                 value={ph}
                 onChange={(value) => {
                  setPh(value);
              
                  // Validate the phone number input (e.g., use the isValidPhoneNumber function)
                  setPhoneNumberIsValid(isValidPhoneNumber(value));
                }}
                   placeholder="Enter your phone number" 
                   />
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white "
                >
                  Enter Your Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your name here"
                  class="block w-80 px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setUsernameIsValid(e.target.value.trim() !== "");
                  }}
                />
                <button
                  onClick={onSignup}
                  
                  className="bg-emerald-600 hover:bg-emerald-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
                <div>
                  <p className="font-bold text-xl text-white text-center">OR</p>
                </div>
                <button
                  onClick={onGoogleSignIn}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  <CgGoogle size={20} style={{ marginRight: "8px" }} />
                  <span>Sign in with Google</span>
                </button>
                <button
                  onClick={onFacebookSignIn} // Add this line for Facebook authentication
                  className="bg-blue-600 hover:bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  <span>Sign in with Facebook</span>
                  {/* You need to import the Facebook icon */}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
