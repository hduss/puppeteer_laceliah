const fs = require('fs')
const https = require ('https')
const path = require('path')
const fetch = require('node-fetch');


const url = "http://laceliah.cowblog.fr/images/Illu/10ans.jpg"


function donwloadImg(url, filename){

	console.log('url => ', url)
    console.log('filename => ', filename)
    fetch(url)
    .then(res => {
        const dest = fs.createWriteStream(filename);
        res.body.pipe(dest)
    })
    .catch((err) => {
        console.log(err)
    })


}


let existingPath = path.resolve('uploads')
// DownloaderImage(url, existingPath + '/image3454.jpg')
// downloadImg(url)


function DownloaderFiles(url, filename){

}

module.exports.donwloadImg = donwloadImg
