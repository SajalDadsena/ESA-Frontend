import DropDownInput from './DropDownInput';
import { useState, useRef, useEffect, useMemo } from 'react';
import Input from './Input';
import { ThreeCircles } from 'react-loader-spinner';
import UeRow from './UeRow';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const url = '/university-exam';

export default function UniversityExam() {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [toggle, setToggle] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [fileData, setFileData] = useState(null);
    const [dataUploaded, setDataUploaded] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null); // Define state for selected room
    const navigate = useNavigate();

    const handleToggle = () => {
        setToggle(!toggle);
    };

    const sortedExams = useMemo(() => {
        let list = exams.sort((a, b) => a.date.split("/").join("") - b.date.split("/").join(""));
        if (list.length > 0 && toggle)
            list = list.sort((a, b) => a.branch < b.branch ? -1 : a.branch > b.branch ? 1 : 0);
        return list;
    }, [toggle, exams]);

    const handleFiles = () => {
        setLoading(true);
        const controller = new AbortController();

        const sendFiles = async () => {
            const myFiles = document.getElementById('myFiles').files;

            const formData = new FormData();
            Object.keys(myFiles).forEach(key => {
                formData.append(myFiles.item(key).name, myFiles.item(key));
            });

            try {
                const response = await axiosPrivate.post(url.concat("/file-upload"), formData, {
                    signal: controller.signal,
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setLoading(false);
                alert(response.data.message + " excel file successfully uploaded");
                setDataUploaded(true);
            } catch (error) {
                alert("Excel file upload unsuccessful");
                console.log(error);
            }
        };

        sendFiles();
        return () => {
            controller.abort();
        };
    };

    const fetchExcelFile = async () => {
        try {
            const response = await axiosPrivate.get(url.concat("/get-file"), {
                responseType: 'arraybuffer',
            });
            
            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setFileData(jsonData);
        } catch (error) {
            console.log("Error fetching the Excel file:", error);
        }
    };

    useEffect(() => {
        fetchExcelFile();
        getRooms();
    }, []);

    const getRooms = async () => {
        try {
            const response = await axiosPrivate.get('/manage-room', {});
            setRooms(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const groupStudentsBySemester = (data) => {
        const studentsBySemester = { 1: [], 2: [], 3: [] };

        data.slice(1).forEach((row) => {
            const semester = row[2];
            if (semester && studentsBySemester[semester]) {
                studentsBySemester[semester].push(row);
            }
        });

        return studentsBySemester;
    };

    const alternateStudents = (studentsBySemester) => {
        const alternatingStudents = [];
        let maxLength = Math.max(studentsBySemester[1].length, studentsBySemester[2].length, studentsBySemester[3].length);

        for (let i = 0; i < maxLength; i++) {
            if (studentsBySemester[1][i]) alternatingStudents.push(studentsBySemester[1][i]);
            if (studentsBySemester[2][i]) alternatingStudents.push(studentsBySemester[2][i]);
            if (studentsBySemester[3][i]) alternatingStudents.push(studentsBySemester[3][i]);
        }

        return alternatingStudents;
    };

    const assignStudentsToRooms = (students) => {
        const assignedRooms = [];
        let studentIndex = 0;

        rooms.forEach(room => {
            const roomCapacity = room.capacity;
            const roomStudents = students.slice(studentIndex, studentIndex + roomCapacity);
            assignedRooms.push({ room_no: room.room_no, students: roomStudents });
            studentIndex += roomCapacity;
        });

        return assignedRooms;
    };

    const renderTable = (data) => (
        <table className="table-auto border-collapse w-full shadow-lg rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Roll</th>
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Sem</th>
                </tr>
            </thead>
            <tbody>
                {data.slice(1).map((row, rowIndex) => ( // Skip the first row
                    <tr
                        key={rowIndex}
                        className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-300`}
                    >
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-3 px-4 text-sm text-gray-800 border-t border-gray-200">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
    

    const renderTable2 = (data) => (
        <table className="table-auto border-collapse w-full shadow-lg rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Roll</th>
                    <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Sem</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-300`}
                    >
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-3 px-4 text-sm text-gray-800 border-t border-gray-200">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );


    const downloadExcelFile = () => {
        const studentsBySemester = groupStudentsBySemester(fileData);
        const alternatingStudents = alternateStudents(studentsBySemester);
        const assignedRooms = assignStudentsToRooms(alternatingStudents);

        const workbook = XLSX.utils.book_new();
        assignedRooms.forEach((room, index) => {
            const ws = XLSX.utils.json_to_sheet(room.students.map((student) => ({
                Name: student[0],
                Roll: student[1],
                Sem: student[2]
            })));
            XLSX.utils.book_append_sheet(workbook, ws, `Room ${room.room_no}`);
        });

        XLSX.writeFile(workbook, 'Assigned_Students.xlsx');
    };

    const handleRoomChange = (event) => {
        setSelectedRoom(event.target.value);  // Set selected room
    };

    useEffect(() => {
        if (rooms.length > 0 && !selectedRoom) {
            setSelectedRoom(rooms[0].room_no);  // Default to the first room if not already set
        }
    }, [rooms]);  // Ensure this runs when the rooms data changes
    

    return (
        <div className="bg-gray-100 flex flex-col flex-grow md:w-5/6 px-6 py-8">
    <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">STUDENT DETAILS</h2>
        <div className="flex space-x-4">
            <input type="file" id="myFiles" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple className="text-sm text-gray-700 bg-white p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500" />
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold h-10 w-[10rem] rounded-md transition-all duration-200 ease-in-out shadow-md hover:shadow-lg" onClick={handleFiles}>UPLOAD FILE</button>
            {dataUploaded && (
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold h-10 w-[10rem] rounded-md transition-all duration-200 ease-in-out shadow-md hover:shadow-lg" onClick={downloadExcelFile}>DOWNLOAD FILE</button>
            )}
        </div>
    </div>

    <div className="mt-8">
        {dataUploaded ? (
            <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg bg-white shadow-lg my-4">
                <div className="sticky top-0 z-10 bg-white shadow-md py-4 px-6">
                    <h3 className="text-xl font-semibold">STUDENTS</h3>
                </div>
                {renderTable(fileData)}
            </div>
        ) : (
            <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg bg-white shadow-lg my-4">
                <table className="table-auto border-collapse w-full shadow-lg rounded-lg overflow-hidden">
                    <thead className="sticky top-0 bg-gray-200 shadow-md">
                        <tr className="text-left">
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Roll</th>
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Sem</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="3" className="py-3 px-4 text-sm text-gray-800 text-center">
                                No data available
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </div>

    <div className="mt-6">
        {/* Dropdown to select room */}
        <div className="flex items-center space-x-4">
            <label htmlFor="roomSelect" className="text-sm text-gray-600">Select Room:</label>
            <select
                id="roomSelect"
                value={selectedRoom || ''}
                onChange={handleRoomChange}
                className="bg-white border border-gray-300 text-sm rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
                {rooms.map((room) => (
                    <option key={room.room_no} value={room.room_no}>
                        Room {room.room_no}
                    </option>
                ))}
            </select>
        </div>
    </div>

    <div className="mt-8">
        {dataUploaded && fileData ? (
            (() => {
                const studentsBySemester = groupStudentsBySemester(fileData);
                const alternatingStudents = alternateStudents(studentsBySemester);
                const assignedRooms = assignStudentsToRooms(alternatingStudents);

                // Filter the assigned rooms based on selectedRoom
                const filteredAssignedRooms = selectedRoom
                    ? assignedRooms.filter(room => room.room_no === selectedRoom)
                    : assignedRooms;

                return filteredAssignedRooms.map((room, index) => (
                    <div key={index} className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg bg-white shadow-lg my-4">
                        <div className="sticky top-0 z-10 bg-white shadow-md py-4 px-6">
                            <h3 className="text-xl font-semibold">Room {room.room_no}</h3>
                        </div>
                        {renderTable2(room.students)}
                    </div>
                ));
            })()
        ) : (
            <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg bg-white shadow-lg my-4">
                <table className="table-auto border-collapse w-full shadow-lg rounded-lg overflow-hidden">
                    <thead className="sticky top-0 bg-gray-200 shadow-md">
                        <tr className="text-left">
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Roll</th>
                            <th className="py-3 px-4 text-sm text-gray-600 uppercase tracking-wider">Sem</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="3" className="py-3 px-4 text-sm text-gray-800 text-center">
                                No data available
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </div>
</div>

    );
}
