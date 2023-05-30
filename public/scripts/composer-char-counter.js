$(document).ready(function () {

  $('textarea').on('input', function () {
    // Calculate the length of the input text
    var inputLength = $(this).val().length;
    var container = $(this).closest('.new-tweet')
    console.log(container)
    // Find the counter element within the closest '.new-tweet' parent
    var counter = $(this).closest('.new-tweet').find('.counter');
    // Update the counter text to display the remaining characters
    counter.text(140 - inputLength);

    // Check if the input length exceeds the character limit (140)
    if (inputLength > 140) {
      // If the input is too long, add the 'invalid' class to the counter element
      counter.addClass('error');
    } else {
      // If the input is within the limit, remove the 'invalid' class from the counter element
      counter.removeClass('error');
    }
  });
});
