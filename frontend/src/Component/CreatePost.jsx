import React from 'react'
import InputField from './InputField'
import InputEmoji from 'react-input-emoji'
import axios from 'axios'

const createPost = async(data) => {
    let fetchData = await axios.post("http://localhost:8800/post/create-post", {
      description: data
    }).then(res => res.data)
    console.log(fetchData)
}


function CreatePost({user}) {
  return (
    <div className='p-3 rounded-lg bg-white'>
              <InputEmoji 
          cleanOnEnter
          onEnter={createPost}
          placeholder="Type a message"
          borderColor='red'
        />

    </div>
  )
}

export default CreatePost