import React from 'react'

const ForgotPassword = () => {
  let emailRef = React.createRef()
  return (
    <div className='container'>
      <form className='auth-form'>
        <p className='h5 mb-4'> Forgot Password?</p>
        <p>Please enter your email address below to recieve the reset password link.</p>
        <label htmlFor='forgotPasswordEmail'>
      Email: <input
        id='email'
        placeholder='hello@c0d3.com'
        ref={emailRef}
          />
        </label>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default ForgotPassword
