function initAboutBox(){

  $("#openAboutBox").click(function() { $("#about-box").show(); });
  $(".close-about-box").click(function() { $("#about-box").hide(); })

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target.id == "about-box") {
        $("#about-box").hide();
    }
  }
}
