document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("myVideo");
  var overlay = document.querySelector(".video-overlay");

  var videoHeight = video.offsetHeight;
  var windowHeight = window.innerHeight;
  var maxScroll = document.body.offsetHeight - windowHeight;
  
  function updateVideo() {
    var scrollPercentage = (window.scrollY / maxScroll) * 100;
    overlay.style.opacity = 1 - scrollPercentage / 10;
  }
  
  window.addEventListener("scroll", updateVideo);
});

$(document).ready(function() {
  // Toggle the sidebar when the hamburger is clicked
  $(".hamburger").click(function() {
    $(".sidebar").toggleClass("open");
  });
});
$(document).ready(function() {
  var isAnimated = false;

  $(window).scroll(function() {
    if (!isAnimated) {
      var meetTeamOffset = $('.MeetTeam').offset().top;
      if ($(window).scrollTop() > meetTeamOffset - ($(window).height() / 2)) {
        $('.MATT').addClass('fade-in-animation').css('opacity', 1);
        setTimeout(function() {
          $('.Dazz').addClass('fade-in-animation').css('opacity', 1);
        }, 500); // Delay Dazz fade-in by 500 milliseconds
        isAnimated = true;
      }
    }
  });
});
