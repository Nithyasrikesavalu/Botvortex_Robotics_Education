import React from 'react'

import Hero from '../components/indexpage/Hero'
import Features from '../components/indexpage/Features'
import AdvertisementSection from '../components/indexpage/AdvertisementSection'
import Roadmap from '../components/indexpage/Roadmap'
import Reviews from '../components/indexpage/Reviews'
import Courses from '../components/indexpage/Courses'
import CTA from '../components/indexpage/CTA'
import Footer from '../components/indexpage/Footer'
import Navbar from '../components/indexpage/Navbar'






const Indexpage = () => {
  return (
    <>
   <Navbar />
   <Hero />
   <Features />
   <AdvertisementSection />
   <Roadmap />
   <Courses />
   <Reviews />
   <CTA />
   <Footer />
  
    </>
  )
}

export default Indexpage;