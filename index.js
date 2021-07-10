
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const downloader = require('./downloadImg.js')
const mkdirp = require("mkdirp");


// console.log(downloader.donwloadImg())


const downloadPath = path.resolve('uploads')
const baseUrl = "http://laceliah.cowblog.fr/"
const testUrl = ' http://laceliah.cowblog.fr/images/photos/DSC9149.jpg'
const file = path.basename(testUrl)
const filename = downloadPath + '/test/' +  path.basename(testUrl)



const createFiles = (path, file) => {

}


if (fs.existsSync('uploads/test')) {
    console.log('Found file')
}else{
	console.log("File not exist")
	fs.mkdir(path.join(__dirname, 'uploads/test'), (err) => {
	    if (err) {
	        return console.error(err)
	    }else{

	    }

		fs.writeFile('uploads/test/nouveauFichier.txt', 'Mon contenu', function (err) {
			if (err) throw err
		console.log('Fichier créé !')
		})
    	console.log('Directory created successfully!')
	})
}


console.log('downloadPath => ', downloadPath)
console.log('testUrl => ', testUrl)
console.log('filename => ', filename)
console.log('File => ', file)

downloader.donwloadImg(testUrl, filename)


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

	const articles = await page.evaluate((url) => {

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
				// body : body.textContent,
				images : imagefiles
			})
		}


		return articles
	})

	
	browser.close()

	// console.log(url)
	// console.log(articles)
	return articles
}


// Fonctionnement global
const scrap = async() => {

	console.log('scrappp')
	const urlList = await getAllUrls(baseUrl)
	const results = await Promise.all(
		urlList.map(url => getallDatas(url)),
	)

	return results
}



//const urls = getAllUrls(url)

// Executioon de scrap + then
scrap().then( results => {
	// console.log(results)
	createFolderProcess(results)
	console.log('fin script')

}).catch(error => {
	console.log(error)
})


// Créer les fichiers pour chaque article
function createFolderProcess(results){

	// console.log(results)

	for(let i = 0; i < results.length; i++){
		for(let j = 0; j < results[i].length; j++){
			// console.log(results[i])
			// console.log(results[i][j])

			const title = results[i][j].title 
			const images = results[i][j].images 

			// console.log('Title => ', title)
			// console.log('Images => ', images)

			for(let k = 0; k < images.length; k++){

				let image = images[k];
				// console.log('img URL => ', image)
				let filename = downloadPath + "\'" + path.basename(image)
				// console.log('Filename => ', filename)
				// downloader.donwloadImg(images[k], filename)
			}
		}
	}
}


