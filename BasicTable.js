/*this is just a basic table that I found online and modified. I was using material UI.
I am unsure how to add this into the use case 1 and don't want to mess things up. 
I also still need to make it have dummy data (rn I just took the numbers from the project description pdf.*/
/* formulas: 
Min: Math.min(data)
Mean: Sum all data points then divide by the total # of points
Median: Sort array, Median is the element with index (total # of points)/2 
Max:Math.max(data)
P99:(99 percentile of data) sort all values and take 99/100th value
P95:(95 percentile of data) sort all values and take (95/100) 19/50th value
P90:(90 percentile of data) sort all values and take 9/10th value
Skewness: 3*(mean-median)/stddev
Stddev:sqrt(1/N * {SUM(from i = 1 to N)(xi-mean)^2})
*/
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    moment,  /* should be a string*/
    val  /* should be a number*/
  ) {
    return { moment, val};
  }  

const rows = [
    createData('MIN', 6.48),
    createData('MEAN', 34.31),
    createData('MEDIAN', 27.58),
    createData('MAX', 202.42),
    createData('P99', 113.60),
    createData('P95', 77.29),
    createData('P90', 61.24),
    createData('SKEWNESS', 2.15),
    createData('STDDEV', 21.16),
  ];



export default function BasicTable() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Moment </TableCell>
              <TableCell align="right">NO-DASS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
