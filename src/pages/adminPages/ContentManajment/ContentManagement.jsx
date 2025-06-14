import React from 'react'
import ViewAllInterviews from './ViewAllInterviews'
import { useNavigate } from 'react-router-dom'

const ContentManagement = () => {
  const navigate=useNavigate()
  return (
    <div>
    <div className="block md:flex lg:flex items-center justify-between px-4 py-6 bg-white rounded-md shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Content & Interview Management</h2>
        <p className="text-sm text-gray-500">
          Manage all interviews, job roles and educational resources here.
        </p>
      </div>

      <button
        onClick={() => navigate("addInterviewAndQuestionBank")}
        className="bg-[#37B874] hover:bg-[#2e9b64] text-white text-sm font-semibold py-2 px-4 rounded flex items-center gap-2 mt-4 md:mt-0 lg:mt-0"
      >
        Add Interview
        <span className="text-xl leading-none">+</span>
      </button>
    </div>


    
     <ViewAllInterviews/>
    </div>
  )
}

export default ContentManagement
