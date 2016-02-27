const container = document.querySelector('.chart-container')

function numberWithCommas(x) {

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

}

function createCandidateElement(candidate) {

	const overHalf = candidate.percent.total > 50
	const halfClass = overHalf ? 'after-half' : 'before-half'
	const rightPos = overHalf ? (100 - candidate.percent.total).toFixed(2) : 'auto'

	return `
		<li class='candidate'>
			<p class='candidate-name'>${candidate.last}</p>
			<div class='candidate-bar-container'>
				<span class='bar bar-pledged' style='width:${candidate.percent.pledged}%;'></span>
				<span class='bar bar-super' style='width:${candidate.percent.supers}%;'></span>
				<span class='bar bar-number ${halfClass}' style='right: ${rightPos}%;'>
					${numberWithCommas(candidate.delegates.total)}
				</span>
			</div>
		</li>
	`.trim()

}

function createChart(party) {

	const html = `
		<h3 class='party-name'>${party.party}</h3>
		<ul class='candidates'>${party.candidates.map(createCandidateElement).join('')}</ul>
		<p class='needed'>${numberWithCommas(party.needed)} needed to win</p>
	`.trim()

	const el = document.createElement('div')
	el.classList.add('chart')
	el.classList.add(`${party.party.toLowerCase()}`)
	el.innerHTML = html
	container.appendChild(el)

}

function updatedTime(str) {

	const d = new Date(str)
	const dateFull = d.toDateString()
	const dateSplit = dateFull.split(' ')
	const dateStr = dateSplit.slice(1, dateSplit.length - 1).join(' ')

	const timeFull = d.toLocaleTimeString()
	const timeSplit = timeFull.split(' ')
	const timeSplitColon = timeSplit[0].split(':')
	const timeStr = `${timeSplitColon.slice(0, 2).join(':')} ${timeSplit[1]}`

	const output = `${dateStr} ${timeStr}`

	document.querySelector('.intro-updated').classList.remove('transparent')
	document.querySelector('.updated-time').textContent = output

}

export default { createChart, updatedTime }
