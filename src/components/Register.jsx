import { useRef, useState, useEffect } from "react";
import { faInfoCircle, faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link, useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const MAIL_REGEX = /^[A-Za-z0-9]+@gmail\.com$/;
const REGISTER_URL = '/register';

const Register = () => {
    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();
    const emailRef = useRef();
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [mail, setMail] = useState('');
    const [validMail, setValidMail] = useState(false);
    const [mailFocus, setMailFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidMail(MAIL_REGEX.test(mail));
    }, [mail])

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const toggleShowPwd = () => {
        setShowPwd(!showPwd);
    };

    const toggleShowConfirmPwd = () => {
        setShowConfirmPwd(!showConfirmPwd);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validName || !validPwd || !validMail || !validMatch) {
            setErrMsg("Invalid Entry");
            return;
        }
        const email = emailRef.current.value;
        try {
            const response = await axios.post(REGISTER_URL, JSON.stringify({ user, email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            navigate('/');
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username already taken');
            } else {
                setErrMsg('Registration failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="flex flex-row items-center justify-between h-screen bg-login-signup bg-cover bg-center h-screen">
            <div>
                <h1>.</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-screen w-[25rem] px-8 py-10 bg-white shadow-xl rounded-lg">
    <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl text-center text-[#23ca85] tracking-wider font-Outfit-Bold mb-8">REGISTER</h1>

        {errMsg && (
            <div className="flex items-center p-3 h-auto w-full border border-red-600 rounded-lg bg-red-100 text-red-600 mb-4">
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 mr-2" />
                <p ref={errRef} className="text-sm font-light" aria-live="assertive">{errMsg}</p>
            </div>
        )}

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5 w-full">
            {/* Username Input */}
            <div className="flex flex-col">
                <label htmlFor="username" className="text-gray-700 font-medium mb-2">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    spellCheck="false"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    placeholder="Enter your username"
                    className={`w-full h-12 px-4 py-2 border rounded-md focus:outline-none 
                    ${validName ? "border-green-500 focus:ring focus:ring-green-200" : "border-gray-300 focus:ring focus:ring-black"}
                    ${!validName && user ? "border-red-500" : ""}`}
                />
                {userFocus && user && !validName && (
                    <div className="text-xs text-red-600 mt-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                        4 to 24 characters. Must start with a letter. Allowed: letters, numbers, underscores, hyphens.
                    </div>
                )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 font-medium mb-2">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    spellCheck="false"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setMail(e.target.value)}
                    value={mail}
                    aria-invalid={validMail ? "false" : "true"}
                    aria-describedby="mailnote"
                    onFocus={() => setMailFocus(true)}
                    onBlur={() => setMailFocus(false)}
                    placeholder="Enter your email"
                    className={`w-full h-12 px-4 py-2 border rounded-md focus:outline-none 
                    ${validMail ? "border-green-500 focus:ring focus:ring-green-200" : "border-gray-300 focus:ring focus:ring-black"}
                    ${!validMail && mail ? "border-red-500" : ""}`}
                />
                {mailFocus && mail && !validMail && (
                    <p className="text-xs text-red-600 mt-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                        Please use a valid email.
                    </p>
                )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
                <label htmlFor="password" className="text-gray-700 font-medium mb-2">
                    Password
                </label>
                <div className="flex items-center w-full border rounded-md">
                    <input
                        type={showPwd ? 'text' : 'password'}
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        aria-invalid={validPwd ? "false" : "true"}
                        placeholder="Enter your password"
                        className="flex-grow h-12 px-4 py-2 rounded-l-md outline-none border-r focus:ring-green-200"
                    />
                    <FontAwesomeIcon
                        icon={showPwd ? faEyeSlash : faEye}
                        className="w-10 text-gray-500 cursor-pointer px-3"
                        onClick={toggleShowPwd}
                    />
                </div>
                {pwdFocus && !validPwd && (
                    <p className="text-xs text-red-600 mt-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                        8-24 characters, include upper and lowercase, a number, and a special character.
                    </p>
                )}
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col">
                <label htmlFor="confirm_pwd" className="text-gray-700 font-medium mb-2">
                    Confirm Password
                </label>
                <div className="flex items-center w-full border rounded-md">
                    <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        placeholder="Re-enter your password"
                        className="flex-grow h-12 px-4 py-2 rounded-l-md outline-none border-r focus:ring-green-200"
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPwd ? faEyeSlash : faEye}
                        className="w-10 text-gray-500 cursor-pointer px-3"
                        onClick={toggleShowConfirmPwd}
                    />
                </div>
                {matchFocus && !validMatch && (
                    <p className="text-xs text-red-600 mt-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                        Must match the first password field.
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
                <button
                    type="submit"
                    className="bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 focus:ring focus:ring-green-200"
                >
                    Sign Up
                </button>
            </div>
        </form>
    </div>

    <div className="flex items-center justify-center mt-8 text-gray-600">
        <p>Already have an account?</p>
        <Link to="/" className="text-blue-600 ml-2">Sign In</Link>
    </div>
</div>

        </div>
    )
}

export default Register;