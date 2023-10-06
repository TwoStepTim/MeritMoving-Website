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

  // Function to check if the device is a mobile device
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // Function to play the video on mobile devices
  function playVideoOnMobile() {
    const video = document.getElementById("myVideo");

    // Check if the device is mobile and the video exists
    if (isMobileDevice() && video) {
      // Play the video
      video.play().catch(function(error) {
        // Handle any errors if video cannot be played
        console.error("Video playback error:", error);
      });
    }
  }

  // Trigger video playback on page load
  window.addEventListener("load", playVideoOnMobile);

