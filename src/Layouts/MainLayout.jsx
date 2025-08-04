import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../components/SideBar';
import Header from '../components/UI/Header'

export default function MainLayout() {
  let token = localStorage.getItem("__token_")
  if(token){
     return <Navigate to={"/home"} />
  }
  return (
    <div >
        <Outlet />
    </div>
  )
}
