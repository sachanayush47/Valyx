import express from "express";
import csv from "csvtojson";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default values
const DEAFULT_BANK_LIST = ["hdfc", "axis", "icici"];
const DEFAULT_START_DATE = "1970-01-01";
const DEFAULT_END_DATE = "2070-01-01";

function filterByDate(start, end, date) {
    return date >= start && date <= end;
}

function isDateValid(dateStr) {
    return !isNaN(new Date(dateStr));
}

app.post("/search", async (req, res) => {
    let { bankList, keyword, startDate, endDate } = req.body;

    // Validating data
    if (!bankList || bankList.length == 0) {
        bankList = DEAFULT_BANK_LIST;
    }

    keyword = keyword ? keyword.split(",") : [];
    keyword = keyword.map((key) => key.trim().toLowerCase());

    startDate = isDateValid(startDate) ? new Date(startDate) : new Date(DEFAULT_START_DATE);
    endDate = isDateValid(endDate) ? new Date(endDate) : new Date(DEFAULT_END_DATE);

    // All filtered data goes here.
    const filteredData = [];

    // Iterating 'bank(s)'
    for (let i = 0; i < bankList.length; ++i) {
        try {
            // Coverting csv to json
            const csvToJsonArray = await csv().fromFile(`data/${bankList[i].toLowerCase().trim()}.csv`);

            // Iterating JSON array
            csvToJsonArray.forEach((row) => {
                // Coverting MM/DD/YYYY to YYYY-MM-DD
                let date = new Date(row.Date.split("/").reverse().join("-"));

                // Check if filter by 'keyword' or not
                if (keyword.length > 0 && keyword.includes(row.Description.trim().toLowerCase()) && filterByDate(startDate, endDate, date)) {
                    filteredData.push(row);
                } else if (keyword.length == 0 && filterByDate(startDate, endDate, date)) {
                    filteredData.push(row);
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    filteredData.sort(function (a, b) {
        return new Date(a.Date.split("/").reverse().join("-")) - new Date(b.Date.split("/").reverse().join("-"));
    });

    res.json(filteredData);
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
