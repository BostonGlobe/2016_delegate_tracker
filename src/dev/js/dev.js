import { primaries2016Dates, primaries2016Candidates, standardize, Candidate, Candidates } from 'election-utils'
import getJSON from 'get-json-lite'
import { parse } from 'query-string'
import urlManager from './urlManager'
import dom from './dom'

const test = true

function toPercent(x, shorten) {

	const decimalPlaces = shorten ? 0 : 2

	if (x === 1) {

		return '100'

	} else if (x === 0) {

		return '0'

	} else if(isNaN(x)) {

		return '0'

	}

	return (100 * x).toFixed(decimalPlaces).toString()

}

function validateResponse(response) {

	return response && response.reports && response.reports.length

}

function getOptionsFromParams() {

	const parsed = parse(window.location.search)
	const parties = parsed.options.split(',')
	return parties.map(party => {

		const split = party.split('-')
		const partyAbbr = split[0]
		const max = +split[1]

		return { partyAbbr, max }

	})

}

function getCandidateDelegateCount(candidate, states) {

	const cands = states.find(state => state.sId === 'US').Cand

	const cand = cands.find(c => c.cName.toLowerCase() === candidate.last)

	const { dTot, sdTot } = cand

	const totalCount = +dTot
	const superCount = +sdTot
	const pledgedCount = totalCount - superCount

	return { totalCount, superCount, pledgedCount }

	// return states.filter(state => state.sId !== 'US').reduce((delegates, state) => {

	// 	const c = state.Cand.find(cand => cand.cName.toLowerCase() === candidate.last)

	// 	const totalCount = +c.dTot
	// 	const superCount = +c.sdTot
	// 	const pledgedCount = totalCount - superCount

	// 	delegates.superCount += superCount
	// 	delegates.pledgedCount += pledgedCount
	// 	delegates.totalCount += totalCount

	// 	return delegates

	// }, { superCount: 0, pledgedCount: 0, totalCount: 0})

}

function onDataError(error) {

	console.error(error)

}

function onDataResponse(response) {

	if (validateResponse(response)) {

		const delsuper = response.reports.find(report => report.title.includes('delsuper'))

		const parties = delsuper.report.delSuper.del.map(p => {

			const party = standardize.expandParty(p.pId)
			const total = +p.dVotes
			const needed = +p.dNeed


			const validCandidate = c => c.party === party.toLowerCase() && !c.suspendedDate

			const candidates = primaries2016Candidates.filter(validCandidate)
				.map(c => {

					const delegates = getCandidateDelegateCount(c, p.State)
					const last = c.last
					const first = c.first
					const percentSuper = toPercent(delegates.superCount / total)
					const percentPledged = toPercent(delegates.pledgedCount / total)

					return { first, last, delegates, percentSuper, percentPledged }

				})
				.sort((a, b) => b.delegates.totalCount - a.delegates.totalCount)


			return { party, total, needed, candidates }

		})

		const options = getOptionsFromParams()

		// only party if in params
		const filtered = parties.filter(p => {

			return options.find(option =>  {

				const optionP = option.partyAbbr.toLowerCase()
				const partyP = standardize.collapseParty(p.party).toLowerCase()

				return optionP === partyP

			})

		})

		// truncate candidates
		const reduced = filtered.map(f => {

			const partyOption = options.find(option => {
				const optionP = option.partyAbbr.toLowerCase()
				const partyP = standardize.collapseParty(f.party).toLowerCase()

				return optionP === partyP
			}) 

			f.candidates = f.candidates.slice(0, partyOption.max)

			return f

		}) 

		reduced.forEach(s => dom.createChart(s))


	} else {

		onDataError('empty response')

	}

}

function fetchData() {

	const url = urlManager(test)
	getJSON(url, onDataResponse, onDataError)

}

function init() {

	fetchData()

}

init()
