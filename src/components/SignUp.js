import React from 'react'
import authClient from '../helpers/auth/client'
import '../css/AuthForm.css'

class SignUpForm extends React.Component {
  constructor (props) {
    super(props)
    this.fieldProps = {
      value: '',
      isValid: false,
      inputClass: 'form-control',
      feedbackClass: 'feedback',
      feedback: ''
    }
    this.state = {
      name: { ...this.fieldProps },
      userName: { ...this.fieldProps },
      confirmEmail: { ...this.fieldProps },
      password: { ...this.fieldProps },
      passwordConfirm: { ...this.fieldProps }
    }
  }

  recordInput (event) {
    const inputValue = event.target.value
    const inputName = event.target.name
    this.setState({
      [inputName]: { ...this.state[inputName], value: inputValue }
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.formDataIsValid()) {
      authClient.account.create(this.getFormData(), response => {
        if (response.success) {
          window.location = '/'
        }
      })
    }
    return this.validateInputs(this.getFormData(), false)
  }

  displayFeedback (inputName, errors) {
    const classNameModifier = `${errors ? 'in' : ''}valid`
    this.setState({
      [inputName]: {
        ...this.state[inputName],
        isValid: !errors,
        inputClass: `${this.fieldProps.inputClass} ${classNameModifier}`,
        feedbackClass: `${this.fieldProps.feedbackClass} ${classNameModifier}`,
        feedback: !errors ? 'valid' : Object.values(errors)[0]
      }
    })
  }

  validateInput (event) {
    const inputName = event.target.name
    const formInputs = { [inputName]: this.state[inputName].value }
    if (inputName.substr(0, 8) === 'password') {
      const secondInputName =
        inputName === 'password' ? 'passwordConfirm' : 'password'
      formInputs[secondInputName] = this.state[secondInputName].value
    }
    return this.validateInputs(formInputs)
  }

  validateInputs (formInputs, context = 'partial') {
    authClient.validator('signUp', formInputs, context, errors => {
      Object.keys(formInputs).forEach(inputName => {
        this.displayFeedback(inputName, (errors && errors[inputName]) || '')
      })
    })
  }

  formDataIsValid () {
    const invalidInputCount = Object.values(this.state)
      .map(fieldProps => fieldProps.isValid)
      .filter(isValid => !isValid).length
    return invalidInputCount === 0
  }

  getFormData () {
    const formData = Object.entries(this.state).reduce((acc, input) => {
      acc[input[0]] = input[1].value
      return acc
    }, {})
    return formData
  }

  render () {
    return (
      <div className='container'>
        <form className='auth-form' onSubmit={this.handleSubmit.bind(this)}>
          <p className='h5 mb-4'>Sign up</p>
          <div className='md-form'>
            <label htmlFor='full-name'>Full Name</label>
            <input
              id='full-name'
              className={this.state.name.inputClass}
              name='name'
              type='text'
              onBlur={this.validateInput.bind(this)}
              onChange={this.recordInput.bind(this)}
            />
            <div className={this.state.name.feedbackClass}>
              {this.state.name.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='user-name'>User Name</label>
            <input
              id='user-name'
              className={this.state.userName.inputClass}
              name='userName'
              type='text'
              onBlur={this.validateInput.bind(this)}
              onChange={this.recordInput.bind(this)}
            />
            <div className={this.state.userName.feedbackClass}>
              {this.state.userName.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              className={this.state.confirmEmail.inputClass}
              name='confirmEmail'
              type='text'
              onBlur={this.validateInput.bind(this)}
              onChange={this.recordInput.bind(this)}
            />
            <div className={this.state.confirmEmail.feedbackClass}>
              {this.state.confirmEmail.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='password-field'>Password</label>
            <input
              id='password-field'
              className={this.state.password.inputClass}
              name='password'
              type='password'
              autoComplete='off'
              onBlur={this.validateInput.bind(this)}
              onChange={this.recordInput.bind(this)}
            />
            <div className={this.state.password.feedbackClass}>
              {this.state.password.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='password-confirm'>Confirm Password</label>
            <input
              id='password-confirm'
              className={this.state.passwordConfirm.inputClass}
              name='passwordConfirm'
              type='password'
              autoComplete='off'
              onBlur={this.validateInput.bind(this)}
              onChange={this.recordInput.bind(this)}
            />
            <div className={this.state.passwordConfirm.feedbackClass}>
              {this.state.passwordConfirm.feedback}
            </div>
          </div>
          <button className='btn btn-primary' type='submit'>
            Sign Up
          </button>
        </form>
      </div>
    )
  }
}

export default SignUpForm
