

$("#submit").click(submit);

function submit(){
  var user = $("#user").val();
  var pass = $("#pass").val();

  if(user === "" || pass === ""){
    $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
    $("#alert").text("USERNAME OR PASSWORD CANNOT BE EMPTY");
  }
  else{
    $.ajax({
      url: "/login",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        user: user,
        pass: pass,
      }),
      success:(response)=>{
        if(response.response === "match"){
          window.location.href="/home";
        }
        else{
          $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
          $("#alert").text("WRONG USERNAME OR PASSWORD");
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
        $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
        $("#alert").text("SOMETHING WENT WRONG");
      }
    });
  }
}
