import { useContext, useEffect } from 'react'

import "./Navbar.css"

import { motion } from "motion/react"
import { Link, NavLink } from 'react-router-dom'

import { GiHamburgerMenu } from "react-icons/gi";

import UserContext from '../../contexts/UserContext/UserContext.js'
import LoginContext from '../../contexts/LoginContext/LoginContext.js'
import AppContext from '../../contexts/AppContext/AppContext.js'
import { assets } from '../../assets/assets.js'

const Navbar = () => {

    const { user } = useContext(UserContext);
    const { setShowLogin } = useContext(LoginContext);
    const { logout, credit, viewportWidth } = useContext(AppContext);


    useEffect(() => {
        if (user && viewportWidth >= 720) {
            const divSvgContainer = document.getElementById('profile-picture-navbar');
            divSvgContainer.innerHTML = user.profilePicture;
        }
    }, [user]);


    const logoutClick = async () => {
        await logout();
    }

    return (
        <>
            {viewportWidth >= 720 &&
                <nav className='flex items-center justify-between py-4'>
                    <Link to='/' className='hover:scale-105 transition-all duration-200'>
                        <img src={assets.logo} alt="" className='w-48 sm:w-52 lg:w-60' />
                    </Link>

                    <div className={`font-medium ${user ? 'user-mid-navbar' : 'not-user-mid-navbar'}`}>
                        <div className='flex items-center ml-[-4.5rem] customScreen:ml-0 gap-1 customScreen:gap-5 text-lg'>
                            <NavLink to='/community' className={(e) => { return e.isActive ? "nav-link active" : "nav-link" }} >Community</NavLink>
                            {
                                user ?
                                    <NavLink to='/playground' className={(e) => { return e.isActive ? "nav-link active" : "nav-link" }}>Playground</NavLink>
                                    :
                                    <NavLink to='/plans' className={(e) => { return e.isActive ? "nav-link active" : "nav-link" }}>Pricing</NavLink>
                            }
                        </div>
                    </div>

                    <div>
                        {
                            user ?
                                <div className='flex items-center gap-2 customScreen:gap-5 text-lg'>
                                    <NavLink to='/plans' className={(e) => {
                                        return e.isActive ? "flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 border-solid border-2 border-blue-400"
                                            : "flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full border-solid border-2 border-transparent hover:scale-105 transition-all duration-300"
                                    }}>
                                        <img src={assets.credit_star} alt="credit-star" className='w-5' />
                                        <p className='text-sm sm:text-base font-medium text-gray-600'>Credits : {credit}</p>
                                    </NavLink>
                                    <div className='relative flex items-center gap-3 group cursor-pointer hover:font-medium hover:scale-[1.02] transition-all duration-200'>
                                        <p className='text-gray-600 max-[1200px]:hidden pl-4'>
                                            Hi, {user.name.substr(0, 12)}{user.name.length > 12 && '...'}
                                        </p>
                                        {/* below div is for the profile image coming in the form of svg */}
                                        <div className='w-12 drop-shadow border-[0.1rem] border-zinc-900 rounded-full' id='profile-picture-navbar'></div>
                                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-base'>
                                                <NavLink to='/profile'>
                                                    <li className='py-1 px-2 mb-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Profile</li>
                                                </NavLink>
                                                <hr />
                                                <li onClick={logoutClick} className='py-1 px-2 mt-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Logout</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='flex items-center gap-2 sm:gap-5 text-lg'>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white py-1.5 sm:py-2 px-5 sm:px-7 rounded-full text-base hover:bg-zinc-700 transition-all duration-200'>
                                        Get Started
                                    </motion.button>
                                </div>
                        }
                    </div>
                </nav>
            }
            {viewportWidth < 720 &&
                <nav className='flex items-center justify-between py-4'>
                    <Link to='/' className='hover:scale-105 transition-all duration-200'>
                        <img src={assets.logo} alt="" className='w-48 sm:w-52 lg:w-60' />
                    </Link>

                    <div>
                        {
                            user ?
                                <div className='flex items-center gap-2 sm:gap-5 text-lg'>
                                    <NavLink to='/plans' className={(e) => {
                                        return e.isActive ? "flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 border-solid border-2 border-blue-400"
                                            : "flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full border-solid border-2 border-transparent hover:scale-105 transition-all duration-300"
                                    }}>
                                        <img src={assets.credit_star} alt="credit-star" className='w-5' />
                                        <p className='text-sm sm:text-base font-medium text-gray-600'>{credit}</p>
                                    </NavLink>
                                    <div className='relative flex items-center gap-3 group cursor-pointer'>
                                        <GiHamburgerMenu size={30} />
                                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-base'>
                                                <NavLink to='/profile'>
                                                    <li className='py-1 px-2 mb-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Profile</li>
                                                </NavLink>
                                                <hr />
                                                <NavLink to='/playground'>
                                                    <li className='py-1 px-2 my-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Playground</li>
                                                </NavLink>
                                                <hr />
                                                <NavLink to='/community'>
                                                    <li className='py-1 px-2 my-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Community</li>
                                                </NavLink>
                                                <hr />
                                                <li onClick={logoutClick} className='py-1 px-2 mt-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Logout</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='flex items-center gap-2 sm:gap-5 text-lg'>
                                    <div className='relative flex items-center gap-3 group cursor-pointer'>
                                        <GiHamburgerMenu size={30} />
                                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-base'>
                                                <NavLink to='/community'>
                                                    <li className='py-1 px-2 mb-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Community</li>
                                                </NavLink>
                                                <hr />
                                                <NavLink to='/plans'>
                                                    <li className='py-1 px-2 my-1 cursor-pointer pr-10 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Pricing</li>
                                                </NavLink>
                                                <hr />
                                                <li onClick={() => setShowLogin(true)} className='py-1 px-2 mt-1 cursor-pointer pr-8 rounded-md hover:bg-gray-100 hover:scale-[1.02] transition-all duration-100'>Get Started</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </nav>
            }
        </>
    )
}

export default Navbar