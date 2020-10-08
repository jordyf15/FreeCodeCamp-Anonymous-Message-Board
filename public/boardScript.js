$(function() {
    var currentBoard = window.location.pathname.split('/')[2];
    var url = "/api/threads/"+currentBoard;
    console.log(window.location.pathname.split('/')[2])
    console.log(url)
    $('#boardTitle').text('Welcome to '+window.location.pathname)
    $.ajax({
      type: "GET",
      url: url,
      success: function(data)
      {
        console.log(data);
        var boardThreads= [];
        //
        // THIS ARRAY SET UP IS FOR CODE READABILITIES AND TESTING!
        // THIS IS NOT WHAT IT WOULD LOOK LIKE TO GO LIVE
        //
        data.forEach(function(ele) {
          console.log(ele);//can I use typeScript please?!
          var thread = ['<div class="thread">'];
          thread.push('<div class="main">')
          thread.push('<p class="id">id: '+ele._id+' ('+ele.created_on+')</p>');
          thread.push('<form id="reportThread"><input type="hidden" name="thread_id" value="'+ele._id+'"><input type="submit" class="reportButton" value="Report"></form>');
          thread.push('<form id="deleteThread"><input type="hidden" value="'+ele._id+'" name="thread_id" required=""><input type="text" placeholder="password" name="delete_password" required=""><input class="deleteButton" type="submit" value="Delete"></form>');
          thread.push('<h3>'+ele.text+'</h3>');
          thread.push('</div><div class="replies">');
          var hiddenCount = ele.replycount - 3;
          if (hiddenCount < 1) { hiddenCount = 0 };
          thread.push('<h5>'+ele.replycount+' replies total ('+hiddenCount+' hidden)- <a href="'+window.location.pathname+'/'+ele._id+'">See the full thread here</a>.</h5>');
          ele.replies.forEach(function(rep) {
            thread.push('<div class="reply">')
            thread.push('<p class="id">id: '+rep._id+' ('+rep.created_on+')</p>');
            thread.push('<form id="reportReply"><input type="hidden" name="thread_id" value="'+ele._id+'"><input type="hidden" name="reply_id" value="'+rep._id+'"><input type="submit" class="reportButton" value="Report"></form>');
            thread.push('<form id="deleteReply"><input type="hidden" value="'+ele._id+'" name="thread_id" required=""><input type="hidden" value="'+rep._id+'" name="reply_id" required=""><input type="text" placeholder="password" name="delete_password" required=""><input type="submit" class="deleteButton" value="Delete"></form>');
            thread.push('<p>'+rep.text+'</p>');
            thread.push('</div>')
          });
          thread.push('<div class="newReply">')
          thread.push('<form action="/api/replies/'+currentBoard+'/" method="post" id="newReply">');
          thread.push('<input type="hidden" name="thread_id" value="'+ele._id+'">');
          thread.push('<textarea rows="5" cols="80" type="text" placeholder="Quick reply..." name="text" required=""></textarea><br>');
          thread.push('<input type="text" placeholder="password to delete" name="delete_password" required=""><input class="submitButton" style="margin-left: 5px" type="submit" value="Submit">')
          thread.push('</form></div></div></div>')
          boardThreads.push(thread.join(''));
        });
        $('#boardDisplay').html(boardThreads.join(''));
      }
    });
    
    $('#newThread').submit(function(){
      $(this).attr('action', "/api/threads/" + currentBoard);
    });
    
    $('#boardDisplay').on('submit','#reportThread', function(e) {
      var url = "/api/threads/"+currentBoard;
      $.ajax({
        type: "PUT",
        url: url,
        data: $(this).serialize(),
        success: function(data) { 
          if(!alert(data) ){
            window.location.reload();
          }
        }
      });
      e.preventDefault();
    });
    $('#boardDisplay').on('submit','#reportReply', function(e) {
      var url = "/api/replies/"+currentBoard;
      $.ajax({
        type: "PUT",
        url: url,
        data: $(this).serialize(),
        success: function(data) { 
          if(!alert(data) ){
            window.location.reload();
          }
        }
      });
      e.preventDefault();
    });
    $('#boardDisplay').on('submit','#deleteThread', function(e) {
      var url = "/api/threads/"+currentBoard;
      $.ajax({
        type: "DELETE",
        url: url,
        data: $(this).serialize(),
        success: function(data) { 
          if(!alert(data) ){
            window.location.reload();
          }
        }
      });
      e.preventDefault();
    });        
    $('#boardDisplay').on('submit','#deleteReply', function(e) {
      var url = "/api/replies/"+currentBoard;
      $.ajax({
        type: "DELETE",
        url: url,
        data: $(this).serialize(),
        success: function(data) { 
          if(!alert(data) ){
            window.location.reload();
          }
        }
      });
      e.preventDefault();
    });              
  });