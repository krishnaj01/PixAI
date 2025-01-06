import React from 'react'
import { motion } from "motion/react"

import GenerateBtn from './GenerateBtn'

const FinalHomeSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='pb-16 text-center'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>Experience the magic. Try it now!</h1>
      <GenerateBtn />
    </motion.section>
  )
}

export default FinalHomeSection