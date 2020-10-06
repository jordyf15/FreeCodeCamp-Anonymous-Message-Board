/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var done = require('mocha').done;

chai.use(chaiHttp);
suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('post a thread to an existing board',function(done){
        chai.request(server)
        .post('/api/threads/testboard')
        .send({text: 'textThread', delete_password:'del'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          //succession of postting a thread doesn't send anything but redirect to the board's page
        })
        done();
      });
      test('post a thread to board that does not exist',function(done){
        chai.request(server)
        .post('/api/threads/aBoardThatDoesNotExist')
        .send({text: 'textThread', delete_password:'del'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist');
        })
        done();
      })
    });
    
    suite('GET', function() {
      
      test('get 10 recent thread of an existing board',function(done){
        chai.request(server)
        .get('/api/threads/testboard')
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.isBelow(res.body.length,11);//only 10 recent threads
          assert.property(res.body[0],'_id');
          assert.property(res.body[0],'created_on');
          assert.property(res.body[0],'text');
          assert.property(res.body[0],'replycount');
          assert.property(res.body[0],'replies');
          assert.notProperty(res.body[0],'reported');
          assert.notProperty(res.body[0],'delete_password');
        })
      done();
      });

      test('get array of threads from a not existing board',(done)=>{
        chai.request(server)
        .get('/api/threads/aBoardThatDoesNotExist')
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist')
        })
        done();
      })
    });
    
    suite('DELETE', function() {
      test('deletes a thread in a non existing board',(done)=>{
        chai.request(server)
        .delete('/api/threads/aBoardThatDoesNotExist')
        .send({thread_id: '1234567890', delete_password:'stuff'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist')
        })
        done();
      });

      test('deletes a non existing thread in an existing board',(done)=>{
        chai.request(server)
        .delete('/api/threads/testboard')
        .send({thread_id: '1234567890', delete_password:'stuff'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'thread does not exist')
        })
        done();
      });

      test('deletes an existing thread in an existing board but with wrong password',(done)=>{
        chai.request(server)
        .delete('/api/threads/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805', delete_password:'stuff'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'incorrect password');
        })
        done();
      });
      //deleting an existing thread correctyly might be a problem since 
      //each Id is different and each test would need a new id
    });
    
    suite('PUT', function() {
      test('reporting a thread in an not existing board',(done)=>{
        chai.request(server)
        .put('/api/threads/aBoardThatDoesNotExist')
        .send({thread_id: '5f7c2035eb309b142855b805'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist');
        })
        done();
      })

      test('reporting a not existing thread in a board',(done)=>{
        chai.request(server)
        .put('/api/threads/testboard')
        .send({thread_id: '5f7c2035eb30random55b805'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'thread does not exist');
        })
        done();
      })

      test("successfully reported a thread",(done)=>{
        chai.request(server)
        .put('/api/threads/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'success');
        })
        done();
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('posting a reply to thread in a non existing board',(done)=>{
        chai.request(server)
        .post('/api/replies/boardnotexist')
        .send({thread_id: '5f7c2035eb309b142855b805', text:'testreply',delete_password: 'del'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist');
        })
        done();
      })
      
      test('posting a reply to a non existing thread',(done)=>{
        chai.request(server)
        .post('/api/replies/testboard')
        .send({thread_id: '5random5eb309b142855b805', text:'testreply',delete_password: 'del'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'thread does not exist')
        })
        done();
      })

      test('posting a reply to a thread successfully',(done)=>{
        chai.request(server)
        .post('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805', text:'testreply',delete_password: 'del'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          //posting a reply successfully will not send a respond but will redirect the user to another route
        });
        done();
      })
    });
    
    suite('GET', function() {
      test('getting a thread in a non existing board',(done)=>{
        chai.request(server)
        .get('/api/replies/boardnotexist')
        .send({thread_id: '5f7c2035eb309b142855b805'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist')
        })
        done();
      })

      test('getting a non existing thread',(done)=>{
        chai.request(server)
        .get('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142asdasd5'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'thread does not exist');
        })
        done();
      })

      test('getting a thread successfully',(done)=>{
        chai.request(server)
        .get('/api/replies/testboard')
        .query({thread_id: '5f7c2035eb309b142855b805'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body._id,'5f7c2035eb309b142855b805');
          assert.equal(res.body.text,"testText")
          assert.property(res.body.replies[0],'_id')
          assert.property(res.body.replies[0],'created_on')
          assert.property(res.body.replies[0],'text')
          assert.notProperty(res.body.replies[0],'delete_password')
          assert.notProperty(res.body.replies[0],'reported');
        })
        done();
      })
      
    });
    
    suite('PUT', function() {
      test('reporting a reply in a thread in a non existing board',(done)=>{
        chai.request(server)
        .put('/api/replies/eqewmdnassdmasds')
        .send({thread_id: '5f7c2035eb309b142855b805', reply_id:'5f7c4e87659af51294c6d870'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'board does not exist');
        })
        done();
      })

      test("reporting a reply in a non existing thread",(done)=>{
        chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b1asdasd5b805', reply_id:'5f7c4e87659af51294c6d870'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'thread does not exist');
        })
        done();
      })
      test('reporting a non existing reply',(done)=>{
        chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805', reply_id:'5f7c4e87659af512asdasdwe'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'reply does not exist');
        })
        done();
      })

      test('reporting a reply successfully',(done)=>{
        chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805', reply_id:'5f7c4e87659af51294c6d870'})
        .end((req,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'success');
        })
        done();
      })
    
    });
    
    suite('DELETE', function() {
      test('deleting a reply in a non existing board',(done)=>{
        chai.request(server)
        .put('/api/replies/aodsaodsaca')
        .send({thread_id: '5f7c2035eb309b142855b805', reply_id: '5f7c4e87659af51294c6d870'})
        .end((req,res)=>{
          assert.equal(res.status,200)
          assert.equal(res.text,'board does not exist')
        })
        done();
      })

      test('deleting a reply in a non existing thread',(done)=>{
        chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142asdasd05', reply_id: '5f7c4e87659af51294c6d870', delete_password: 'del'})
        .end((req,res)=>{
          assert.equal(res.status,200)
          assert.equal(res.text,'thread does not exist')
        })
        done();
      })

      test('deleting a non existing reply',(done)=>{
        chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: '5f7c2035eb309b142855b805', reply_id: '5f7c4e87659af5129asdasd',delete_password: 'del'})
        .end((req,res)=>{
          assert.equal(res.status,200)
          assert.equal(res.text,'reply does not exist')
        })
        done();
      })

    });
    
  });

});
