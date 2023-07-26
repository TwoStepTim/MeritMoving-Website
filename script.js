document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("myVideo");
  var overlay = document.querySelector(".video-overlay");

  var videoHeight = video.offsetHeight;
  var windowHeight = window.innerHeight;
  var maxScroll = document.body.offsetHeight - windowHeight;
  
  function updateVideo() {
    var scrollPercentage = (window.scrollY / maxScroll) * 100;
    overlay.style.opacity = 1 - scrollPercentage / 50;
  }
  
  window.addEventListener("scroll", updateVideo);
});

$(document).ready(function() {
  // Toggle the sidebar when the hamburger is clicked
  $(".hamburger").click(function() {
    $(".sidebar").toggleClass("open");
  });
});
