
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const downloader = require('./downloadImg.js')
const mkdirp = require("mkdirp");

const UPLOAD_FOLDER = "uploads/"
const NBR_PAGE = 2

const downloadPath = path.resolve('uploads')
const baseUrl = "http://laceliah.cowblog.fr/"
const fileCreationError = []

process.setMaxListeners(Infinity)



// Génère toutes les urls à scrapp
const getAllUrls = async baseUrl => {
	const urlList = [];
	for( let i = 1; i < NBR_PAGE; i++){
		urlList.push(baseUrl + i + ".html");
	}
	return urlList;
}



// Récupère les données (titre, body, images) d'une page web
const getallDatas = async url => {

	console.log('Url chargée => ', url)

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


			const title = results[i][j].title 
			const content = results[i][j].body
			const images = results[i][j].images 
			const uploadPath = UPLOAD_FOLDER + title

			// console.log('Title => ', title)
			// console.log('Images => ', images)

			if (fs.existsSync(uploadPath)) {
				console.log('FICHIER DEJA EXISTANT => ', uploadPath)
			}else{
				// console.log("File not exist")

				fs.mkdir(path.join(__dirname, uploadPath), (err) => {
				    if (err) {
				        console.error(err)
				        fileCreationError.push(uploadPath)
				    }else{
				    	// console.log('Dossier '  + uploadPath + ' crée avec succès')

				    	fs.writeFile(uploadPath + '/Article.txt', content, function (err) {

				    		if(err) console.log('Error MKDIR => ', err)
							for(let k = 0; k < images.length; k++){
								let image = images[k];
								let filename = downloadPath + "\'" + path.basename(image)
								downloader.donwloadImg(image, uploadPath + '/' + path.basename(image))
							}
						})

				    }
				})
			}
		}
	}

	console.log('ERROR => ', fileCreationError)
}



// path => uploads/folder
// file => name of txt file
// const createFiles = (path, file, content) => {

// 	if (fs.existsSync(path)) {
// 	    console.log('Found file')
// 	}else{
// 		console.log("File not exist")
// 		fs.mkdir(path.join(__dirname, path), (err) => {
// 		    if (err) {
// 		        return console.error(err)
// 		    }else{
// 		    	console.log('Dossier '  + path + ' crée avec succès')

// 		    }

// 			fs.writeFile(path + file, content, function (err) {
// 				if (err) throw err
// 			console.log('Fichier ' + file + ' créé !')
// 			})
	    	
// 		})
// 	}
// }