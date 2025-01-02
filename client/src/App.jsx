import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage.jsx'
import PlaygroundPage from './pages/PlaygroundPage.jsx'
import BuyCreditsPage from './pages/BuyCreditsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CommunityPostsPage from './pages/CommunityPostsPage.jsx'
import Navbar from './components/custom/Navbar.jsx'
import Footer from './components/custom/Footer.jsx'
import LoginAndRegister from './components/custom/LoginAndRegister.jsx'
import LoginContext from './contexts/LoginContext/LoginContext.js'
import AppContext from './contexts/AppContext/AppContext.js';
import ImageModal from './components/custom/ImageModal.jsx';
import UserContext from './contexts/UserContext/UserContext.js';

const App = () => {

    const { showLogin } = useContext(LoginContext);
    const { showImage } = useContext(AppContext);
    const {user} = useContext(UserContext);

    return (
        <section className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
            <ToastContainer position='bottom-right' theme='dark' autoClose={3000} />
            <Navbar />
            {showLogin && <LoginAndRegister />}
            {showImage && <ImageModal />}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/playground' element={<PlaygroundPage />} />
                <Route path='/plans' element={<BuyCreditsPage />} />
                {user && <Route path='/profile' element={<ProfilePage />} />}
                <Route path='/community' element={<CommunityPostsPage />} />
            </Routes>
            <Footer />
        </section>
    )
}

export default App