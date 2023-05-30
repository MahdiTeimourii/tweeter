/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const createTweetElement = (tweetObj) => {
  const { user, content, created_at } = tweetObj;
  const newTweet = `
    <article>
      <header class="tweet-header">
        <div>
          <img src="${user.avatars}" />
          <span>${user.name}</span>
        </div>
        <div>
          <span>${user.handle}</span>
        </div>
      </header>
      <div>
        <span>${escape(content.text)}</span>
      </div>
      <footer class="tweet-foot">
        <div>
          <span>${moment(created_at).fromNow()}</span>
        </div>
        <div class="tweet-reactions">
          <span><i class="fas fa-flag icon" ></i> <i class="fas fa-retweet icon"></i> <i class="fas fa-heart icon"></i></span>
        </div>
      </footer>
    </article>
  `;
  return newTweet;
};

// Function to render an array of tweet objects
const renderTweets = (arrayOfTweetObj) => {
  const $tweetContainer = $('.tweet-container');
  for (const tweetObj of arrayOfTweetObj) {
    $tweetContainer.prepend(createTweetElement(tweetObj));
  }
};

// Function to render the last tweet in an array of tweet objects
const renderLastTweet = (arrayOfTweetObj) => {
  const lastTweet = arrayOfTweetObj[arrayOfTweetObj.length - 1];
  $('.tweet-container').prepend(createTweetElement(lastTweet));
};

// Function to make a POST request using AJAX
const ajaxPost = (url, data, callback) => {
  $.post(url, data, callback);
};

// Function to extract the text from a query string
const getText = (queryString) => {
  return decodeURIComponent(queryString.slice(5));
};

// Function to reset the error message based on a violation type
const resetErrorMessage = (violation) => {
  const $errorMessage = $('.error-message');
  if (violation === 'over count') {
    $errorMessage.empty().append("<p>Please limit Your tweet to 140 characters!</p>").slideDown("slow");
    $('textarea').focus();
  } else if (violation === 'empty') {
    $errorMessage.empty().append("<p>Cmon...tell us something intreseting</p>").slideDown("slow");
    $('textarea').focus();
  } else {
    $errorMessage.hide().empty();
    $('textarea').focus();
  }
};

$(document).ready(() => {
  // Dynamically adjust the textarea height based on content
  $('textarea').on('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // Fetch initial tweets on page load
  $.get('/tweets', renderTweets);

  // Hide the new tweet form initially
  $('.new-tweet').hide();

  // Toggle the new tweet form when the "Write" button is clicked
  $('.write').click((event) => {
    $('.new-tweet').slideToggle('slow');
    $('textarea').focus();
  });

  // Handle form submission for creating a new tweet
  $('.display button').click((event) => {
    event.preventDefault();
    const data = $('form').serialize();
    const dataLength = getText(data).length;

    if (dataLength > 140) {
      resetErrorMessage('over count');
    } else if (dataLength === 0) {
      resetErrorMessage('empty');
    } else {
      resetErrorMessage();
      $('.counter').text("140")
      ajaxPost('/tweets', data, () => {
        // Fetch and render the last tweet
        $.get('/tweets', renderLastTweet);
        $('textarea').val("");
      });
      $(this)
        .closest(".new-tweet")
        .find(".counter")
        .addClass("counter")
        .text(140);
    }
  });
});

// Function to escape HTML entities in a string
const escape = (str) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
