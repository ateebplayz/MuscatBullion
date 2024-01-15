import react, { ChangeEvent } from 'react'
import '../app/globals.css'
import 'bootstrap/dist/css/bootstrap.css'

import React from 'react'
import { margin } from './margin'
import { convertString } from './helpers'
import axios from 'axios'

export const Editor = ({margin: {_id, id, value}}: {margin: margin}) => {
    const [msg, setMsg] = React.useState('')
    const [val, setVal] = React.useState('')
    const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value)
    }
    const handleBtnClick = async () => {
        const resp = await axios.post('https://prices.grabyourservices.com:9000/api/margins/set', 
        {
            token: localStorage.getItem('token'),
            value: Number(val),
            id: id,
        })
        console.log(resp)
        setMsg(resp.data.msg || resp.data.data.msg)
    }
  return (
        <div className='flex m-2 rounded-lg w-96 flex-column justify-center p-3 items-center border-solid border-3 border-black'>
            <p className='font-mono font-red font-bold text-xl'>{msg}</p>
            <p className='font-mono font-bold text-xl'>{convertString(id)}</p>
            <input onChange={handleValueChange}  className='w-full mt-4 bg-white border-solid border-3 border-black p-2 pt-3 pb-3 font-bold placeholder-grey-900 rounded' placeholder={`Value(Old: ${value})`}></input>
            <button onClick={handleBtnClick} className='w-full mt-4 bg-yellow-400 border-solid border-3 border-black p-2 font-bold rounded'>Submit</button>
        </div>
  )
}
export const Editors = ({editors}: {editors: margin[]}) => {
    const editorList = editors.map((editor, index) => <Editor key={index} margin={editor} />)
    return (
        
        <div className='flex flex-wrap flex-row justify-evenly'>
            {editorList}
        </div>
        
    )
}