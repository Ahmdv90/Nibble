import React, { useEffect } from 'react'
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/SideBar';
import Header from '../components/UI/Header'


export default function PrivateLayout() {
    const navigate = useNavigate()
    const location =  useLocation()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/')
        }
    }, [location])

    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
  return (
    <div className='flex font-sans overflow-hidden'>
        <Sidebar />
        <div className='flex-1 flex flex-col min-h-screen  overflow-y-hidden'>
          <Header />
          <div className='flex-1'>
        <Outlet />
          </div>
        </div>
    </div>
  )
}