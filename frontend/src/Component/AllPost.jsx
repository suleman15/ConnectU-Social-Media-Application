import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


function AllPost({user}) {
    const {post} = useSelector(state => state.post)
    const posts = []

    const allPost = async() => {
        const res = await axios.post('http://localhost:8800/post/')  // make a request to the api
        console.log(res.data.data)
        posts = [...post, ...(res.data?.data)]
    }
    useEffect(() => {
    
        allPost()
    },[])
    
    
    
    
  return (
    <div className='p-3 '>
{JSON.stringify(posts)}
    </div>
  )
}

export default AllPost