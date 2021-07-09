
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const downloadImg = require('./downloadImg')
const mkdirp = require("mkdirp");

const baseUrl = "http://laceliah.cowblog.fr/"


process.setMaxListeners(Infinity)


// Génère toutes les urls à scrapp
const getAllUrls = async baseUrl => {
	const urlList = [];
	for( let i = 2; i < 3; i++){
		urlList.push(baseUrl + i + ".html");
	}
	return urlList;
}



// Récupère les données (titre, body, images) d'une page web
const getallDatas = async url => {

	console.log('getDataFromUrl url => ', url)

	// const browser = await puppeteer.launch({ headless: false })
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	// Config du timeout
    await page.setDefaultNavigationTimeout(0);
	await page.goto(url)

	await page.waitFor(1000) 

	const articles = await page.evaluate(() => {

		let articles = []
		let elements = document.querySelectorAll('div.article')
		for(element of elements){

			let title = element.querySelector('div.article-top > div.left')
			let body = element.querySelector('div.article-body')
			// let images = element.querySelectorAll('div.article-body img', img => img.src)

			
		    let imagefiles = Array.from(
		      element.querySelectorAll('div.article-body img'),
		      img => img.src)

			articles.push({
				title : title.textContent,
				body : body.textContent,
				images : imagefiles
			})
		}

		return articles
	})

	
	browser.close()
	return articles
}


// Fonctionnement global
const scrap = async() => {

	const urlList = await getAllUrls(baseUrl)
	const results = await Promise.all(
		urlList.map(url => getallDatas(url)),
	)

	console.log('scrappp')
	return results
}


//const urls = getAllUrls(url)

// Executioon de scrap + then
scrap().then( results => {

	console.log('fin script')

}).catch(error => {
	console.log(error)
})







// Créer les fichiers pour chaque article
const createFolder = async path => {
	return true
}
