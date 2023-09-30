import { useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TableData from "./components/TableData";
import BarChart from "./components/BarChart";

function App() {
    const [keyword, setKeyword] = useState("");
    const [startDate, setStartDate] = useState("01-01-1970");
    const [endDate, setEndDate] = useState("01-01-2070");
    const [trxn, setTrxn] = useState([]);
    const [chartData, setChartData] = useState();
    const [banks, setBanks] = useState(["hdfc", "icici", "axis"]);

    const handleBankChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setBanks([...banks, value]);
        } else {
            setBanks(banks.filter((e) => e !== value));
        }
    };

    // On clicking 'search button'
    const onClickFetchData = async () => {
        // Get data from backend
        const response = (
            await axios.post("http://localhost:8080/search", {
                bankList: banks,
                keyword: keyword,
                startDate: startDate,
                endDate: endDate,
            })
        ).data;

        // For aggregating data based on same date
        const dataAggregation = [];
        response.forEach((item) => {
            if (dataAggregation.length == 0) {
                dataAggregation.push(item);
                return;
            }

            let peekElement = dataAggregation[dataAggregation.length - 1];
            if (peekElement.Date == item.Date) {
                if (peekElement.Credit && item.Credit) {
                    peekElement.Credit = Number(peekElement.Credit) + Number(item.Credit);
                } else if (peekElement.Debit && item.Debit) {
                    peekElement.Debit = Number(peekElement.Debit) + Number(item.Debit);
                } else {
                    dataAggregation.push(item);
                }
            } else {
                dataAggregation.push(item);
            }
        });

        // --

        // To display data on the bar chart, we need to pass this object.
        const data = {
            labels: dataAggregation.map((item) => item.Date),
            datasets: [
                {
                    label: "Aggregated data (Credit)",
                    data: dataAggregation.map((item) => {
                        if (item.Credit) {
                            return item.Credit;
                        }
                    }),
                    borderColor: "rgb(0, 22, 118)",
                    backgroundColor: "rgb(40, 0, 105)",
                },
                {
                    label: "Aggregated data (Debit)",
                    data: dataAggregation.map((item) => {
                        if (item.Debit) {
                            return item.Debit;
                        }
                    }),
                    borderColor: "rgb(101, 10, 0)",
                    backgroundColor: "rgb(128, 0, 0)",
                },
            ],
        };

        setChartData(data);
        setTrxn(response);
    };

    return (
        <div className="container">
            <div>
                <TextField onChange={(e) => setKeyword(e.target.value)} id="outlined-basic" label="Comma Separated Keyword" variant="outlined" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker onChange={(e) => setStartDate(new Date(e))} label={"Start Date"} views={["year", "month", "day"]} />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker onChange={(e) => setEndDate(new Date(e))} label={"End Date"} views={["year", "month", "day"]} />
                </LocalizationProvider>
            </div>
            <FormGroup row>
                <FormControlLabel control={<Checkbox value="hdfc" onChange={handleBankChange} defaultChecked />} label="HDFC" />
                <FormControlLabel control={<Checkbox value="icici" onChange={handleBankChange} defaultChecked />} label="ICICI" />
                <FormControlLabel control={<Checkbox value="axis" onChange={handleBankChange} defaultChecked />} label="AXIS" />
            </FormGroup>

            <div className="button">
                <Button onClick={onClickFetchData} variant="contained">
                    Search
                </Button>
            </div>
            <div>
                <TableData trxn={trxn} />
            </div>
            {chartData && (
                <div style={{ width: "80vw" }}>
                    <BarChart data={chartData} />
                </div>
            )}
        </div>
    );
}

export default App;
