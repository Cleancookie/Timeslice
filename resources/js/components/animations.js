// Dependencies
const $ = require('jquery')

let loadingCounter = 0

module.exports.loading = function(isLoading) {
  if (isLoading) {
    loadingCounter++
  } else {
    loadingCounter--
  }

  if (loadingCounter == 0) {
    setTimeout(() => {
      $('[data-loading-bar]').fadeOut(200)
    }, 350)
  } else {
    $('[data-loading-bar]').fadeIn(200)
  }
}
