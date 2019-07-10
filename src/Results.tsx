import * as React from "react";
import { useQuery } from "react-apollo-hooks";
import { ALL_RESULTS_QUERY, ResultsQueryResponse } from "./queries";
import Table from "@material-ui/core/Table";
import {
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const goalsStyle = {
  width: 20,
  paddingLeft: 10,
  paddingRight: 0
};

const colonStyle = {
  width: 5,
  paddingLeft: 0,
  paddingRight: 0
};

const dateStyle = {
  width: 100
};

const containerStyle = {
  width: 550
};

export const Results: React.FC = () => {
  const { data, error, loading } = useQuery<ResultsQueryResponse>(
    ALL_RESULTS_QUERY,
    { variables: { communityname: process.env.REACT_APP_COMMUNITY_NAME } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  return (
    <Paper style={containerStyle}>
      <Table style={containerStyle} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Player1</TableCell>
            <TableCell style={goalsStyle}>G1</TableCell>
            <TableCell style={colonStyle} />
            <TableCell style={goalsStyle}>G2</TableCell>
            <TableCell>Player2</TableCell>
            <TableCell style={dateStyle}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map(r => (
            <TableRow key={r.id}>
              <TableCell align="right">{r.player1.name}</TableCell>
              <TableCell style={goalsStyle}>{r.player1goals}</TableCell>
              <TableCell style={colonStyle}> : </TableCell>
              <TableCell style={goalsStyle}>{r.player2goals}</TableCell>
              <TableCell>{r.player2.name}</TableCell>
              <TableCell>{r.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
