const fs = require('fs')
const https = require ('https')
const path = require('path')
const fetch = require('node-fetch');


const url = "http://laceliah.cowblog.fr/images/Illu/10ans.jpg"


function saveImageToDisk(url, filename){
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
saveImageToDisk(url, existingPath + '/image3454.jpg')
// downloadImg(url)


module.exports.donwloadImg = saveImageToDisk