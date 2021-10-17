$.fn.is_on_screen = function () {
  var win = $(window);
  var viewport = {
    top: win.scrollTop(),
    left: win.scrollLeft(),
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  var bounds = this.offset();
  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();

  return !(
    viewport.right < bounds.left ||
    viewport.left > bounds.right ||
    viewport.bottom < bounds.top ||
    viewport.top > bounds.bottom
  );
};

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  $("[data-youtube-viedo]").each(function () {
    var $this = $(this);
    var vidId = $this.attr("data-youtube-viedo");
    var elId = $this.attr("id");

    if (!elId) throw new Error("У элемента обязательно должен быть атрибут id");

    function onPlayerReady(event) {
      var newVideoObject = {};
      newVideoObject[elId] = event.target;
      window.wgYT = Object.assign(window.wgYT || {}, newVideoObject);
    }

    new YT.Player(elId, {
      height: "360",
      width: "640",
      videoId: vidId,
      events: {
        onReady: onPlayerReady,
      },
    });
  });
}

$(function () {
  $("[data-html-on-visible]").each(function () {
    var $this = $(this);
    if ($this.is_on_screen()) {
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

  // Купить билеты
  $('a[href^="#"]:not([data-no-anchor])').click(function (e) {
    var el = document.querySelector(this.attributes.href.nodeValue);
    if (el.scrollIntoView) {
      e.preventDefault();
      el.scrollIntoView();
    }
  });
});
