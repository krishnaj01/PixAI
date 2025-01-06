import React, { useContext, useEffect } from 'react'

import AppContext from '../contexts/AppContext/AppContext.js'

import Header from '../components/custom/Header'
import Steps from '../components/custom/Steps'
import HomeDescription from '../components/custom/HomeDescription'
import Guidelines from '../components/custom/Guidelines'
import FinalHomeSection from '../components/custom/FinalHomeSection'


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
      <Guidelines />
      <FinalHomeSection />
    </main>
  )
}

export default HomePage