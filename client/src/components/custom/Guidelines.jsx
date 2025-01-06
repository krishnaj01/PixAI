import React from 'react'

import { motion } from "motion/react"

import Accordion from '../ui/Accordion'

const Guidelines = () => {
    return (
        <motion.section
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-col items-center justify-center my-28'>

            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Guidelines</h1>
            <p className='text-lg text-gray-600 mb-8'>Follow our guidelines to ensure a safe and creative space</p>
            <Accordion />
        </motion.section>
    )
}

export default Guidelines