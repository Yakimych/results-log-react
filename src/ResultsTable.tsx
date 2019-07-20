import React from "react";
import { Result } from "./queries";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper
} from "@material-ui/core";
import { formatDate } from "./utils";
import { Link } from "@reach/router";

type Props = {
  results: readonly Result[];
  newResults?: readonly Result[];
  communityname: string;
};

const getPlayerStyle = (isWinningPlayer: boolean): React.CSSProperties => ({
  fontWeight: isWinningPlayer ? "bold" : "normal"
});

const goalsStyle: React.CSSProperties = {
  width: 20,
  paddingLeft: 10,
  paddingRight: 0
};

const headToHeadStyle: React.CSSProperties = {
  width: 20,
  paddingLeft: 10,
  paddingRight: 0
};

const colonStyle: React.CSSProperties = {
  width: 5,
  paddingLeft: 0,
  paddingRight: 0
};

const dateStyle: React.CSSProperties = {
  width: 100
};

const extraTimeStyle: React.CSSProperties = {
  width: 20
};

const containerStyle: React.CSSProperties = {
  width: 650
};

export const ResultsTable: React.FC<Props> = ({
  results,
  newResults,
  communityname: communityName
}) => (
  <>
    <Paper style={containerStyle}>
      <Table style={containerStyle} size="small">
        <TableHead>
          <TableRow>
            <TableCell style={headToHeadStyle}>H2H</TableCell>
            <TableCell align="right">Player1</TableCell>
            <TableCell style={goalsStyle}>G1</TableCell>
            <TableCell style={colonStyle} />
            <TableCell style={goalsStyle}>G2</TableCell>
            <TableCell>Player2</TableCell>
            <TableCell style={extraTimeStyle} align="right">
              E
            </TableCell>
            <TableCell style={dateStyle}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map(r => {
            const player1Won = r.player1goals > r.player2goals;
            const player2Won = !player1Won;
            const formattedDate = formatDate(new Date(r.date));

            return (
              <TableRow
                key={r.id}
                className={
                  newResults && newResults.indexOf(r) > -1 ? "highlighted" : ""
                }
              >
                <TableCell style={headToHeadStyle}>
                  <Link
                    to={`/${communityName}/${r.player1.name}/${r.player2.name}`}
                  >
                    H2H
                  </Link>
                </TableCell>
                <TableCell style={getPlayerStyle(player1Won)} align="right">
                  {r.player1.name}
                </TableCell>
                <TableCell style={goalsStyle}>{r.player1goals}</TableCell>
                <TableCell style={colonStyle}> : </TableCell>
                <TableCell style={goalsStyle}>{r.player2goals}</TableCell>
                <TableCell style={getPlayerStyle(player2Won)}>
                  {r.player2.name}
                </TableCell>
                <TableCell align="right">{r.extratime ? "X" : ""}</TableCell>
                <TableCell>{formattedDate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  </>
);
