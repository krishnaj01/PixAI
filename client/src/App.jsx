import React, { useContext } from 'react'

import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import LoginContext from './contexts/LoginContext/LoginContext.js'
import AppContext from './contexts/AppContext/AppContext.js';
import UserContext from './contexts/UserContext/UserContext.js';

import HomePage from './pages/HomePage.jsx'
import PlaygroundPage from './pages/PlaygroundPage.jsx'
import BuyCreditsPage from './pages/BuyCreditsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CommunityPostsPage from './pages/CommunityPostsPage.jsx'
import Navbar from './components/custom/Navbar.jsx'
import Footer from './components/custom/Footer.jsx'
import LoginAndRegister from './components/custom/LoginAndRegister.jsx'
import ImageModal from './components/custom/ImageModal.jsx';
import VerifyEmail from './components/custom/VerifyEmail.jsx';
import ForgotPassword from './components/custom/ForgotPassword.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => {

    const { showLogin, showVerifyEmail, showForgotPassword } = useContext(LoginContext);
    const { user } = useContext(UserContext);
    const { showImage } = useContext(AppContext);

    return (
        <section className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
            <ToastContainer position='bottom-right' theme='dark' autoClose={3000} />
            <Navbar />

            {showLogin && <LoginAndRegister />}
            {showForgotPassword && <ForgotPassword />}
            {showVerifyEmail && <VerifyEmail />}
            {showImage && <ImageModal />}

            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/plans' element={<BuyCreditsPage />} />
                <Route path='/community' element={<CommunityPostsPage />} />

                {user && <Route path='/playground' element={<PlaygroundPage />} />}
                {user && <Route path='/dashboard' element={<DashboardPage />} />}

                {!user && <Route path='/reset-password/:resetToken' element={<ResetPasswordPage />} />}

                <Route path='*' element={<NotFoundPage />} />

            </Routes>

            <Footer />
        </section>
    )
}

export default App