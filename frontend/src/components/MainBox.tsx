import axios from "axios"
import {  useRef } from "react"

const MainBox = () => {
    const inputRef = useRef<HTMLInputElement >(null)

    const handleDownload=async()=>{
      
        if(!inputRef.current?.value){
        return alert("Enter the google meet link")
        }
        await axios.post("http://localhost:3000/link",{
            googleMeetUrl:inputRef.current.value,
            status:"start"
        })
        inputRef.current.value = ""
    }
    const stopDownload=async()=>{
        await axios.get("http://localhost:3000/stop")
    }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center ">
        <div className="flex flex-col h-72 bg-white w-3xl justify-center items-center">
        <input ref={inputRef} className="outline-none bg-blue-200 w-2xs px-3 py-1 text-gray-700 placeholder:text-gray-700" type="text" placeholder="Enter google meet link to record" />
        <button onClick={handleDownload} className="bg-blue-700 text-white px-4 py-1 text-xl rounded-sm my-4 cursor-pointer">Record</button>
        <button onClick={stopDownload} className="bg-blue-700 text-white px-4 py-1 text-xl rounded-sm my-4 cursor-pointer">Remove</button>
        </div>
    </div>
  )
}

export default MainBox