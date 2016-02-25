import { primaries2016Dates, primaries2016Candidates, standardize, Candidate, Candidates } from 'election-utils'
import getJSON from 'get-json-lite'
import { parse } from 'query-string'
import urlManager from './urlManager'
// import dom from './dom'


function validateResponse(response) {

	return response && response.delSum && response.delSum.del && response.delSum.del.length

}

function onDataError(error) {

	console.error(error)

}

function onDataResponse(response) {

	if (validateResponse(response)) {

		const parties = response.delSum.del.map(p => {

			const party = standardize.expandParty(p.pId)
			const total = p.dVotes
			const needed = p.dNeed
			const chosen = p.dChosen
			const candidates = p.Cand.map(candidate => {

				const last = candidate.cName
				const votes = +candidate.dTot

				return { last, votes }

			})
			.filter(c => primaries2016Candidates.find(cd => c.last.toLowerCase() === cd.last))
			.filter(c => c.votes)
			.sort((a, b) => b.votes - a.votes)


			return { party, total, needed, chosen, candidates }

		})

		console.log(parties)

	} else {

		onDataError('empty response')

	}

}

function fetchData() {

	const response = {"delSum":{"Test":"0","timestamp":"2016-02-24T15:20:37Z","del":[{"pId":"Dem","dNeed":"2383","dVotes":"4765","dChosen":"751","dToBeChosen":"4014","Cand":[{"cId":"1746","cName":"Clinton","dTot":"503","d1":"0","d7":"+23","d30":"+146"},{"cId":"100004","cName":"Uncommitted","dTot":"178","d1":"+1","d7":"-1","d30":"-31"},{"cId":"1445","cName":"Sanders","dTot":"70","d1":"0","d7":"+15","d30":"+62"},{"cId":"22603","cName":"O'Malley","dTot":"0","d1":"0","d7":"0","d30":"-2"}]},{"pId":"GOP","dNeed":"1237","dVotes":"2472","dChosen":"132","dToBeChosen":"2340","Cand":[{"cId":"8639","cName":"Trump","dTot":"81","d1":"+14","d7":"+64","d30":"+81"},{"cId":"61815","cName":"Cruz","dTot":"17","d1":"+6","d7":"+6","d30":"+17"},{"cId":"53044","cName":"Rubio","dTot":"17","d1":"+7","d7":"+7","d30":"+17"},{"cId":"36679","cName":"Kasich","dTot":"6","d1":"+1","d7":"+1","d30":"+6"},{"cId":"1239","cName":"Bush","dTot":"4","d1":"0","d7":"0","d30":"+4"},{"cId":"64509","cName":"Carson","dTot":"4","d1":"+1","d7":"+1","d30":"+4"},{"cId":"60339","cName":"Fiorina","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"1187","cName":"Huckabee","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"60208","cName":"Paul","dTot":"1","d1":"0","d7":"0","d30":"+1"},{"cId":"60051","cName":"Christie","dTot":"0","d1":"0","d7":"0","d30":"0"},{"cId":"1752","cName":"Santorum","dTot":"0","d1":"0","d7":"0","d30":"0"}]}]}}
	onDataResponse(response)

}

function init() {

	fetchData()

}

init()
