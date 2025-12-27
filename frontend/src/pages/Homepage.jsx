import React from 'react'
import Banner from '../components/homepage/Hero'
import AboutSection from '../components/homepage/AboutSection'
import CoursesSection from '../components/homepage/CoursesSection'
import HomeNavbar from '../components/homepage/Navbar'
import Footer2 from '../components/homepage/Footer'
import CertificateShowcase from '../components/homepage/CourseCompletionCertificate'
// import IntroductionToRobotics from '../components/Courses/IntroductionToRobotics.JSX'

const Homepage = () => {
  return (
    <>
    <HomeNavbar/>
    <Banner/>
    <AboutSection/>
    <CoursesSection/>
    <CertificateShowcase/>
    <Footer2/>
    {/* <IntroductionToRobotics/> */}
    </>
  )
}

export default Homepage;