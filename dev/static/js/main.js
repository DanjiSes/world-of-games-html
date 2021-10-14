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

$(function () {
  $(".js-scroll").on("click", function (event) {
    //отменяем стандартную обработку нажатия по ссылке
    event.preventDefault();
    //забираем идентификатор бока с атрибута href
    var id = $(this).attr("href");
    //узнаем высоту от начала страницы до блока на который ссылается якорь
    var top = $(id).offset().top;
    //анимируем переход на расстояние - top за 1500 мс
    $("body,html").animate({ scrollTop: top }, 1300);
  });

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
});
