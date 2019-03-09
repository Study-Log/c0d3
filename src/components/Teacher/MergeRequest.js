import React from 'react'
import { Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import Markdown from 'react-markdown'
import { cacheUpdate } from '../shared/shared'

import {
  APPROVE_SUBMISSION,
  REJECT_SUBMISSION,
  SUBMISSIONS,
  UNAPPROVE_SUBMISSION
} from '../../db/queries'
import StudentDiff from '../Student/StudentDiff'

const updateSubmissions = (submissions, status, { id }) => {
  submissions.forEach(sub => {
    if (sub.id === id) sub.status = status
  })
  return submissions
}

const MergeRequestBody = ({ mrInfo, lid }) => {
  let submissionVar = {
    in: {
      challengeId: `${mrInfo.challenge.id}`,
      lessonId: `${lid}`,
      userId: `${mrInfo.user.id}`
    }
  }
  if (mrInfo.status.includes('-')) {
    const status = mrInfo.status.split('-')[1]
    return (
      <div className='card-text'>
        <p>You have {status} this submission</p>
        <Mutation mutation={UNAPPROVE_SUBMISSION}
          variables={submissionVar}
          update={cacheUpdate(SUBMISSIONS, ({ unapproveSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open', unapproveSubmission)
          }, { in: { id: lid } })}
        >
          {(execute) => {
            return (
              <a onClick={() => {
                execute()
              }}>UNDO</a>
            )
          }}
        </Mutation>
      </div>
    )
  }
  let comment
  const formattedCreatedAt = moment(+mrInfo.createdAt).format('MMM Do h:mma')
  const formattedUpdatedAt = moment(+mrInfo.updatedAt).fromNow()
  return (
    <div className='card-text'>
      <h6 className='mt-2'>
        {` on ${formattedCreatedAt} | updated ${formattedUpdatedAt} `}
      </h6>
      <StudentDiff diff={mrInfo.diff} />
      <hr />
      {mrInfo.comment ? (
        <div>
          <h6>Comments</h6>
          <Markdown source={mrInfo.comment} />
          <hr />
        </div>
      ) : null}

      <div className='form-group'>
        <label htmlFor='submission-comment'>
                  Add your comments to address here
        </label>
        <textarea
          className='form-control rounded-0'
          id='submission-comment'
          rows='10'
          ref={node => (comment = node)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Mutation
          mutation={APPROVE_SUBMISSION}
          update={cacheUpdate(SUBMISSIONS, ({ approveSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open-approved', approveSubmission)
          }, { in: { id: lid } })}
        >
          {execute => (
            <button className='btn btn-sm btn-success' onClick={() => {
              submissionVar.in.comment = comment.value
              execute({ variables: submissionVar })
            }}>
              <i className='fa fa-thumbs-up mr-2' />
                        Approve Challenge
            </button>
          )}
        </Mutation>
        <Mutation mutation={REJECT_SUBMISSION}
          update={cacheUpdate(SUBMISSIONS, ({ rejectSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open-rejected', rejectSubmission)
          }, { in: { id: lid } })}
        >
          {execute => (
            <button
              className='btn btn-sm btn-dark'
              onClick={() => {
                submissionVar.in.comment = comment.value
                execute({ variables: submissionVar })
              }}
            >
              <i className='fa fa-comment mr-2' />
                            Suggest Revision
            </button>
          )}
        </Mutation>
      </div>
    </div>
  )
}

const MergeRequest = ({ lid, mrInfo }) => {
  return (
    <div className='card-deck'>
      <div className='card mb-2 mt-1'>
        <div className='card-body pb-0 pl-4'>
          <div className='card-title'>
            <span className='h5'>
              <Link to={`/profile/${mrInfo.user.id}`}>
                {mrInfo.user.username}
              </Link>{' '}
              submitted challenge: {mrInfo.challenge.title}
            </span>
          </div>
          <MergeRequestBody mrInfo={mrInfo} lid={lid} />
        </div>
      </div>
    </div>
  )
}

export default MergeRequest
