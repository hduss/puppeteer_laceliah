const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const downloader = require('./downloadImg.js');
const mkdirp = require("mkdirp");

const UPLOAD_FOLDER = "download/";
const NBR_PAGE = 2;
// const downloadPath = path.resolve('uploads');
const baseUrl = "http://laceliah.cowblog.fr/";
const fileCreationError = [];

process.setMaxListeners(Infinity)

process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});

var args = process.argv.slice(2);
console.log(`args => ${args}`);


// Génère toutes les urls à scrapp
const getAllUrls = async baseUrl => {
	const urlList = [];
	for (let i = 1; i < NBR_PAGE; i++) {
		urlList.push(baseUrl + i + ".html");
	}
	return urlList;
}


// Get datas from webpage
const getallDatas = async url => {

	console.log(`Url chargée => ${url}`);

	// const browser = await puppeteer.launch({ headless: false })
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Timeout config
	await page.setDefaultNavigationTimeout(0);
	await page.goto(url);
	await page.waitForTimeout(1000);

	const articles = await page.evaluate((url) => {

		let articles = [];
		let elements = document.querySelectorAll('div.article');
		for (element of elements) {

			let title = element.querySelector('div.article-top > div.left');
			let body = element.querySelector('div.article-body');
			let imagefiles = Array.from(
				element.querySelectorAll('div.article-body img'),
				img => img.src);

			articles.push({
				title: title.textContent,
				body: body.textContent,
				images: imagefiles
			});
		}

		return articles;
	})

	browser.close();
	return articles;
}


// Scrapp 
const scrap = async () => {

	const urlList = await getAllUrls(baseUrl);
	const results = await Promise.all(
		urlList.map(url => getallDatas(url)),
	);
	return results;
}


// Scrapp execution
scrap().then(results => {
	createFolderProcess(results);
	console.log('End script ...');

}).catch(error => {
	console.log(`Scrapp error => ${error}`);
})


// Create folder for each article
const createFolderProcess = results => {

	// console.log('Results => ', results);

	for (let i = 0; i < results.length; i++) {
		for (let j = 0; j < results[i].length; j++) {

			const title = results[i][j].title;
			const content = results[i][j].body;
			const images = results[i][j].images;
			const downloadPath = UPLOAD_FOLDER + title;

			if (fs.existsSync(downloadPath)) {
				console.log(`File already exist => ${downloadPath}`);
			} else {
				fs.mkdir(path.join(__dirname, downloadPath), (err) => {
					if (err) {
						console.error(err);
						fileCreationError.push(downloadPath);
					} else {
						fs.writeFile(downloadPath + '/Article.txt', content, err => {

							if (err) console.log('Error MKDIR => ', err);
							for (let k = 0; k < images.length; k++) {
								let image = images[k];
								let filename = downloadPath + "\'" + path.basename(image);
								downloader.donwloadImg(image, downloadPath + '/' + path.basename(image));
							}
						});
					}
				});
			}
		}
	}
	if (fileCreationError.length > 0) {
		console.log(`Errors => ${fileCreationError}`);
	}
}
