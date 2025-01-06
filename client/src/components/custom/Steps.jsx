import React from 'react'

import { motion } from "motion/react"

import { stepsData } from '../../assets/assets.js'

const Steps = () => {

  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='flex flex-col items-center justify-center my-32'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>How it works?</h1>
      <p className='text-lg text-gray-600 mb-8'>Transform Ideas Into Stunning Visuals</p>

      <div className='space-y-4 w-full max-w-3xl text-base'>
        {stepsData.map((item, idx) => (
          <div key={`step-${idx}`} className='flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md border cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg'>
            <img src={item.icon} alt='step-image' />
            <div>
              <h2 className='text-xl font-medium'>{item.title}</h2>
              <p className='text-gray-500'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default Steps