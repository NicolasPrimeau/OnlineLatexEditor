//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 5000;  //time in ms (5 seconds)


$(function() {
    //on keyup, start the countdown
    $('#editor-area').keyup(function(){
        clearTimeout(typingTimer);
        if ($('#editor-area').val()) {
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        }
    });

    //user is "finished typing," do something
    function doneTyping () {
            $.ajax({
              type: "POST",
              contentType: "application/json; charset=utf-8",
              url:  ip + ":" + port + "/api/save_document",
              data: JSON.stringify({"text": $("#editor-area").val()
                                    }),
              success: function( data ) {
                    $("#status").empty();
                    $("#status").html("<p>Saved</p>");
                    $("#status p").fadeOut(2000);
                    load_pdf();
              }
            });
    }
 });


function load_pdf() {
    $("#pdf-viewer").empty();
    $("#pdf-viewer").html('<iframe src="' + ip + '/assets/bare_conf.pdf" id="pdf" ></iframe>');
 }