import React from 'react'
import { assets } from '../../assets/assets.js'
import GenerateBtn from './GenerateBtn.jsx'
import { motion } from "motion/react"

const Header = () => {
    return (
        <motion.section className='flex flex-col justify-center items-center text-center mb-20'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <p>Best text to image generator</p>
                <img src={assets.star_icon} alt="star-image" />
            </motion.div>

            <motion.h1 className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 2 }}
            >
                Your imagination, <span className='font-medium'><span className='text-[#b0296e]'>PixAI's</span> <span className='text-[#266bb6]'>creation.</span></span>
            </motion.h1>

            <motion.p className='text-center max-w-xl mx-auto mt-5 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                PixAI transforms your ideas into stunning visuals with the power of AI. Unleash your creativity and explore a future where imagination meets innovation.
            </motion.p>

            <GenerateBtn />

            <motion.div className='flex flex-wrap justify-center mt-16 gap-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                {Array(6).fill('').map((item, idx) => {
                    return (
                        <motion.img whileHover={{ scale: 1.05, duration: 0.1 }} key={idx} src={idx % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} alt="img-1" className='rounded cursor-pointer max-sm:w-24' width={90} />
                    )
                })}
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className='mt-4 text-neutral-600'>
                Generated images from PixAI
            </motion.p>
        </motion.section>
    )
}

export default Header