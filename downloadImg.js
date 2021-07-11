const fs = require('fs')
const fetch = require('node-fetch');


function donwloadImg(url, filename){

    fetch(url)
    .then(res => {
        const dest = fs.createWriteStream(filename);
        res.body.pipe(dest)
    })
    .catch((err) => {
        console.log(err)
    })


}



module.exports.donwloadImg = donwloadImg
