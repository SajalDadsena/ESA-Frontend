import { useState } from 'react';
import React from 'react';
import muthoot from '../assets/muthoot.png';
import college from '../assets/college.png';
import addroom from '../assets/addroom.png';
import calendar from '../assets/calendar.png';
import allocate from '../assets/allocate.png';

function Home() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    const isReqWidth = (windowWidth <= 1000);
    return (

        
        
        
    <div className="flex flex-col bg-background flex-grow md:w-5/6">
        

        <div className="flex-auto flex  bg-gray-300 rounded-lg shadow-md">
        <div className={`bg-background flex-none flex items-center py-3 ${isReqWidth ? "px-3" : "px-16"} rounded-l-lg`}>
            <img 
                src={college} 
                className={`transition-all duration-300 ${isReqWidth ? "h-0 opacity-0" : "h-36 opacity-100"}`} 
                alt="College Image" 
            />
        </div>
        
        <div className="flex-1 flex items-center px-8 py-7 bg-white drop-shadow-lg rounded-br-3xl rounded-bl-lg">
            <p className="font-Outfit-ExtraBold text-5xl text-gray-800 tracking-wide leading-snug drop-shadow-md">
                  EXAMINATION SEAT ALLOCATOR
            </p>
        </div>
    </div>
    

    <div className="bg-background p-14 pl-16 rounded-lg shadow-lg">
    <h2 className="font-Outfit-Bold text-3xl text-gray-800 text-center mb-4">
        Efficient Exam Management
    </h2>
    <p className="font-Outfit-Medium text-xl text-gray-600 text-center">
        Maximize Efficiency, Minimize Stress
    </p>
</div>



<div className={`bg-background pt-10 pb-24 rounded-lg shadow-lg ${isReqWidth ? "px-14" : "px-36"}`}>
<h2 className="font-Outfit-Bold text-3xl text-gray-800 text-center mb-8">
    Features
</h2>
<div className="flex flex-row justify-between space-x-4">
    {/* Card 1 */}
    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105">
        <img src={addroom} className="h-24 mx-auto mb-4" alt="Manage Rooms" />
        <h3 className="font-Outfit-Bold text-xl text-gray-800 mb-2">Manage Rooms</h3>
        <p className="text-gray-600">
            Add or remove exam halls and the number of available seats easily.
        </p>
    </div>

    {/* Card 2 */}
    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105">
        <img src={calendar} className="h-24 mx-auto mb-4" alt="University Exams" />
        <h3 className="font-Outfit-Bold text-xl text-gray-800 mb-2">University Exams</h3>
        <p className="text-gray-600">
            Update or view upcoming exam details efficiently.
        </p>
    </div>

    {/* Card 3 */}
    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105">
        <img src={allocate} className="h-24 mx-auto mb-4" alt="Seat Allocation" />
        <h3 className="font-Outfit-Bold text-xl text-gray-800 mb-2">Seat Allocation</h3>
        <p className="text-gray-600">
            Generate Excel sheets with exam halls and participants' details.
        </p>
    </div>
</div>
</div>

        </div>
    );
}

export default Home;
