import dateFormat from 'dateformat'

const container = document.querySelector('.chart-container')

function numberWithCommas(x) {

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

}

function createCandidateElement(candidate) {

	const overHalf = candidate.percent.total > 50
	const halfClass = overHalf ? 'after-half' : 'before-half'
	const rightPos = overHalf ? `${(100 - candidate.percent.total).toFixed(2)}%` : 'auto'

	return `
		<li class='candidate'>
			<p class='candidate-name'>${candidate.last}</p>
			<div class='candidate-bar-container'>
				<span class='bar bar-pledged' style='width:${candidate.percent.pledged}%;'></span>
				<span class='bar bar-super' style='width:${candidate.percent.supers}%;'></span>
				<span class='bar bar-number ${halfClass}' style='right: ${rightPos};'>
					${numberWithCommas(candidate.delegates.total)}
				</span>
			</div>
		</li>
	`.trim()

}

function getPartyNote(p) {

	return p.party === 'Democratic'
	? `
		<ul class='dem-key'>
			<li class='key-pledged'>Pledged delegates</li>
			<li class='key-super'>Super delegates</li>
		</ul>
	`.trim()
	: p.others.length
		? `
			<p class='gop-note'>Other active candidates:
				${
					p.others
					.map(o => `<span class='name'>${o.last}</span> (${o.delegates.total})`)
					.join(', ')
				}
			</p>
		`.trim()
		: ''

}

function createChart(party) {

	const overNeeded = party.candidates[0].delegates.total > party.needed
	const neededClass = overNeeded ? 'over-needed' : 'under-needed'
	const rightPos = overNeeded ? `${(100 - (party.needed / party.max * 100)).toFixed(2)}%` : 'auto'

	const note = getPartyNote(party)

	const html = `
		<h3 class='party-name'>${party.party} delegates</h3>
		<p class='needed ${neededClass}' style='margin-right: ${rightPos};'>
			${numberWithCommas(party.needed)} needed to win
		</p>
		<ul class='candidates'>${party.candidates.map(createCandidateElement).join('')}</ul>
		<div class='note'>${note}</div>
	`.trim()

	const el = document.createElement('div')
	el.classList.add('chart')
	el.classList.add(`${party.party.toLowerCase()}`)
	el.innerHTML = html
	container.appendChild(el)

}

function updatedTime(str) {

	const d = new Date(str)

	const dateString = dateFormat(d, 'h:MM TT Z')

	const month = dateFormat(d, 'mmm. d')

	const output = `${month}&nbsp;&nbsp;${dateString}`

	document.querySelector('.intro-updated').classList.remove('transparent')
	document.querySelector('.updated-time').innerHTML = output

}

export default { createChart, updatedTime }
