
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const baseUrl = "http://laceliah.cowblog.fr/"


process.setMaxListeners(Infinity)



const getDataFromUrl = async url => {

	console.log('getDataFromUrl url => ', url)

	// 1 - Créer une instance de navigateur
	// const browser = await puppeteer.launch({ headless: false })
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	// Config du timeout
    await page.setDefaultNavigationTimeout(0);
	await page.goto(url)
	// await page.setViewport({ width: 1000, height: 500 })
	// Faire une pause d'une seconde
	await page.waitFor(1000) 
	//await page.waitForNavigation()


	console.log('page ' + url + ' est chargée');


	const titles = await page.$$('.article-top > .left');
	for (let i = 0; i < titles.length; i++) {
		const title = await (await titles[i].getProperty('innerText')).jsonValue()
		// console.log(title)
	}

	const bodys = await page.$$('.article-body')
	for (let i = 0; i < bodys.length; i++) {
		const body = await (await bodys[i].getProperty('innerText')).jsonValue()
		// console.log(body)
	}

	let imagefiles = await page.evaluate(() =>
	    Array.from(
	      document.querySelectorAll('#main img'),
	      img => img.src
	    )
	)

	console.log('Images => ', imagefiles)


	

	/*const text = await page.evaluate(() => {
		Array.from(document.querySelectorAll('.article-top'), element => element.textContent)
	});*/



/*	const eval = await page.evaluate(() => {
		let title = document.querySelector('.article-top').innerText

		

		console.log('Ici le nom de l\'article => ', title)

		return text
	})*/

	console.log('<===================' + url + '========================>')

	browser.close()
	return titles


}

// Telecharge les fichiers dans un dossier
const downloadDatas = async datas => {
	let download = false
	if(download) return true

}

// Génère toutes les urls à scrapp
const getAllUrls = async baseUrl => {

	const urlList = [];
	for( let i = 1; i < 2; i++){
		urlList.push(baseUrl + i + ".html");
	}
	return urlList;
}


const scrap = async() => {

	const urlList = await getAllUrls(baseUrl)
	const results = await Promise.all(
		urlList.map(url => getDataFromUrl(url)),
	)


	//console.log(urls)

	console.log('scrappp')
	return results
}


//const urls = getAllUrls(url)

scrap().then( value => {
	// console.log(value)
	console.log('fin script')
}).catch(error => {
	console.log(error)
})
//console.log(urls)
//getData()







