import React, { useEffect } from 'react'
import Navbar from '../components/indexpage/Navbar'
import ProgramDetails from '../components/indexpage/ProgramDetails'
import Footer from '../components/indexpage/Footer'

const ProgramsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#0B1426]">
            <Navbar />
            <div className="pt-16">
                <ProgramDetails />
            </div>
            <Footer />
        </div>
    )
}

export default ProgramsPage
