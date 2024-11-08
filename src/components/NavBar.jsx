import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState } from 'react';
import menu from '../assets/menu.png';
import menucollapse from '../assets/menucollapse.png';
import home from '../assets/home.png';
import room from '../assets/room.png';
import exam from '../assets/exam.png';
import seat from '../assets/seat.png';
import logout from '../assets/logout.png';
import profile from '../assets/profile.png';

const url = '/logout';

export default function NavBar() {
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();
    const [expand, setExpand] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => handleWidth());
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    const handleWidth = () => {
        if (windowWidth < 996) {
            setExpand(false);
        } else {
            setExpand(true);
        }
    };

    const handleExpand = () => {
        setExpand(!expand);
    };

    const handleLogout = async () => {
        try {
            await axiosPrivate.get(url, {
                withCredentials: true
            });
            auth.accessToken = "";
            setAuth(auth);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={`whitespace-nowrap flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 shadow-lg ${expand ? "w-64" : "w-16 flex-none"} transition-all duration-300 ease-in-out`}>
            {/* Profile and Expand Button */}
            <div className="flex flex-col h-48 px-4 select-none">
                <img src={expand ? menucollapse : menu} alt="menu" className="h-8 w-8 self-end cursor-pointer p-2 mt-4 transition-transform transform hover:scale-105" onClick={handleExpand} title={`${expand ? "Collapse Navbar" : "Expand Navbar"}`} />
                <div className="flex flex-row items-center mt-4">
                    <img src={profile} alt="profile" className={`rounded-full w-10 h-10 ${expand ? "mr-4" : ""} transition-all duration-300`} />
                    <p className={`text-white font-semibold tracking-wide uppercase truncate ${expand ? "block" : "hidden"} transition-all duration-300`}>{auth.user}</p>
                </div>
                <hr className="border-t border-gray-600 my-4" />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col h-full">
                <NavLink to="home" className={({ isActive }) => isActive ? "bg-blue-600 py-2 flex flex-row items-center" : "hover:bg-gray-600 py-2 flex flex-row items-center transition-colors duration-300"}>
                    <img src={home} alt="home" className="h-6 w-6 ml-4 mr-3" />
                    <p className={`text-white font-medium tracking-wide ${expand ? "block" : "hidden"} transition-all duration-300`}>Home</p>
                </NavLink>

                <NavLink to="manage-room" className={({ isActive }) => isActive ? "bg-blue-600 py-2 flex flex-row items-center" : "hover:bg-gray-600 py-2 flex flex-row items-center transition-colors duration-300"}>
                    <img src={room} alt="manage room" className="h-6 w-6 ml-4 mr-3" />
                    <p className={`text-white font-medium tracking-wide ${expand ? "block" : "hidden"} transition-all duration-300`}>Manage Rooms</p>
                </NavLink>

                <NavLink to="university-exam" className={({ isActive }) => isActive ? "bg-blue-600 py-2 flex flex-row items-center" : "hover:bg-gray-600 py-2 flex flex-row items-center transition-colors duration-300"}>
                    <img src={exam} alt="university exam" className="h-6 w-6 ml-4 mr-3" />
                    <p className={`text-white font-medium tracking-wide ${expand ? "block" : "hidden"} transition-all duration-300`}>Seat Allocation</p>
                </NavLink>

                {/* Spacer to push logout to the bottom */}
                <div className="flex-grow"></div>

                <NavLink to="/" onClick={handleLogout} className="hover:bg-red-600 py-2 flex flex-row items-center transition-colors duration-300">
                    <img src={logout} alt="log out" className="h-6 w-6 ml-4 mr-3" />
                    <p className={`text-white font-medium tracking-wide ${expand ? "block" : "hidden"} transition-all duration-300`}>Log Out</p>
                </NavLink>
            </div>
        </div>
    );
}
