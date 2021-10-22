$.fn.is_on_screen = function () {
  var win = $(window);
  var viewport = {
    top: win.scrollTop(),
  };
  viewport.bottom = viewport.top + win.height();

  var bounds = this.offset();

  var isOnScreen = !(viewport.bottom < bounds.top - 500);

  return isOnScreen;
};

function chunkArray(array, size) {
  let result = [];
  for (value of array) {
    let lastArray = result[result.length - 1];
    if (!lastArray || lastArray.length == size) {
      result.push([value]);
    } else {
      lastArray.push(value);
    }
  }
  return result;
}

$(function () {
  $("[data-html-on-visible]").each(function () {
    var $this = $(this);
    var offsetTop = +$this.attr("data-offset-top") || 0;
    if ($this.is_on_screen({ offsetTop: offsetTop })) {
      $this.html($this.attr("data-html-on-visible"));
      return;
    }
    var onScroll = function () {
      if ($this.is_on_screen()) {
        $this.html($this.attr("data-html-on-visible"));
        $(window).off("scroll", onScroll);
      }
    };
    $(window).on("scroll", onScroll);
  });

  $('a[href^="#"]:not([data-no-anchor])').on("click", function (e) {
    var el = document.querySelector(this.attributes.href.nodeValue);
    if (el.scrollIntoView) {
      e.preventDefault();
      el.scrollIntoView();
    }
  });

  var $glitching = $(".wg-glitch");

  setInterval(function () {
    $glitching.toggleClass("wg-glitching");
  }, 2000);

  var $covidFree = $("#covid-free");

  $(window).on("scroll", function () {
    if (window.scrollY > 1000) {
      $covidFree.css("opacity", 0);
    } else {
      $covidFree.css("opacity", 1);
    }
  });
});
