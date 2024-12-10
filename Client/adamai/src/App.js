import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from './Navbar';
import Home from './Home';
import Login from './login_components/Login';
import Signup from './login_components/Signup';
import Subscribe from './chatbot_components/subscribe';
import CreateChatbot from './chatbot_components/createChatbot';
import UploadPDF from './pdf_components/uploadPdf';
import Dashboard from './chatbot_components/dashboard';
import ChatBox from './chatbot_components/chatBox';
import Project from './db_components/Project';
import User from './db_components/User';
import ViewPdfs from "./pdf_components/viewPdfs";
import EditProject from "./editComponents/editProject"
import ViewedPdf from './pdf_components/viewedPdf';
import EditPdf from './pdf_components/editPdf';

function App() {
  return (
    <>
    <Navbar/>
    <div className="container">
      
      <Routes>
        {/*Home page component */}
        <Route path="/" element ={<Home/>}/>
        {/*Login page components */}
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/user/:usrid" element={<User/>}/>
        {/*Project creation/customization components */}
        <Route path="/UploadPdf" element={<UploadPDF/>}/>
        <Route path="/Subscribe" element={<Subscribe/>}/>
        <Route path="/CreateChatbot" element={<CreateChatbot/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/project/:projId" element={<Project/>}/>
        <Route path="/project/editProject/:projId" element={<EditProject/>}/>
        <Route path="/chatbot/:projId" element={<ChatBox/>}/>
        <Route path="/viewedPdf/:id" element={<ViewedPdf />} />
        <Route path="/editPdf/:id" element={<EditPdf />} />
        <Route path="/viewPdfs" element={<ViewPdfs />} />
        
      </Routes>
      
    </div>
    </>
  );
}

export default App;
