
import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import axios from 'axios';
import AdminDashboard from '../pages/AdminPanel/AdminDashboard';
export default function AdminLayout() {
    const navigate = useNavigate()
    const location =  useLocation()

    useEffect(() => {
        let token = localStorage.getItem("__token__")
        let adminToken = "1"
        axios.post("https://movie.pythonanywhere.com/api/v1/auth/login/",{
            email:"hadzhi@gmail.com",
            password:"2003"
        }).then(res=>{
            adminToken = res.data.token_key
            if(adminToken != token){
                return navigate('/admin', {
                    state: { from: location.pathname }
                })
            }
    })
    }, [location])
  return (
    <div className="admin flex">
      <AdminDashboard />
      <Outlet/>
    </div>
  )
}
