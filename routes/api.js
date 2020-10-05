/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var board = require('./../models/board.js');
module.exports = function (app) {
  
  app.route('/api/boards')
  .get((req,res)=>{//get list of all board
    board.find()
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .post((req,res)=>{//create a new board
    var newBoard= new board({
      boardName: req.body.board_name,
      boardDeletePass: req.body.delete_password,
      boardThreads: []
    })
    newBoard.save()
    .then((result)=>{
      console.log(result);
      res.send(result);
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .delete((req,res)=>{//delete a board
    board.findOne({_id: req.body.board_id})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }
      else if(result.boardDeletePass!= req.body.delete_password){
        res.send("incorrect password")
      }else{
        result.deleteOne()
        .then(()=>{
          console.log('success')
          res.send('success');
        })
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .put((req,res)=>{//update board reported status
    board.findOne({_id: req.body.board_id})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }
      else{
      result.boardReported= true;
      result.save()
      .then(()=>{
        res.send('success');
      })
    }
    })
    .catch((err)=>{
      console.log(err);
    })
  })


  app.route('/api/threads/:board')
  .get((req,res)=>{//get all threads of board (mungkin hrs di atur lgi bwt sesuain permintaan)
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
        console.log(result.boardThreads)
        res.send(result.boardThreads);
      }
    })
  })
  .post((req,res)=>{//create a new thread in a board
    console.log(req.params.board);
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist')
      }else{
      var newThread=({
        threadText: req.body.text,
        threadDeletePass: req.body.delete_password,
        threadCreatedOn: new Date(),
        threadBumpedOn: new Date(),
        threadReported:false,
        threadReplyCount:0,
        threadReplies: []
      })
      result.boardThreads.push(newThread);
      result.save()
      .then(()=>{
        res.redirect('/b/'+req.params.board);
      })
      } 
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .put((req,res)=>{//report a thread
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
      var updatedThread=result.boardThreads.filter((ele)=>{
        return ele._id==req.body.thread_id;
      })[0];
      if(updatedThread==undefined){
        res.send('thread does not exist');
      }
      else{
        updatedThread.threadReported=true;
        result.save()
        .then(()=>{
          res.send('success');
        })
      }
    }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .delete((req,res)=>{//deletes a thread
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
      var deletedThread=result.boardThreads.filter((ele)=>{//find the thread that will be delete
        return ele._id==req.body.thread_id;
      })[0];
      var deletedindex=result.boardThreads.indexOf(deletedThread);//get the index of the thread that will be delete
      if(deletedindex==-1){//if thread not found
        res.send('thread does not exist');
      }
      else if(req.body.delete_password!= deletedThread.threadDeletePass){//check for delete password
        res.send('incorrect password');
      }else{//if correct delete the thread
        result.boardThreads.splice(deletedindex,1);
        result.save()
        .then(()=>{
          res.send('success')   
        })
      }
    }
    })
    .catch((err)=>{
      console.log(err);
    })
  });  



  app.route('/api/replies/:board')
  .get((req,res)=>{//get all replies of thread  (mungkin hrs di atur lgi bwt sesuain permintaan)
    board.findOne({boardName: req.params.board})//nanti search thread id nya pake query
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
        var searchedThread=result.boardThreads.filter((ele)=>{
          return ele._id==req.query.thread_id;
        })[0];
        if(searchedThread==undefined){
          // console.log('not exist',)
          res.send('thread does not exist')
        }else{
          res.send(searchedThread);
        }
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .post((req,res)=>{//post a reply to a thread
    var newReply={
      replyText: req.body.text,
      replyDeletePass:req.body.delete_password,
      replyCreatedOn: new Date(),
      replyReported: false
    }
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){// if board is not found
        res.send("board does not exist");
      }else{
        var selectedThread=result.boardThreads.filter((ele)=>{
          return ele._id==req.body.thread_id;
        })[0];
        if(selectedThread==undefined){
          res.send('thread does not exist');
        }else{
          selectedThread.threadReplies.push(newReply);
          selectedThread.threadBumpedOn=new Date();
          selectedThread.threadReplyCount++;
          result.save()
          .then(()=>{
            res.redirect('/b/'+req.params.board+'/'+req.body.thread_id);
          })
        }
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .put((req,res)=>{//report a reply
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
        var selectedThread= result.boardThreads.filter((ele)=>{
          return ele._id==req.body.thread_id;
        })[0];
        if(selectedThread==undefined){
          res.send('thread does not exist');
        }else{
          var updatedReply=selectedThread.threadReplies.filter((ele)=>{
            return ele._id==req.body.reply_id;
          })[0];
          if(updatedReply==undefined){
            res.send('reply does not exist');
          }else{
            updatedReply.replyReported=true;
            result.save()
            .then(()=>{
              res.send('success');
            })
          }
        }
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .delete((req,res)=>{ //deletes a reply
    board.findOne({boardName: req.params.board})
    .then((result)=>{
      if(!result){
        res.send('board does not exist');
      }else{
        var selectedThread=result.boardThreads.filter((ele)=>{
          return ele._id==req.body.thread_id;
        })[0];
        if(selectedThread==undefined){
          res.send('thread does not exist');
        }else{
          var deletedReply=selectedThread.threadReplies.filter((ele)=>{
            return ele._id==req.body.reply_id;
          })[0];
          if(deletedReply==undefined){
            res.send('reply does not exist');
          }else{
            if(deletedReply.replyDeletePass!=req.body.delete_password){
              res.send('incorrect password');
            }else{
              deletedReply.replyText='[deleted]';
              result.save()
              .then(()=>{
                res.send("success");
              })
            }
          }
        }
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  ;

};
