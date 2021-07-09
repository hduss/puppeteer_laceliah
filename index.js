
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
var mkdirp = require("mkdirp");

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


	// const titles = await page.$$('.article-top > .left');
	// for (let i = 0; i < titles.length; i++) {
	// 	const title = await (await titles[i].getProperty('innerText')).jsonValue()
	// 	 console.log(title)
	// }

	// let titles = await page.evaluate(() => {
	// 	Array.from(document.querySelectorAll('.article-top > .left').map(el => el.innerText))
	// })

	/*const articles = await page.$$eval('.article', articles => articles.map(article => article.getAttribute('id')
	))*/

	const articles = await page.$$eval('.article', articles => articles.map(article => {


		let attr = article.getAttribute('id')
		const titles = page.$$eval('.article-top > .left', titles => titles.map(title => {

		return {
			attr : title.textContent
		}
	}))

	}))


	console.log('articles => ', articles)


	const titles = await page.$$eval('.article-top > .left', titles => titles.map(title => {

		return {
		'title' : title.textContent
		}
	}));


	console.log('titles => ', titles)

	const bodys = await page.$$eval('.article-body', bodys => bodys.map(el => el.textContent))
	const imagefiles = await page.evaluate(() =>
	    Array.from(
	      document.querySelectorAll('#main img'),
	      img => img.src
	    )
	)



	// Gestion de création des dossier/fichiers
	let existingPath = await path.resolve('uploads/img')
	if(!fs.existsSync(existingPath)){
		mkdirp(existingPath, function(err) {
		console.log(err)
		});

	}else{
		console.log('Exist path')
	}


	console.log('<===================' + url + '========================>')

	browser.close()
	return {titles, imagefiles}


}




const getallDatas = async url => {

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



	

	const articles = await page.evaluate(() => {

		let articles = []
		let elements = document.querySelectorAll('div.article')
		for(element of elements){

			let title = element.querySelector('div.article-top > div.left')
			let body = element.querySelector('div.article-body')
			// let images = element.querySelectorAll('div.article-body img', img => img.src)

			
		    let imagefiles = Array.from(
		      element.querySelectorAll('div.article-body img'),
		      img => img.src
    )


			

			articles.push({
				title : title.textContent,
				//body : body.textContent
				images : imagefiles
				
			})

			
			// for(image of images){

			// 	articles.images.push({image})
			// }
			
			

			
		}
		return articles
	})

	console.log('articles => ', articles)

	browser.close()
}


// Créer les fichiers pour chaque article
const createFolder = async path => {
	return true
}
// Telecharge les fichiers dans un dossier
const downloadDatas = async datas => {
	let download = false
	if(download) return true

}

// Génère toutes les urls à scrapp
const getAllUrls = async baseUrl => {

	const urlList = [];
	for( let i = 2; i < 3; i++){
		urlList.push(baseUrl + i + ".html");
	}
	return urlList;
}


const scrap = async() => {

	const urlList = await getAllUrls(baseUrl)
	const results = await Promise.all(
		urlList.map(url => getallDatas(url)),
	)


	//console.log(urls)

	console.log('scrappp')
	return results
}


//const urls = getAllUrls(url)

scrap().then( results => {
	console.log(results)
	console.log('fin script')
}).catch(error => {
	console.log(error)
})
//console.log(urls)
//getData()







