import React, { useContext } from 'react'

import { motion } from "motion/react"

import { assets } from '../../assets/assets.js'
import LoginContext from '../../contexts/LoginContext/LoginContext.js'
import AppContext from '../../contexts/AppContext/AppContext.js'
import UserContext from '../../contexts/UserContext/UserContext.js'

const GenerateBtn = () => {

  const { user } = useContext(UserContext);
  const { setShowLogin } = useContext(LoginContext)
  const { navigate } = useContext(AppContext);

  const onClickHandler = () => {
    if (user) {
      navigate('/playground');
    } else {
      setShowLogin(true);
    }
  }

  return (
    <motion.button onClick={onClickHandler} className='sm:text-large text-white bg-black w-auto px-12 py-3 inline-flex items-center gap-2 rounded-full hover:bg-zinc-700'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ default: { duration: 0.3 }, opacity: { delay: 0.8, duration: 1 } }}
    >
      Generate Images
      <img className='h-6' src={assets.star_group} alt="star-group" />
    </motion.button>
  )
}

export default GenerateBtn