$(document).ready(function () {
  $('.new-tweet textarea').on('input', function () {
    var inputLength = $(this).val().length;
    var counter = $(this).closest('.new-tweet').find('counter');
    counter.text(140 - inputLength);
    if (inputLength > 140) {
      counter.addClass('invalid');
    } else {
      counter.removeClass('invalid');
    }
  });
});
