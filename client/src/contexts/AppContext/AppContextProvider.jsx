import { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
axios.defaults.withCredentials = true;

import AppContext from "./AppContext.js";
import UserContext from "../UserContext/UserContext.js";
import { assets } from "../../assets/assets.js";


const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const guestLoginEmail = import.meta.env.VITE_GUEST_LOGIN_EMAIL;
    const guestLoginPassword = import.meta.env.VITE_GUEST_LOGIN_PASSWORD;

    const { setUser } = useContext(UserContext);

    const [image, setImage] = useState(assets.sample_img_1);
    const [loading, setLoading] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [checkingPrompt, setCheckingPrompt] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [checkingNSFW, setCheckingNSFW] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(showPassword => !showPassword);
    };

    // const [token, setToken] = useState(null);
    const [credit, setCredit] = useState('');
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const [showImage, setShowImage] = useState(false);
    const [imageDetails, setImageDetails] = useState({});

    const navigate = useNavigate();

    // const getTokenVal = async () => {
    //     try {
    //         const { data } = await axios.get(`${backendUrl}/api/gettoken`);
    //         if (data.tokenValue) {
    //             setToken(data.tokenValue);
    //         } else {
    //             setToken('');
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.message);
    //     }
    // }

    const loadTotalUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/details`)

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const checkAuth = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/checkAuth`);
            if(data.success){
                await loadTotalUserData();
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.message);
        }
    }

    const deleteTokenCookie = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/logout`);
            if (data.success) {
                // setToken('');
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const logout = async () => {
        await deleteTokenCookie();
        setUser(null);
        navigate('/');
    }

    const generateImage = async (prompt, negative_prompt) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/image/generate-image`, { prompt, negative_prompt })

            if (data.success) {
                loadTotalUserData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                loadTotalUserData();
                // if(data.creditBalance){
                if (data.creditBalance <= 0) {
                    navigate('/plans');
                }
                // }
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const checkPrompt = async (prompt, negative_prompt) => {
        try {
            setCheckingPrompt(true);
            const { data } = await axios.post(`${backendUrl}/api/image/check-prompt`, { prompt })
            setCheckingPrompt(false);

            if (data.success) {
                setGenerating(true);
                const image = await generateImage(prompt, negative_prompt);
                if (image) {
                    setCheckingNSFW(true);
                    const nsfwCheck = await axios.post(`${backendUrl}/api/image/check-nsfw`, { image });

                    if (nsfwCheck.data.success) {
                        setIsImageLoaded(true);
                        setImage(image);
                    } else {
                        toast.error(nsfwCheck.data.message);
                    }
                    setCheckingNSFW(false);
                }
                setGenerating(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    const saveImageToCloudinary = async (prompt, negative_prompt, image, shared) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/image/upload-image`, { prompt, negative_prompt, image, shared })

            if (data.success) {
                return data.image;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            if (data.creditBalance <= 0) {
                navigate('/plans');
            }
        }
    }

    const resetImageData = () => {
        setIsImageLoaded(false);
        setImage(assets.sample_img_1);
    }

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // useEffect(() => {
    //     getTokenVal();
    // }, []);

    // useEffect(() => {
    //     if (token) {
    //         loadTotalUserData();
    //     }
    // }, [token])

    useEffect(() => {
        checkAuth();
    }, [])



    const scrollbarProperties = '[&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full'

    const values = { checkPrompt, credit, setCredit, image, setImage, isImageLoaded, setIsImageLoaded, showImage, setShowImage, imageDetails, setImageDetails, backendUrl, guestLoginEmail, guestLoginPassword, loadTotalUserData, logout, generateImage, viewportWidth, saveImageToCloudinary, navigate, scrollbarProperties, checkingPrompt, generating, checkingNSFW, loading, setLoading, resetImageData, showPassword, togglePasswordVisibility }

    return (
        <AppContext.Provider value={values}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;