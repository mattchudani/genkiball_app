

function changemap() {
  
  var map = document.getElementById("map");
  var trf = false;
  console.log(user.textContent);
  if (trf == false) {
    trf = true;
    map.setAttribute("src", "https://www.arcgis.com/apps/Embed/index.html?webmap=8e1101a136704fc4887e84cae4c1b920&extent=-158.0473,21.2527,-157.7105,21.4193&zoom=true&previewImage=false&scale=true&legendlayers=true&disable_scroll=true&theme=light");
  } else {
    trf = false;
    map.setAttribute("src", "https://www.arcgis.com/apps/Embed/index.html?webmap=039cda4f2a724d68a9d170a19c0ec949&extent=-157.8472,21.2731,-157.8051,21.2939&zoom=true&previewImage=false&scale=true&legendlayers=true&disable_scroll=true&theme=light");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var user = document.getElementById("user");
  var sign = document.getElementById("sign");
  var join = document.getElementById("join");
  var account = document.getElementById("account");
  if (user.innerText != "") {
    console.log(user.innerText);
    sign.style.visibility = "hidden";
    join.style.visibility = "hidden";
    account.style.visibility = "visible";
  } else {
    console.log(user.innerText);
    sign.style.visibility = "visible";
    join.style.visibility = "visible";
    account.style.visibility = "hidden";
  }
});


