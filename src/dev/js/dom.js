// import { standardize, primaries2016Dates } from 'election-utils'

const container = document.querySelector('.chart-container')

function createCandidateElement(candidate) {

	return `
		<li class='candidate'>
			<p class='candidate-name'>${candidate.last}</p>
			<div class='bars'>
				<div class='bar bar-pledged' style='width:${candidate.percentPledged}%;'></div>
				<div class='bar bar-super' style='width:${candidate.percentSuper}%;'></div>
				<div class='needed-marker'></div>
			</div>
		</li>
	`.trim()

}

function createChart(party) {

	const html = `
		<h3 class='party-name'>${party.party}</h3>
		<ul class='candidates'>${party.candidates.map(createCandidateElement).join('')}</ul>
	`.trim()

	const el = document.createElement('div')
	el.innerHTML = html
	container.appendChild(el)

}

export default { createChart }
