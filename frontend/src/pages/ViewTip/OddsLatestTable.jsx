import React from 'react';
import { Table } from 'react-bootstrap';

const OddsLatestTable = ({ oddsHistory }) => {
  return (
    <Table bordered hover className="table-striped align-middle shadow-sm">
      <thead className="table-dark">
        <tr>
          <th>Runner</th>
          <th>Back Odds</th>
          <th>Lay Odds</th>
          <th>Back Amount</th>
          <th>Lay Amount</th>
          <th>Back Profit</th>
          <th>Lay Profit</th>
        </tr>
      </thead>
      <tbody>
        {oddsHistory.map((item, idx) => (
          <tr key={idx}>
            <td>{item.runnerName}</td>
            <td>{item.odds?.back ?? 0}</td>
            <td>{item.odds?.lay ?? 0}</td>
            <td>{item.Ammount?.back ?? 0}</td>
            <td>{item.Ammount?.lay ?? 0}</td>
            <td>{item.Profit?.back ?? 0}</td>
            <td>{item.Profit?.lay ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OddsLatestTable;
