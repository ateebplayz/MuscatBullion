'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import "bootstrap/dist/css/bootstrap.css";
import '../globals.css'
import { convertString } from '../../components/helpers'
import { Editors } from '@/components/editors';
import axios from 'axios';

function Admin() {
    const [margins, setMargins] = React.useState([])
    const [token, setToken] = React.useState(false)

    const router = useRouter()
    const loginButton = () => {
        router.push('/admin/login')
    }
    const setMargin = async () => {
        const resp = await axios.get('http://muscatbullionproject.grabyourservices.com:5001/api/margins')
        setMargins(resp.data.data || [])
    }
    setMargin()
    React.useEffect(() => {
        let token = localStorage.getItem('token')
        if(!token || token == 'null' || token == undefined || token == 'undefined' || token == null) {
            setToken(false)
        } else {
            setToken(true)
        }
        setMargin()
    }, [])
    return (
        <div style={token ? ({display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'fit-content'}) : ({display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'})}>
            <div>{token ? <p className='text-white'>Token Found</p> : <h1 className='text-2xl font-bold text-red-600'>Token Not Found(You arent logged in!)</h1>}</div>
            {token ? <>
                
                <Editors editors={margins} />
                <button className='w-64 mt-4 bg-red-400 text-white border-solid border-3 border-black p-2 font-bold rounded' onClick={() => {localStorage.removeItem('token'); router.push('/admin')}}>Log Out</button>

            </> : <button className='w-64 mt-4 bg-yellow-400 border-solid border-3 border-black p-2 font-bold rounded' onClick={loginButton}>Login</button>}
        </div>
    )
}

export default Admin