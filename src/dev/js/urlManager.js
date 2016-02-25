export default function urlManager(test) {

	// construct the api url
	const baseUrl = test
		? '//dev.apps.bostonglobe.com/'
		: '//www.bostonglobe.com/'

	return `${baseUrl}electionapi/reports?type=delegates`

}
