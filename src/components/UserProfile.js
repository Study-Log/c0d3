import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/UserProfile.css'
import { USER_DATA, GET_USERNAME } from '../db/queries'
import { loadComponent } from './shared/shared'
import User from './shared/User.js'

const UserProfile = ({ match }) => {
  return (
    <Query query={USER_DATA} variables={{ in: { username: match.params.userId } }}>
      {loadComponent(({ userInfo: {
        name,
        createdAt,
        stars
      } }) => {
        const firstName = name.split()[0]
        const userStars = stars.map((s) => {
          let comment = s.comment
          if (!comment) comment = 'Thank you for helping me! :)'
          return (
            <div className='card testimonial-card' style={{ display: 'inline-block', margin: '20px' }}>
              <div className='card-body'>
                <h4> <User userId={s.studentId} className='card-title' /> </h4>
                <hr />
                <p>
                  <i className='fa fa-quote-left' />
                  <span style={{ marginLeft: '10px', marginRight: '10px' }}>
                    {comment}
                  </span>
                  <i className='fa fa-quote-right' />
                </p>
              </div>
            </div>
          )
        })

        return (
          <div className='container'>
            <h1>PROFILE</h1>
            <hr />
            <div>
              <h3>{ name }</h3>
              <p>{firstName} joined C0D3.com on { moment(parseInt(createdAt)).calendar() }, { moment(parseInt(createdAt)).fromNow() } </p>
            </div>
            <hr />
            <div style={{ textAlign: 'center' }}>{userStars}</div>
            <hr />
            <h3>SUBMISSIONS</h3>
            <hr />
            <h3>Student Stats</h3>
          </div>
        )
      }) }
    </Query>
  )
}

export default UserProfile
