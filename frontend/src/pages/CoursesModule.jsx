import React, { useEffect } from 'react'
import MycoursesNavbar from '../components/CourseModule/MycoursesNavbar'
import MycoursesFooter from '../components/CourseModule/MycoursesFooter'
import MyCourseHero from '../components/CourseModule/MyCourseHero'
import CurriculumSection from '../components/CourseModule/CurriculumSection'

import { useLocation } from 'react-router-dom';

const CoursesModule = () => {
  const location = useLocation();
  const selectedCourse = location.state?.course || null;

  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);
  return (
   <>
   <MycoursesNavbar/>
   <MyCourseHero course={selectedCourse} />
   <CurriculumSection course={selectedCourse} />
   <MycoursesFooter/>
   </>
  )
}

export default CoursesModule;