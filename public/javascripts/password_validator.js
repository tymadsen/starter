var cpw,pw;
window.onload=function(){
  var cpw = document.getElementById("confirmPassword");
  var pw = document.getElementById("inputPassword");
  var err = document.getElementById("err_message");
  var msg;
  cpw.onblur = function(){
    if(cpw.value != pw.value){
      msg = "Your passwords do not match.";
    }else
      msg = "";

    err.innerHTML = msg;
  } 
}