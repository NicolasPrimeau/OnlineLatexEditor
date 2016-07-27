
window.setInterval(function(){
    $.ajax({url: ip + ":" + port + "/api/pdf_changed",
        type: 'GET',
        dataType: 'text',
        contentType: "application/json",
            success: function(data) {
                console.log(data);
                data = JSON.parse(data);
                if (data["changed"] == true) {
                    $("#pdf-viewer").empty();
                    $("#pdf-viewer").html('<iframe src="' + ip + '/assets/bare_conf.pdf" id="pdf" ></iframe>');
                }
              },  cache: false});
}, 2000);

