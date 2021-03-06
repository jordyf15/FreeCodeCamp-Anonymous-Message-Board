$(function(){
    var boardListFill=[];
    $.ajax({
        type: 'GET',
        url: '/api/boards',
        success:function(data){
            data.forEach((ele)=>{
                var boardHtml='<div class="boards"><h2>'+ele.boardName+'</h2>'
                    +'<h3>'+ele._id+'</h3>'+
                    '<button id="viewBoard" value='+ele.boardName+'>View Board</button>'+
                    '<form id="deleteBoard">'+
                    '<input type="hidden" name="board_id" value='+ele._id+'>'
                    +'<input type="text" placeHolder="password to delete" name="delete_password">'+
                    '<button type="submit" class="deleteBoard">Delete</button> </form>'+
                    '<button id="reportBoard" value='+ele._id+'>Report</button>'
                    +'</div>'
                boardListFill.push(boardHtml);
            })
            boardListFill.join('');
            $('#boardList').html(boardListFill);
        }
    })
    $('#newBoard').on('submit',function(event){
        $.ajax({
            url: '/api/boards',
            type: 'POST',
            data: $(this).serialize(),
            success: function (data){
                if(!alert(data)){
                    window.location.reload();
                }
            }
        })
        event.preventDefault();
    })
    $('#boardList').on('submit','#deleteBoard',function(event){
        $.ajax({
            url: '/api/boards',
            type:'DELETE',
            data: $(this).serialize(),
            success: function(data){
                if(!alert(data)){
                    window.location.reload();
                }
            }
        })
        event.preventDefault();
    })
    $('#boardList').on('click','#viewBoard',function(event){
        window.location='/b/'+$(this).val();
    })
    $('#boardList').on('click','#reportBoard',function(event){
        $.ajax({
            url: '/api/boards',
            type: 'put',
            data: {board_id: $(this).val()},
            success: function(data){
                if(!alert(data)){
                    window.location.reload();
                }
            }
        })
        event.preventDefault();
    })
})