const fetch = require("node-fetch");
const fs = require("fs");

async function getCardListJSON() {
    const url = "https://rockman-x-dive.fandom.com/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "parse",
            pageid: "1583",
            prop: "wikitext",
            format: "json",
        });

    try {
        const req = await fetch(url);
        const json = await req.json();
        //console.log(json.parse.wikitext["*"]);

        const wikiText = json.parse.wikitext["*"];
        var parsed = wikiText.substring(wikiText.indexOf('|1\n|')+1, wikiText.indexOf('|}'));

        //console.log(parsed);
        return(parsed);
        //return parseWikiToJSON(parsed);
    } catch (e) {
        console.error(e);
    }
}

function parseWikiaToJSON(input)
{
    var output = String.raw`${input}`;
    //output = output.replace(/\|frameless\|50x50px]]/g," ");
    output = output.replace(/'/g,"");
    output = output.replace(/\|-/g,"");
    output = output.replace(/\|<br>/g,"");
    output = output.replace(/<br>/g,"");
    output = output.replace(/[\n]/g,"|");
    output = output.replace(/\|frameless\|30x30px]]/g,"");
    output = output.replace(/\|frameless\|40x40px]]/g,"");
    output = output.replace(/\|frameless\|50x50px]]\|/g," ");
    output = output.replace(/\|\[\[File:/g,"");
    output = output.replace(/\[\[File:/g," ");
    output = output.replace(/\|\|\|/g,"|");
    output = output.replace(/\|\|/g,"|");
    output = output.replace(/\:\|/g,":");
    output = output.replace(/\: \|/g,":");
    //output = output.replace(/\.\|/g," ");
    output = output.replace(/ Card Blue.png/g,"");
    output = output.replace(/ Card Yellow.png/g,"");
    output = output.replace(/ Card Red.png/g,"");
    output = output.replace(/ Card Green.png/g,"");
    output = output.replace(/\*ATK:/g,"");
    output = output.replace(/\*HP:/g,"");
    output = output.replace(/\*DEF:/g,"");
    output = output.replace(/\|Requirement/g," Requirement");
    console.log(output);
    //output = output.replace(/\[\[(.*?)\]\]/g,"");
    var split = output.split("|");
    //console.log(split);
    //console.log(output);
    var JSONKeys =["ID","CardImage","Name","Colour","Attack","HP","Defense","Effect1","Effect2","Rank"];

    var cardJSON = [];

    var cardInfo = {};
    split.forEach((element,index)=>{
        // if(index <80){
        //     console.log("index :"+ index + " Key:"+JSONKeys[index%10] + " Element:"+element);
        // }
        cardInfo[JSONKeys[index%10]] = element;
        if(((index+1) % 10 )== 0)
        {
            //console.log(cardInfo);

            cardJSON.push(cardInfo);
            cardInfo = {};
        }
    });
    //return(output);
    return(cardJSON);
}

fs.stat("Cards.json", (err, stats) => {
    //console.log("File exists:"+stat.isFile());
    if (err) {
        console.log(err);
    }
    else {
        if (stats.isFile()) {
            fs.rename("Cards.json", "./" + new Date().toJSON().slice(0, 10) + "Cards.json", (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
});

getCardListJSON().then((results)=>{
    var output = parseWikiaToJSON(results);
    //console.log(output);
    fs.appendFile("Cards.json", JSON.stringify(output), (error) => {
        if (error) {
            console.log(error);
        }
    });

});