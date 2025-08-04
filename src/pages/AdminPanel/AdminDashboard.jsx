import React from 'react'
import { NavLink } from 'react-router'

export default function AdminDashboard() {
  return (
    <>
    <div className="dashboard bg-gray-500 w-[14%] h-screen p-6 pt-10">
       <nav className='flex flex-col gap-5 '>
        <NavLink to={"Admin/restorants"} className={"font-bold text-gray-300 bg-gray-400 px-10 py-2 rounded-md"} >Restorants</NavLink>
        <NavLink to={"Admin/categories"} className={"font-bold text-gray-300 bg-gray-400 px-10 py-2 rounded-md"} >Categories</NavLink>
        <NavLink to={"Admin/products"} className={"font-bold text-gray-300 bg-gray-400 px-10 py-2 rounded-md"} >Products</NavLink>
       </nav>
    </div>
    </>
  )
}
