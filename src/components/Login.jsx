import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";

const LOGIN_URL = '/auth';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || '/home';
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();
    const [showPwd, setShowPwd] = useState(false);
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const toggleShowPwd = () => {
        setShowPwd(!showPwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            setAuth({ user, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (
        <div className="flex flex-row items-center justify-between h-screen bg-login-signup bg-cover bg-center h-screen">
            <div>
                <h1>.</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-screen w-[25rem] px-14 bg-[#f0f4f8] shadow-lg rounded-lg">
  <div className="w-full flex flex-col items-center justify-center pt-8 pb-6">
    <h1 className="text-3xl text-center text-[#23ca85] tracking-wider font-Outfit-Bold mb-8">
      LOG IN
    </h1>
    
    <div className={errMsg ? "flex flex-row items-center p-3 w-full border border-red-600 rounded-md bg-red-100 text-red-600 mb-4" : "hidden"}>
      <FontAwesomeIcon icon={faExclamationCircle} className="h-5 mr-2" />
      <p ref={errRef} className="font-Outfit-Regular text-sm" aria-live="assertive">{errMsg}</p>
    </div>

    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label className="text-gray-700 font-Outfit-Medium mb-2" htmlFor="username">Username</label>
        <input
          className="h-12 w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#23ca85] transition-all duration-150"
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          placeholder="Enter your username"
          spellCheck="false"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-Outfit-Medium mb-2" htmlFor="password">Password</label>
        <div className={`flex items-center h-12 w-full rounded-lg border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#23ca85] transition-all duration-150`}>
          <input
            className="h-full w-full px-4 py-2 rounded-l-lg focus:outline-none"
            type={showPwd ? 'text' : 'password'}
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            value={pwd}
            required
            placeholder="Enter your password"
          />
          <div className="flex items-center justify-center h-full w-12 bg-gray-100 rounded-r-lg">
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-gray-500 cursor-pointer" onClick={toggleShowPwd} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-6">
        <button
          className="w-full py-3 rounded-full bg-[#23ca85] text-white font-Outfit-Bold tracking-wider hover:bg-opacity-90 transition-all duration-150"
          type="submit">
          Sign In
        </button>
      </div>
    </form>
  </div>
  
  <div className="flex items-center justify-center mt-4 text-sm">
    <p className="text-gray-600">Don't have an account?</p>
    <span className="ml-2 text-[#007BFF] hover:text-[#0056b3]">
      <Link to="/register">Sign Up</Link>
    </span>
  </div>
</div>

        </div>
    );
}