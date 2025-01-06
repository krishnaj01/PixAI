import React, { useEffect } from 'react'

import { motion } from "motion/react"
import { NavLink } from 'react-router-dom';

import { FaArrowLeft } from "react-icons/fa6";

import { assets } from '../assets/assets.js'

const NotFoundPage = () => {
    return (
        <motion.section
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center pt-10 mb-10'>
            <div className='flex flex-col items-center justify-center'>
                <img src={assets.image404} alt="404-page-not-found" className='w-80' />
                <NavLink to='/'>
                    <div className='flex items-center justify-center text-sm gap-1 text-blue-600 mt-4 cursor-pointer hover:underline ml-1 mb-5'>
                        <FaArrowLeft />
                        <p>Back to Home</p>
                    </div>
                </NavLink>
                <p className='text-sm text-neutral-500'>If you are trying to access the profile page or the playground page, please login first!</p>
            </div>

        </motion.section>
    )
}

export default NotFoundPage