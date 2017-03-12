!(function (name, definition) {
  var hasDefine = typeof define === 'function'
  var hasExports = typeof module === 'object' && module.exports

  if (hasDefine) {
    define(definition)
  } else if (hasExports) {
    module.exports = definition()
  } else {
    this[name] = definition()
  }
})('$', function () {
  function $(selector, context) {
    context = context || document
    return context.querySelector(selector)
  }

  $.$ = function (selector, context) {
    if (typeof selector === 'string') {
      context = context || document
      var elements = context.querySelectorAll(selector)
      return [].slice.call(elements)
    }
    else {
      return [].slice.call(selector)
    }
  }

  /* https://gist.github.com/joshcanhelp/a3a669df80898d4097a1e2c01dea52c1 */
  $.scrollToPos = function (scrollTo, scrollDuration) {
    if (typeof scrollTo === 'string') {
      var target = document.querySelector(scrollTo)
      if (target) {
        scrollTo = window.pageYOffset + target.getBoundingClientRect().top
      }
      else {
        throw 'error: No element found with the selector "' + scrollTo + '"'
      }
    }
    else if (typeof scrollTo !== 'number') {
      scrollTo = 0
    }
    if (typeof scrollDuration !== 'number' || scrollDuration < 0) {
      scrollDuration = 500
    }
    var distanceSum = window.pageYOffset - scrollTo
    var start = null

    function step(timestamp) {
      if (!start) {
        start = timestamp
        requestAnimationFrame(step)
        return
      }
      var percent = Math.min(1, (timestamp - start) / scrollDuration)
      var distance = (1 - percent) * distanceSum
      var moveStep = scrollTo + distance
      window.scrollTo(0, moveStep)
      if (percent < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }
  return $
})

/* ================ Util END ================== */

/* sw */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function (reg) {
      console.log('Registration succeeded. Scope is ' + reg.scope)
    }).catch(function (error) {
      console.log('Registration failed with ' + error)
    })
}

!(function ($, $$) {
  /* add table-wrapper */
  $.$('.post-content>table').forEach(function (table) {
    var div = document.createElement("div")
    div.className = "_table-wrapper"
    var range = document.createRange()
    range.selectNode(table)
    range.surroundContents(div)
  })


  /* back to top */
  var topBtn = $('[data-js-backtotop]')
  var backToTop = function () {
    if (window.pageYOffset > 100) {
      topBtn.classList.add('show')
    } else {
      topBtn.classList.remove('show')
    }
  }
  backToTop()
  window.addEventListener('scroll', backToTop)
  topBtn.addEventListener('click', $.scrollToPos)

  /* toc scroll */
  $$('.toc li a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault()
      var hash = this.hash
      $.scrollToPos(hash)
      window.location.hash = hash
    }, false)
  })
})(this.$, this.$.$)
