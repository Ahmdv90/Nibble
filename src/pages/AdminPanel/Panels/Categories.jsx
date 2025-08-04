import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Categories() {
  const [categories, setCat] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showUpd, setShowUpd] = useState(false)
  const [showDel, setShowDel] = useState(false)
  const [form, setForm] = useState({ name: '', image: '', id: null })
  const [imgFile, setImgFile] = useState(null)

  const fetchData = async () => {
    const res = await axios.get('https://d2eb3bc0e753b02d.mokky.dev/categories')
    setCat(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const uploadImage = async () => {
    if (!imgFile) return ''
    const formData = new FormData()
    formData.append('file', imgFile)
    const res = await axios.post('https://d2eb3bc0e753b02d.mokky.dev/uploads', formData)
    return res.data.url || ''
  }

  const handleAdd = async () => {
    const img = await uploadImage()
    await axios.post('https://d2eb3bc0e753b02d.mokky.dev/categories', {
      name: form.name,
      image: img
    })
    setShowAdd(false)
    fetchData()
  }

  const handleUpdate = async () => {
    let img = form.image
    if (imgFile) img = await uploadImage()
    await axios.patch(`https://d2eb3bc0e753b02d.mokky.dev/categories/${form.id}`, {
      name: form.name,
      image: img
    })
    setShowUpd(false)
    fetchData()
  }

  const handleDelete = async () => {
    await axios.delete(`https://d2eb3bc0e753b02d.mokky.dev/categories/${form.id}`)
    setShowDel(false)
    fetchData()
  }

  return (
    <div className="catPanel flex  items-start px-10 py-10 gap-5">
      <div className="main">
         <div className="head w-full flex justify-between items-center">
        <h1 className='font-bold text-[24px]'>Categories:</h1>
        <button onClick={() => setShowAdd(true)} className='bg-green-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>ADD</button>
      </div>

      <div className="wrap flex flex-col overflow-auto gap-3 max-h-[350px] max-w-[800px]">
        {categories.map(cat => (
          <div className="cat flex items-center gap-3 mx-4 border-2 rounded-xl border-gray-400 p-1 justify-between pr-2" key={cat.id}>
            <img src={cat.image} alt="" className='w-14 h-14 object-cover rounded-lg'/>
            <h1>{cat.name}</h1>
            <div className="btn flex gap-3">
              <button onClick={() => {
                setForm(cat)
                setShowUpd(true)
              }} className='bg-blue-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>UPD</button>
              <button onClick={() => {
                setForm(cat)
                setShowDel(true)
              }} className='bg-red-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>DEL</button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {showAdd && (
        <div className="modalAdd w-[400px] h-[400px] bg-gray-300 rounded-2xl p-4 flex flex-col gap-3 items-start justify-center">
          <h1>Image: <input type="file" onChange={e => setImgFile(e.target.files[0])} className='bg-white p-1 rounded-lg mx-1' /></h1>
          <h1>Name: <input type="text" onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className='bg-white p-1 rounded-lg' /></h1>
          <button onClick={handleAdd} className='bg-green-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>Add</button>
        </div>
      )}

      {showUpd && (
        <div className="modalUpdate w-[400px] h-[400px] bg-gray-300 rounded-2xl p-4 flex flex-col gap-3 items-start justify-center">
          <h1>Image: <input type="file" onChange={e => setImgFile(e.target.files[0])} className='bg-white p-1 rounded-lg mx-1' /></h1>
          <h1>Name: <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className='bg-white p-1 rounded-lg' /></h1>
          <button onClick={handleUpdate} className='bg-blue-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>Update</button>
        </div>
      )}

      {showDel && (
        <div className="modalDel w-[200px] h-[100px] bg-gray-300 rounded-2xl pl-4 flex gap-3 items-center justify-center">
          <button onClick={handleDelete} className='bg-red-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>Del</button>
          <button onClick={() => setShowDel(false)} className='bg-green-500 p-2 rounded-2xl border-2 border-gray-600 text-white'>Cancel</button>
        </div>
      )}
    </div>
  )
}
