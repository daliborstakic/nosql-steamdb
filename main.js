const fs = require("fs");
const csv = require("csv-parser");

const csvFilePath = "games.csv";
const jsonFilePath = "games.json";

const results = [];

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
        data.Categories = data.Categories.split(",");
        data.Publishers = data.Publishers.split(",");
        data.Genres = data.Genres.split(",");
        data.Tags = data.Tags.split(",");

        data["Full audio languages"] = data["Full audio languages"].replace(
            /'/g,
            '"'
        );
        data["Full audio languages"] = JSON.parse(data["Full audio languages"]);

        data["Supported languages"] = data["Supported languages"].replace(
            /'/g,
            '"'
        );
        data["Supported languages"] = JSON.parse(data["Supported languages"]);

        delete data["Screenshots"];
        delete data["Header image"];
        delete data["Movies"];

        results.push(data);
    })
    .on("end", () => {
        console.log("CSV file successfully processed");
        console.log("Parsed data:", results);

        const jsonString = JSON.stringify(results, null, 2);

        fs.writeFileSync(jsonFilePath, jsonString, (err) => {
            if (err) {
                console.error("Error writing JSON file:", err);
            } else {
                console.log("JSON file successfully created:", jsonFilePath);
            }
        });
    })
    .on("error", (error) => {
        console.error("Error:", error.message);
    });
