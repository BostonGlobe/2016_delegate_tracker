import { primaries2016Dates, primaries2016Candidates, standardize, Candidate, Candidates } from 'election-utils'
import getJSON from 'get-json-lite'
import { parse } from 'query-string'
import urlManager from './urlManager'
// import dom from './dom'

const test = true

function validateResponse(response) {

	return response && response.reports && response.reports.length

}

function onDataError(error) {

	console.error(error)

}

function getCandidateDelegateCount(candidate, states) {

	return states.filter(state => state.sId !== 'US').reduce((delegates, state) => {

		const c = state.Cand.find(cand => cand.cName.toLowerCase() === candidate.last)

		const totalCount = +c.dTot
		const superCount = +c.sdTot
		const pledgedCount = totalCount - superCount

		delegates.superCount += superCount
		delegates.pledgedCount += pledgedCount
		delegates.totalCount += totalCount

		return delegates

	}, { superCount: 0, pledgedCount: 0, totalCount: 0})

}


function onDataResponse(response) {

	if (validateResponse(response)) {

		const delsuper = response.reports.find(report => report.title.includes('delsuper'))

		const parties = delsuper.report.delSuper.del.map(p => {

			const party = standardize.expandParty(p.pId)
			const total = +p.dVotes
			const needed = +p.dNeed


			const validCandidate = c => {

				return c.party === party.toLowerCase() && !c.suspendedDate

			}

			const candidates = primaries2016Candidates.filter(validCandidate)
				.map(c => {

					const delegates = getCandidateDelegateCount(c, p.State)
					const last = c.last
					const first = c.first 

					return { first, last, delegates }

				})
				.sort((a, b) => b.delegates.totalCount - a.delegates.totalCount)


			return { party, total, needed, candidates }

		})

		console.log(parties)

	} else {

		onDataError('empty response')

	}

}

function fetchData() {

	// const response = {"delSum":{"Test":"0","timestamp":"2016-02-24T15:20:37Z","del":[{"pId":"Dem","dNeed":"2383","dVotes":"4765","dChosen":"751","dToBeChosen":"4014","Cand":[{"cId":"1746","cName":"Clinton","dTot":"503","d1":"0","d7":"+23","d30":"+146"},{"cId":"100004","cName":"Uncommitted","dTot":"178","d1":"+1","d7":"-1","d30":"-31"},{"cId":"1445","cName":"Sanders","dTot":"70","d1":"0","d7":"+15","d30":"+62"},{"cId":"22603","cName":"O'Malley","dTot":"0","d1":"0","d7":"0","d30":"-2"}]},{"pId":"GOP","dNeed":"1237","dVotes":"2472","dChosen":"132","dToBeChosen":"2340","Cand":[{"cId":"8639","cName":"Trump","dTot":"81","d1":"+14","d7":"+64","d30":"+81"},{"cId":"61815","cName":"Cruz","dTot":"17","d1":"+6","d7":"+6","d30":"+17"},{"cId":"53044","cName":"Rubio","dTot":"17","d1":"+7","d7":"+7","d30":"+17"},{"cId":"36679","cName":"Kasich","dTot":"6","d1":"+1","d7":"+1","d30":"+6"},{"cId":"1239","cName":"Bush","dTot":"4","d1":"0","d7":"0","d30":"+4"},{"cId":"64509","cName":"Carson","dTot":"4","d1":"+1","d7":"+1","d30":"+4"},{"cId":"60339","cName":"Fiorina","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"1187","cName":"Huckabee","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"60208","cName":"Paul","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"60051","cName":"Christie","dTot":"0","d1":"0","d7":"0","d30":"0"},{"cId":"1752","cName":"Santorum","dTot":"0","d1":"0","d7":"0","d30":"0"}]}]}}
	// onDataResponse(response)
	const url = urlManager(test)
	getJSON(url, onDataResponse, onDataError)

}

function init() {

	fetchData()

}

init()
