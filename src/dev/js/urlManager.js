export default function urlManager() {

	// construct the api url
	const baseUrl = process.env.test
		? '//dev.apps.bostonglobe.com/'
		: '//www.bostonglobe.com/'

	return `${baseUrl}electionapi/reports?type=delegates`

}
