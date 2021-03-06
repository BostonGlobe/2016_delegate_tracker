import { primaries2016Candidates, standardize } from 'election-utils'
import getJSON from 'get-json-lite'
import { parse } from 'query-string'
import urlManager from './urlManager'
import dom from './dom'

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

function toPercent(x, shorten) {

	const decimalPlaces = shorten ? 0 : 2

	if (x === 1) {

		return '100'

	} else if (x === 0) {

		return '0'

	} else if (isNaN(x)) {

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

	// test
	// const total = candidate.last === 'sanders' ? 3200 : +dTot

	const total = +dTot
	const supers = +sdTot
	const pledged = total - supers

	return { total, supers, pledged }

}

function onDataError(error) {

	console.error(error)

}


function createPartyCandidates(p) {

	const party = standardize.expandParty(p.pId)
	const total = +p.dVotes
	const needed = +p.dNeed

	const validCandidate = c => c.party === party.toLowerCase() && !c.suspendedDate
	// const validCandidate = c => c.party === party.toLowerCase()

	const candidatesWithCounts = primaries2016Candidates.filter(validCandidate)
		.map(c => ({

			delegates: getCandidateDelegateCount(c, p.State),
			last: c.last,
			first: c.first,

		}))
		.sort((a, b) => b.delegates.total - a.delegates.total)

	const max = Math.max(candidatesWithCounts[0].delegates.total, needed)

	const candidates = candidatesWithCounts.map(c => ({

		...c,
		percent: {
			supers: toPercent(c.delegates.supers / max),
			pledged: toPercent(c.delegates.pledged / max),
			total: toPercent(c.delegates.total / max),
		},

	}))

	return { party, total, needed, max, candidates }

}

function filterByParams(p, options) {

	return options.find(option => {

		const optionP = option.partyAbbr.toLowerCase()
		const partyP = standardize.collapseParty(p.party).toLowerCase()

		return optionP === partyP

	})

}

function reduceByParams(f, options) {

	const partyOption = options.find(option => {

		const optionP = option.partyAbbr.toLowerCase()
		const partyP = standardize.collapseParty(f.party).toLowerCase()

		return optionP === partyP

	})

	f.others = f.candidates.slice(partyOption.max, f.candidates.length)
	f.candidates = f.candidates.slice(0, partyOption.max)

	return f

}

function onDataResponse(response) {

	if (validateResponse(response)) {

		const delsuper = response.reports.find(report => report.title.includes('delsuper'))

		const parties = delsuper.report.delSuper.del.map(createPartyCandidates)

		const options = getOptionsFromParams()

		// filter to parties from parameters
		const filtered = parties.filter(p => filterByParams(p, options))

		// truncate candidate list from parameters
		const reduced = filtered.map(f => reduceByParams(f, options))

		reduced.forEach(s => dom.createChart(s))

		dom.updatedTime(delsuper.updated)


	} else {

		onDataError('empty response')

	}

}

function fetchData() {

	const url = urlManager()
	getJSON(url, onDataResponse, onDataError)

}

function init() {

	fetchData()

}

init()
