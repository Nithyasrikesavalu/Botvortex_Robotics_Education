import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Register from './components/login/Register';
import SignIn from './components/login/SignIn';
import Indexpage from './pages/Indexpage';
import ContactPage from './components/indexpage/Contact';
import AboutSection from './components/homepage/AboutSection';
import AllCourses from './components/Courses/AllCourses';
import CourseC1 from './components/Courses/CourseC1';
import Syllabus from './components/Courses/SyllabusModal';
import StudentProfile from './components/StudentProfile/StudentProfile';
import BotVortexMyCourses from './components/StudentProfile/BotVortexMyCourses';
import SettingsPage from './components/StudentProfile/SettingsPage';
import CoursesModule from './pages/CoursesModule';
import PaymentPage from './components/indexpage/PaymentPage ';
import InstructorDashboard from './components/instructor dashboard/InstructorDashboard';
import CreateCourse from './components/instructor dashboard/CreateCourse';
import Enrollment from './components/Courses/Enrollment';
import About from './components/indexpage/About';
import ProgramDetails from './components/indexpage/ProgramDetails';

import ScrollToTop from './components/ScrollToTop';



const App = () => (<>
  <ScrollToTop />
  <Routes>
    {/* {Homepage} */}
    <Route path="/" element={<Homepage />} />
    <Route path='/login' element={<Register />} />
    <Route path='/signup' element={<SignIn />} />
    <Route path='/About' element={<AboutSection />} />
    {/* {Index page} */}
    <Route path='/index' element={<Indexpage />} />
    <Route path='/contact' element={<ContactPage />} />
    <Route path='/Ab' element={<About />} />
    <Route path='/Courses' element={<AllCourses />} />
    <Route path='/programs' element={<ProgramDetails />} />
    <Route path="/buy-coins" element={<PaymentPage />} />
    {/* {All Courses}/ */}
    <Route path='/C' element={<CourseC1 />} />
    <Route path="/syllabus" element={<Syllabus />} />
    <Route path='/enroll' element={<Enrollment />} />
    <Route path="/CoursesModule" element={<CoursesModule />} />

    {/* profile page */}
    <Route path="/profile" element={<StudentProfile />} />
    <Route path="/my-courses" element={<BotVortexMyCourses />} />
    <Route path="/settings" element={<SettingsPage />} />
    {/* instructor-dashboard */}
    <Route path='/instructor-dashboard' element={<InstructorDashboard />} />
    <Route path="/create-course" element={<CreateCourse />} />
  </Routes>
</>

);
export default App