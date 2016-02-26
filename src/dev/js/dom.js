// import { standardize, primaries2016Dates } from 'election-utils'

const container = document.querySelector('.chart-container')

function createCandidateElement(candidate) {

	return `
		<li class='candidate'>
			<p class='candidate-name'>${candidate.last}</p>
			<div class='candidate-bar-container'>
				<span class='bar bar-pledged' style='width:${candidate.percentPledged}%;'></span>
				<span class='bar bar-super' style='width:${candidate.percentSuper}%;'></span>
				<span class='bar bar-number'>${candidate.delegates.totalCount}</span>
			</div>
		</li>
	`.trim()

}

function createChart(party) {

	const html = `
		<h3 class='party-name'>${party.party}</h3>
		<ul class='candidates'>${party.candidates.map(createCandidateElement).join('')}</ul>
		<p class='needed'>${party.needed} needed to win</p>
	`.trim()

	const el = document.createElement('div')
	el.classList.add('chart')
	el.classList.add(`${party.party.toLowerCase()}`)
	el.innerHTML = html
	container.appendChild(el)

}

export default { createChart }
