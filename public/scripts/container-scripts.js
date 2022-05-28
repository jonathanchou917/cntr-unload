var fd = new FormData();
if(fd.has("cntrImg")){
  fd.delete("cntrImg");
}


//previews the file
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#imgPreview').attr('src', e.target.result);
      //console.log(e.target.result);
    }
    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}

function reload(){
  location.reload();
}


//fires this event when the file is changed
$("#cntrImg").change(function() {
  readURL(this);
  if( fd.has("cntrImg") ){
    fd.delete("cntrImg");
  }
  fd.append("cntrImg",this.files[0]);
});

$("#update").click(submit);

function submit(){
  var cntrNo = $("#cntrNo").text();
  var fileExt=$("#cntrImg").val().split(".").pop();
  if(fileExt==="pdf" || fileExt==="jpg" || fileExt==="jpeg" || fileExt==="png"){
    $.ajax({
      url: "/container/"+cntrNo,
      type: "POST",
      contentType: "application/json",
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      success:(response)=>{
        if(response.response==="success"){
          reload();
          //setTimeout(reload,1000);
        }
        else if(response.response==="errorReg"){

        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
    });
  }
}

$("#updateDtls").click(submitDtls);

function submitDtls(){
  var cntrNo = $("#cntrNo").text();
  var numOfProdRow = $(".prod-row").length;
  var prodList = [];

  for(var i = 0; i < numOfProdRow; i++){
    var prodId = $("#prodId"+i).text().trim();
    var actual = $("#actual"+i).val();
    if(actual == ""){
      actual = 0;
    }

    prodList.push({
      cntrNo:cntrNo,
      prodId: prodId,
      actual:actual
    });
  }

  $.ajax({
    url: "/container/"+cntrNo+"/details",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      prodList:prodList
    }),
    success:(response)=>{
      if(response.response === "success"){
        reload();
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
  });
}
