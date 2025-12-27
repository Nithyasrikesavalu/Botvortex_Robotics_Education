import React, { useEffect } from 'react'
import MycoursesNavbar from '../components/CourseModule/MycoursesNavbar'
import MycoursesFooter from '../components/CourseModule/MycoursesFooter'
import MyCourseHero from '../components/CourseModule/MyCourseHero'
import CurriculumSection from '../components/CourseModule/CurriculumSection'

const CoursesModule = () => {
  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);
  return (
   <>
   <MycoursesNavbar/>
   <MyCourseHero/>
   <CurriculumSection/>
   <MycoursesFooter/>
   </>
  )
}

export default CoursesModule;