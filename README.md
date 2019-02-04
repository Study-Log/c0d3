# C0D3.com

This is the codebase for the website c0d3.com, which provides a platform for students to learn coding through solving challenges

## How to Start

1. Clone repository
   > SSH - `git clone git@git.c0d3.com:song/c0d3.git`
   or
   > HTTPS - `git clone https://git.c0d3.com/song/c0d3.git`
2. Get updated changes from gitlab- `git pull`
3. Install necessary libraries - `yarn`
4. Create a frontend and backend url for your app (must be c0d3.com domain) at [apps.c0d3.com](https://apps.c0d3.com)
   > For Example:
   > frontend code is https://trifrog.c0d3.com with port 9623
   > backend url is https://tri-serv.c0d3.com with port 9643
5. Copy hidden file `.env.example` and name it `.env`
   > Example: to see hidden files - `ls -a`

   > `$ cp .env.example .env`
6. Change the environment file `.env` to map to your server url
   
*  Server 
   - change server port: SERVER_PORT=your-server-port
   - change server url: HOST_NAME=your-server-url.c0d3.com
   - change server url: REACT_APP_SERVER_URL=https://your-server-url.c0d3.com

*  Client
   - change client port: PORT=your-client-port
   - change client url: CLIENT_URL=https://your-client-url.c0d3.com
7. Start the frontend server on the correct port - `yarn start`
8. Start the backend server on the correct port - `supervisor Server/app.js`
9. On the front-end, add landing.html to url
   > For example: https://your-client-url.c0d3.com/landing.html

## Database Overview

- Lesson (description, docUrl, githubUrl, videoUrl, order, title)
  - hasMany Challenge
  - hasMany Submission
  - belongsToMany User -> UserLesson
- Challenge (status, description, title, order)
  - hasMany Submission
- User (name, username, password, email, gsId, isOnline)
  - belongsToMany User (student) -> AdoptedStudent
  - belongsToMany Lesson -> UserLesson
  - belongsTo Room (lastroom)
  - belongsToMany Room -> UserRoom
- UserLesson (isPassed, isTeaching, isEnrolled)
- Submission (mrUrl, diff, comment, status, viewCount)
  - belongsTo User
  - belongsTo User (reviewer)
  - belongsTo Challenge
  - belongsTo Lesson
- AdoptedStudent (lessonId)
- Star (lessonId)
  - belongsTo User (student)
  - belongsTo User (mentor)
- Room (name, description, isEditable, isPrivate)
  - belongsToMany User -> UserRoom
  - hasMany Message
- Message (content, isEdited)
  - belongsTo Room
  - belongsTo User
- UserRoom (unread, isLastRoom)

## Tests

### Functional Tests

Profiles:

```
    "profiles": {
        "base": {
            "tests": "path:./*.js",
//            "env": {
//                 these only get set when running in parallel (child processes from main process)
//                "DEBUG": "nemo*"
//            },
```

Capabilities:

```
    "profiles": {
        "base": {
            "tests": "path:./*.js",
            "driver": {
                "browser": "chrome"
// Use the below "builders" pattern to use the selenium-webdriver Builder class:
// see: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Builder.html
//                "builders": {
//                    "withCapabilities": [
//                        {
//                            "browserName": "chrome",
//                            "chromeOptions": {
//                                "args": [
//                                    "headless",
//                                    "window-size=1200,800"
//                                ]
//                            }
//                        }
//                    ]
//                }
```

## Databases

### Migration

If you make a copy of postgresdb, you might run into an issue where data is not auto-incrementing. To fix this, refer to this fix: https://dba.stackexchange.com/questions/65662/postgres-how-to-insert-row-with-autoincrement-id
