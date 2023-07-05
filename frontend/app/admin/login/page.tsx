'use client'

import axios from 'axios'
import React, { ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation';

function AdminLogin() {
    const router = useRouter()
    const [token, setToken] = React.useState('null')
    const [credentials, setCredentials] = React.useState({username: '', password: ''})

    useEffect(() => {
        const checkToken = async () => {
            const req = await axios.get(`http://localhost:5001/api/users/verify/${token}`)
            if(req.data.code === 200) {
                localStorage.setItem('token', req.data.token)
                localStorage.setItem('username', req.data.username)
                router.push('/admin')
            }
        }
        setToken(localStorage.getItem('token') || 'null')
        checkToken()
        console.log('hello world')
    }, [])

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({username: e.target.value, password: credentials.password})
        console.log(credentials)
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({username: credentials.username, password: e.target.value})
        console.log(credentials)
    }
    
    const handleLoginButton = async () => {
        const req = await axios.post('http://localhost:5001/api/users', credentials)    
        console.log(req, req.data, req.data.code, req.data.token)    
        if(req.data.code === 200) {
            localStorage.setItem('token', req.data.token)
            localStorage.setItem('username', req.data.username)
            router.push('/admin')
            console.log(req)
        }
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1 className='font-bold font-sans text-black text-2xl'>Login</h1>
            <input className='w-64 mt-3 bg-white border-solid border-3 border-black p-2 font-bold rounded' onChange={handleUsernameChange} placeholder='Username'></input>
            <input className='w-64 mt-2 bg-white border-solid border-3 border-black p-2 font-bold rounded' onChange={handlePasswordChange} placeholder='Password'></input>
            <button className='w-64 mt-3 bg-yellow-400 border-solid border-3 border-black p-2 font-bold rounded' onClick={handleLoginButton}>Login</button>
        </div>
    )
}

export default AdminLogin