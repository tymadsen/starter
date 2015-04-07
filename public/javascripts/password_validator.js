var cpw,pw;
window.onload=function(){
  var cpw = document.getElementById("confirmPassword");
  var pw = document.getElementById("inputPassword");
  var err = document.getElementById("err_message");
  var msg;
  cpw.onblur = function(){
    var parent = err.parentElement;
    var c = "form-group";
    if(cpw.value != pw.value){
      msg = "Your passwords do not match.";
      c = parent.getAttribute('class')+" has-error";
    }else
      msg = "";
    parent.setAttribute('class',c);
    err.innerHTML = msg;
  } 
}