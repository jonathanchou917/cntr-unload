


$("#register").click(register);

function register(){
  var newUser = $("#newUser").val();
  var newPass = $("#newPass").val();
  var newPassConfirm = $("#newPassConfirm").val();

  if(newUser === "" || newPass === "" || newPassConfirm === ""){
    $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
    $("#alert").text("NEW USERNAME AND/OR NEW PASSWORD CANNOT BE EMPTY");
  }
  else{
    if(newPass != newPassConfirm){
      $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
      $("#alert").text("PASSWORDS DO NOT MATCH");
    }
    else{
      $.ajax({
        url: "/register",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          newUser: newUser,
          newPass: newPass,
        }),
        success:(response)=>{
          if(response.response==="success"){
            window.location.href="/";
          }
          else if(response.response === "exists"){
            $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
            $("#alert").text("USERNAME ALREADY EXISTS");
          }
          else{
            $("#alert").addClass("alert alert-danger mb-3 d-flex justify-content-center text-center");
            $("#alert").text("SOMETHING WENT WRONG");
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
}
