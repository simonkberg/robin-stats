
import { ClassNames, Keys, Values } from './constants'
import { map, each, collectionToArray } from './helpers'
import createWidget from './createWidget'

const stats = {
  [Keys.STATS_TOTAL]: 0,
  [Keys.STATS_AWAY]: 0,
  [Keys.STATS_STAY]: 0,
  [Keys.STATS_GROW]: 0,
  [Keys.STATS_NONE]: 0,
  [Keys.STATS_ABANDON]: 0
}

const statsClasses = {
  [Keys.STATS_AWAY]: ClassNames.STATUS_AWAY,
  [Keys.STATS_STAY]: ClassNames.VOTE_STAY,
  [Keys.STATS_GROW]: ClassNames.VOTE_GROW,
  [Keys.STATS_NONE]: ClassNames.VOTE_NONE,
  [Keys.STATS_ABANDON]: ClassNames.VOTE_ABANDON
}

const $el = {}
const $robinChat = document.getElementById('robinChat')

if ($robinChat) {
  init($robinChat)
} else {
  document.body.addEventListener('DOMSubtreeModified', chatLoaded)
}

function chatLoaded () {
  const $robinChat = document.getElementById('robinChat')

  if ($robinChat) {
    document.body.removeEventListener('DOMSubtreeModified', chatLoaded)

    init($robinChat)
  }
}

function init ($robinChat) {
  $el.robinChat = $robinChat
  $el.sidebar = document.getElementsByClassName('robin-chat--sidebar')[0]
  $el.userList = document.getElementById('robinUserList')
  $el.voteWidget = document.getElementById('robinVoteWidget')
  $el.voteButtonGrow = $el.voteWidget.querySelector(`button[value="${Values.VOTE_GROW}"]`)
  $el.voteButtonStay = $el.voteWidget.querySelector(`button[value="${Values.VOTE_STAY}"]`)
  $el.voteButtonAbandon = $el.voteWidget.querySelector(`button[value="${Values.VOTE_ABANDON}"]`)

  $el.statsWidget = document.createElement('div')
  $el.statsWidget.id = 'robinUserStats'
  $el.statsWidget.className = 'robin-chat--sidebar-widget robin-chat--stats-widget'

  each(createWidget, (func, key) => {
    $el.statsWidget.appendChild(func(stats))
  })

  $el.statsCounts = {}

  each(stats, (value, key) => {
    $el.statsCounts[key] = $el.statsWidget.querySelector(`span[data-key="${key}"]`)
  })

  $el.autoWidget = document.createElement('div')
  $el.autoWidget.id = 'robinAutoVote'
  $el.autoWidget.className = 'robin-chat--sidebar-widget robin-chat--auto-widget'

  $el.autoLabel = document.createElement('label')
  $el.autoInput = document.createElement('input')
  $el.autoLabelText = document.createTextNode('Remember vote (Auto Vote)')

  $el.autoInput.type = 'checkbox'
  $el.autoInput.name = 'robin-auto-vote'
  $el.autoInput.checked = getAutoVote()

  $el.autoLabel.appendChild($el.autoInput)
  $el.autoLabel.appendChild($el.autoLabelText)
  $el.autoWidget.appendChild($el.autoLabel)

  $el.sidebar.insertBefore($el.statsWidget, $el.userList)
  $el.sidebar.insertBefore($el.autoWidget, $el.statsWidget)

  updateStats()

  if (getAutoVote()) {
    updateVote()

    $el.voteWidget.addEventListener('DOMSubtreeModified', updateVote)
  }

  $el.userList.addEventListener('DOMSubtreeModified', updateStats)
  $el.autoInput.addEventListener('change', setAutoVote)
  $el.voteButtonGrow.addEventListener('click', setVote)
  $el.voteButtonStay.addEventListener('click', setVote)
  $el.voteButtonAbandon.addEventListener('click', setVote)
}

function updateStats () {
  const $children = collectionToArray($el.userList.children)
  const newStats = map(stats, () => 0)

  newStats[Keys.STATS_TOTAL] = $children.length

  $children.forEach(($child, index) => {
    let { classList } = $child

    each(statsClasses, (className, key) => {
      if (classList.contains(className)) {
        newStats[key]++
      }
    })
  })

  each(newStats, (value, key) => {
    if (value !== stats[key]) {
      if (key === Keys.STATS_NONE) {
        $el.statsCounts[key].innerText = newStats[Keys.STATS_TOTAL] - value
      } else {
        $el.statsCounts[key].innerText = value
      }

      stats[key] = value
    }
  })
}

function updateVote () {
  const $buttons = collectionToArray($el.voteWidget.getElementsByTagName('button'))
  const $button = $buttons.find(($button) => $button.value === getVote())

  if ($button) {
    $button.click()
  }
}

function checkVote () {
  const $button = $el.voteWidget.getElementsByClassName('robin--active')[0]

  if ($button) {
    $button.click()
  }
}

function setAutoVote (event) {
  const checked = !!event.target.checked

  if (checked) {
    checkVote()

    $el.voteWidget.addEventListener('DOMSubtreeModified', updateVote)
  } else {
    $el.voteWidget.removeEventListener('DOMSubtreeModified', updateVote)
  }

  localStorage.setItem('robinStats.autoVote', checked)
}

function getAutoVote (event) {
  return !!localStorage.getItem('robinStats.autoVote')
}

function setVote (event) {
  localStorage.setItem('robinStats.vote', event.target.parentNode.value)
}

function getVote (event) {
  return localStorage.getItem('robinStats.vote')
}
