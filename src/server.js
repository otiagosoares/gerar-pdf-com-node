const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');

const passengers = [
    {
        name: "Tiago",
        flightNumber: 3478,
        time: "23h50"
    },
    {
        name: "Jão",
        flightNumber: 3409,
        time: "23h50"
    },
    {
        name: "Rafael",
        flightNumber: 3465,
        time: "13h50"
    },
];

app.get("/pdf", async (req, res, next) => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3333/', {
        waitUntil: 'networkidle0'
    });

    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter',
        mragin:{
            top: "20px",
            bottom: "40px",
            left: "20px",
            tright: "20px",
        }
    })

    await browser.close();

    res.contentType("application/pdf")

    return res.send("pdf")
});

app.get("/", (req, res, next) => {

    const pathName = path.join(__dirname, "print.ejs");

    ejs.renderFile(pathName, {passengers}, (err, html) => {

        if(err){
            return res.send("Errou");
        }
        
        return res.send(html);
        
        // const opt = {
        //     height: "11.25in",
        //     width: "8.5in",
        //     header: {
        //         height: "20mm",
        //     },
        //     footer: {
        //         height: "20mm",
        //     },
        // };

        // pdf.create(html, opt).toFile("report.pdf", (err, data) => {
        //     if(err){
        //         return res.send("Erro ao gerar pdf.");
        //     }
            
        //     return res.send(html);
        // })

    });
})


app.listen(3333, () =>{
    console.log("App Runing...")
});