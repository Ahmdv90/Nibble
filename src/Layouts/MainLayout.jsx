import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/SideBar';
import Header from '../components/UI/Header'

export default function MainLayout() {
  return (
    <div >
        <Outlet />
    </div>
  )
}
