import React, { useContext, useEffect } from 'react'
import Header from '../components/custom/Header'
import Steps from '../components/custom/Steps'
import HomeDescription from '../components/custom/HomeDescription'
import FinalHomeSection from '../components/custom/FinalHomeSection'
import Testimonials from '../components/custom/Testimonials'
import AppContext from '../contexts/AppContext/AppContext'


const HomePage = () => {

  const { resetImageData } = useContext(AppContext);

  useEffect(() => {
    resetImageData();
  }, [])

  return (
    <main className='mt-16'>
      <Header />
      <Steps />
      <HomeDescription />
      <Testimonials />
      <FinalHomeSection />
    </main>
  )
}

export default HomePage