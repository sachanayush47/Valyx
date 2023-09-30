import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TableData = ({ trxn }) => {
    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Debit</TableCell>
                            <TableCell align="right">Credit</TableCell>
                            <TableCell align="right">Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trxn.map((row) => (
                            <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.Date}
                                </TableCell>
                                <TableCell align="right">{row.Description}</TableCell>
                                <TableCell align="right">{Number(row.Debit).toFixed(2)}</TableCell>
                                <TableCell align="right">{Number(row.Credit).toFixed(2)}</TableCell>
                                <TableCell align="right">{row.Balance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableData;
