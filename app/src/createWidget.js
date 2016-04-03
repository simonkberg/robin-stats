
import { ClassNames, Keys } from './constants'

export function createStatsWidget (className, text) {
  const $widget = document.createElement('div')
  const $icon = document.createElement('span')
  const $status = document.createElement('span')

  $widget.className = `robin-room-stats ${className}`
  $icon.className = ClassNames.ICON
  $status.className = ClassNames.STATUS
  $status.innerHTML = text

  $widget.appendChild($icon)
  $widget.appendChild($status)

  return $widget
}

const createWidget = {
  [Keys.STATS_TOTAL]: function (stats) {
    return createStatsWidget(
      ClassNames.STATS_COUNT,
      `Total Users: <span data-key="${Keys.STATS_TOTAL}">${stats.total}</span>
      (<span data-key="${Keys.STATS_NONE}">${stats.total - stats.none}</span> Voted)`
    )
  },

  [Keys.STATS_GROW]: function (stats) {
    return createStatsWidget(
      `${ClassNames.STATS_GROW} ${ClassNames.VOTE_GROW}`,
      `Grow: <span data-key="${Keys.STATS_GROW}">${stats.grow}</span>`
    )
  },

  [Keys.STATS_STAY]: function (stats) {
    return createStatsWidget(
      `${ClassNames.STATS_STAY} ${ClassNames.VOTE_STAY}`,
      `Stay: <span data-key="${Keys.STATS_STAY}">${stats.stay}</span>`
    )
  },

  [Keys.STATS_ABANDON]: function (stats) {
    return createStatsWidget(
      `${ClassNames.STATS_ABANDON} ${ClassNames.VOTE_ABANDON}`,
      `Abandon: <span data-key="${Keys.STATS_ABANDON}">${stats.abandon}</span>`
    )
  },

  [Keys.STATS_AWAY]: function (stats) {
    return createStatsWidget(
      `${ClassNames.STATS_AWAY} ${ClassNames.STATUS_AWAY}`,
      `Users Away: <span data-key="${Keys.STATS_AWAY}">${stats.away}</span>`
    )
  }
}

export default createWidget
