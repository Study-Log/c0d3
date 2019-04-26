const axios = require('axios')
const accessToken = process.env.MATTERMOST_ACCESS_TOKEN
const chatServiceHeader = { Authorization: `Bearer ${accessToken}` }
let chatServiceUrl = process.env.NODE_ENV === 'production' ? 'https://chat.c0d3.com/api/v4' : 'https://chat-dev.c0d3.com/api/v4'

const matterMostService = {
  signupUser: async (username, password, email) => {
    try {
      await axios.get(`${chatServiceUrl}/users/email/${email}`, { headers: chatServiceHeader })
    } catch (error) {
      await axios.post(`${chatServiceUrl}/users`, { username, password, email }, { headers: chatServiceHeader })
    }
  },
  getUserInfo: (email) => {
    return axios.get(`${chatServiceUrl}/users/email/${email}`, { headers: chatServiceHeader })
  },
  changePasswordOrCreateUser: async ({ username, email }, newPassword, currPassword) => {
    try {
      const userInfo = await matterMostService.getUserInfo(email)
      if (!userInfo || !userInfo.data || !userInfo.data.id) {
        return matterMostService.signupUser(username, newPassword, email)
      }
      return matterMostService.changePassword(email, currPassword, newPassword)
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  },
  changePassword: async (email, currPassword, newPassword) => {
    // Becareful as a developer: According to the docs, current password is required
    // if you are updating your own password
    // https://api.mattermost.com/#tag/users%2Fpaths%2F~1users~1%7Buser_id%7D~1password%2Fput
    try {
      const userInfo = await matterMostService.getUserInfo(email)
      await axios.put(`${chatServiceUrl}/users/${userInfo.data.id}/password`, {
        'new_password': newPassword
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  },
  getChannelInfo: (roomName) => {
    return axios.post(`${chatServiceUrl}/teams/name/c0d3-dev/channels/name/${roomName}`, { headers: chatServiceHeader })
  },
  sendSubmissionMessage: async (roomName, username, challenge, linkToLesson) => {
    try {
      const channelInfo = await matterMostService.getChannelInfo(roomName)
      await axios.post(`${chatServiceUrl}/posts`, {
        'channel_id': `${channelInfo.channel_id}`,
        'message': `@${username} has submitted a solution to ${challenge} ${linkToLesson}`
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error sending submission to mattermost channel')
    }
  }
}

module.exports = matterMostService
