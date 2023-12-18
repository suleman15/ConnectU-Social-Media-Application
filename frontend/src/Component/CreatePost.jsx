import React from 'react'
import InputField from './InputField'
import InputEmoji from 'react-input-emoji'

const createPost = async(data) => {
    console.log(data)
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