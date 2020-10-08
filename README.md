# FreeCodeCamp AnonyMous Message Board
For the second project of FreeCodeCamp's Information Security Curriculum, we have to make an anonymous message board with full functionality and security features from the user stories, and with functional testing.

## Live Demo On Repl
https://freecodecamp-anonymous-message-board-2.jordyf15.repl.co/

## Technologies Used
1. HTML
2. CSS
3. Javascript
4. Body-parser version ^1.15.2
5. Chai version ^3.5.0
6. Chai-http version ^3.0.0
7. Cors version ^2.8.1
8. Express version ^4.14.0
9. Helmet version ^3.1.0
10. Mocha version ^3.2.0
11. Mongoose version ^5.10.7
12. Zombie version ^5.0.5

## User Stories
1. Only allow your site to be loading in an iFrame on your own pages.
2. Do not allow DNS prefetching.
3. Only allow your site to send the referrer for your own pages.
4. I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
5. I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
6. I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
7. I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
8. I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
9. I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
10. I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
11. I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
12. Complete functional tests that wholely test routes and pass.

## Project Description
To start the project we can use the FreeCodeCamp's [Boilerplate](https://repl.it/github/freeCodeCamp/boilerplate-project-messageboard). In order for this project to function properly and pass the test there are 3 files that needs to be worked on.
1. `Server.js`
In this file we need to add security features such as:
- only allowing the site to be loading in an iFrame of your own pages
- only allow the site to be sending referrer for your own pages
- do not allow DNS prefetching
All of the above security features can be achieved by using helmet:
```
app.use(helmet());
```
2. `api.js`
In this file we need to create all the route and it's method so the message board can function properly, the are 3 route in total all of them have 4 method.
- `/api/boards`
This route will handle all the crud operations for boards.
    - GET:  
    The get method in this route will get all the data of boards (except delete password and reported status) that is available in the database.
    - POST:  
    The post method in this route will create a new board and save it in the database. 
    - PUT:  
    The put method will update the reported status of the board when the board is reported.
    - DELETE:  
    The delete method in this route will delete the specified board by the user in the database.
- `/api/threads/:board`
This route will handle all the crud operations for threads.
    - GET:  
    The get method will return 10 recent thread of that board along with it's 3 recent replies (information such as delete password and reported status of replies and threads won't be returned).
    - POST:  
    The post method will create a new thread in the specified board.
    - PUT:  
    The put method will update the reported status of a thread when it is reported by the user.
    - DELETE:  
    The delete method will delete the specified thread by the user in the database.
- `/api/replies/:board`
This route will handle all the crud operations for replies.
    - GET:  
    The get method will return datas of all the replies in the thread along with thread except for it's delete password and report status.
    - POST:  
    The post method will create a new reply in the thread specified by the user and also updating the thread bumped_on property to the current time.
    - PUT:  
    The put method will update the reported status of a reply when it is reported by the user.
    - DELETE:  
    The delete method will change the text of the specified reply to '[ deleted ]'
3. `functional-tests.js`  
All the testing in this file will test the functionality of the routes such as their method and it's results when called.


## Instruction from Previous FreeCodeCamp's Boilerplate
1. SET NODE_ENV to `test` without quotes when ready to write tests and DB to your databases connection string (in .env)
2. Recomended to create controllers/handlers and handle routing in routes/api.js
3. You will add any security features to `server.js`
4. You will create all of the functional/unit tests in `tests/2_functional-tests.js` and `tests/1_unit-tests.js` but only functional will be tested


