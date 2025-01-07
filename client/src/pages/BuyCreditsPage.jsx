import React, { useContext, useEffect } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify'
import axios from 'axios'

import AppContext from '../contexts/AppContext/AppContext.js'
import LoginContext from '../contexts/LoginContext/LoginContext.js'
import UserContext from '../contexts/UserContext/UserContext.js'
import { assets, plans } from '../assets/assets.js'
import Loader from '../components/custom/Loader.jsx'

const BuyCreditsPage = () => {

  const { backendUrl, loadTotalUserData, token, navigate, resetImageData, loading, setLoading } = useContext(AppContext)
  const { setShowLogin } = useContext(LoginContext);
  const { user } = useContext(UserContext);

  const initializePayment = async (order, planId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: `${planId} Credits Payment`,
      order_id: order.id,
      receipt: order.receipt,

      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/transaction/verify-razorpay-payment`, response, { headers: { token } });

          if (data.success) {
            loadTotalUserData();
            navigate('/');
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }

        } catch (error) {
          toast.error(error.message);
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

  };

  const paymentRazorpay = async (planId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/transaction/payment-razorpay`, { planId }, {
        headers: { token }
      });

      if (data.success) {
        initializePayment(data.order, planId);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCLick = (planId) => {
    setLoading(true);
    if (user) {
      paymentRazorpay(planId);
    } else {
      setShowLogin(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    resetImageData();
  }, [])


  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='min-h-[80vh] text-center pt-10 mb-10'>

      <div className='border border-gray-400 px-10 py-2 rounded-full mb-6 inline-block'>
        Subscription Plans
      </div>
      <h1 className='text-center text-3xl font-medium mb-1'>Choose Your Plan</h1>
      <p className='text-base text-zinc-500 mb-6 sm:mb-10'>Unlock your creativity by choosing the plan that suits your needs!</p>

      <div className='flex flex-wrap justify-center gap-10 text-center mb-7'>
        {plans.map((plan, idx) => {
          return (
            <div key={`plan-${idx}`} className={`w-80 flex flex-col items-center justify-center bg-white drop-shadow-sm border rounded-lg py-14 px-12 text-gray-600 ${!loading && 'hover:scale-105 transition-all duration-300'}`}>
              <div className='flex items-center gap-2 mb-5'>
                <img src={assets.logo_icon} alt="app-logo" width={70} />
                <p className='text-2xl font-semibold'>{plan.id}</p>
              </div>
              <p className='text-base'>{plan.desc}</p>
              <p className='mt-6 text-base'>
                <span className='text-3xl font-medium'>&#8377;{plan.price}</span> / {plan.credits} credits
              </p>
              <button disabled={loading} onClick={() => handleCLick(plan.id)} className={`w-full text-white mt-8 text-base rounded-md py-2.5 min-w-52 ${!loading ? 'hover:bg-gray-700 hover:scale-105 bg-gray-800 transition-all duration-200' : 'bg-gray-700'}`}>
                {!loading ? `${user ? 'Purchase' : 'Get Started'}` : <Loader width={6} />}
              </button>
            </div>
          )
        })}
      </div>
      <p className='text-sm text-neutral-500'>(Note: 1 credit is the token money to generate 1 image from a prompt)</p>
    </motion.section>
  )
}

export default BuyCreditsPage