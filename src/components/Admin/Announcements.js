import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Markdown from 'react-markdown'
import { GET_ANNOUNCEMENTS } from '../../db/queries.js'
import { loadComponent, cacheUpdate } from '../shared/shared.js'
import MarkdownComponent from '../shared/Markdown.js'

const DELETE_ANNOUNCEMENT = gql`
                      mutation delete($input: String){
                        deleteAnnouncement(value: $input) {
                          id,
                          description
                        }
                      }
                    `
const CREATE_ANNOUNCEMENT = gql`
           mutation create($input: String){
              createAnnouncement(value: $input) {
                id,
                description
              } 
           }  
            `

class Announcements extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      announcement: ''
    }
  }
  render () {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ textAlign: 'center' }}>Admin Page</h1>
        <div className='container' >
          <h4 >New Announcements: </h4>
          <div style={{ width: '100%', height: '200px' }}>
            <MarkdownComponent onChange={(input) => {
              this.setState({
                announcement: input
              })
            }} />

          </div>
          <Mutation update={cacheUpdate(GET_ANNOUNCEMENTS, ({ createAnnouncement }, { announcements }) => {
            return {
              announcements: [createAnnouncement].concat(announcements)
            }
          })} mutation={CREATE_ANNOUNCEMENT}>
            {(execute) => {
              return (
                <div>
                  <button className='btn btn-success' style={{ margin: '10px 0px 10px 0px' }} onClick={() => {
                    execute({
                      variables: {
                        input: this.state.announcement
                      }
                    })
                    this.setState({
                      announcement: ''
                    })
                  }}>SUBMIT</button>
                </div>
              )
            }}
          </Mutation>
        </div>
        <div className='container'>
          <Query query={GET_ANNOUNCEMENTS} >
            { loadComponent(({ announcements }) => {
              return announcements.map((v, i) => {
                return (
                  <div>
                    <Markdown key={i} source={v.description} />
                    <Mutation update={cacheUpdate(GET_ANNOUNCEMENTS, ({ deleteAnnouncement }) => {
                      return {
                        announcements: deleteAnnouncement
                      }
                    })} mutation={DELETE_ANNOUNCEMENT}>
                      {(execute) => {
                        return <button className='deleteAnnouncement' onClick={() => {
                          execute({
                            variables: {
                              input: v.id
                            }
                          })
                        }}>DELETE</button>
                      }}
                    </Mutation>
                    <hr />
                  </div>
                )
              })
            })}
          </Query>

        </div>
      </div>
    )
  }
}

export default Announcements
