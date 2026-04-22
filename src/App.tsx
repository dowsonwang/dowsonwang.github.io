import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabLayout from "@/components/TabLayout";
import AudioCall from "@/pages/AudioCall";
import Chat from "@/pages/Chat";
import Chats from "@/pages/Chats";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Me from "@/pages/Me";
import MeAbout from "@/pages/MeAbout";
import MeFeedback from "@/pages/MeFeedback";
import MeHelp from "@/pages/MeHelp";
import MePrivacy from "@/pages/MePrivacy";
import MeTerms from "@/pages/MeTerms";
import Placeholder from "@/pages/Placeholder";
import MiniDict from "@/pages/MiniDict";
import ToolDetail from "@/pages/ToolDetail";
import Teachers from "@/pages/Teachers";
import Tools from "@/pages/Tools";
import Vocab from "@/pages/Vocab";
import VocabComplete from "@/pages/VocabComplete";
import VocabStudy from "@/pages/VocabStudy";
import VideoCourse from "@/pages/VideoCourse";
import VideoCall from "@/pages/VideoCall";
import VideoCourses from "@/pages/VideoCourses";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<TabLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/videos" element={<VideoCourses />} />
          <Route path="/me" element={<Me />} />
        </Route>
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/new" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me/about" element={<MeAbout />} />
        <Route path="/me/feedback" element={<MeFeedback />} />
        <Route path="/me/help" element={<MeHelp />} />
        <Route path="/me/privacy" element={<MePrivacy />} />
        <Route path="/me/terms" element={<MeTerms />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tool/mini-dict" element={<MiniDict />} />
        <Route path="/tool/:toolId" element={<ToolDetail />} />
        <Route path="/video/:courseId" element={<VideoCourse />} />
        <Route path="/vocab/study" element={<VocabStudy />} />
        <Route path="/vocab/complete" element={<VocabComplete />} />
        <Route path="/call/audio" element={<AudioCall />} />
        <Route path="/call/video" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}
