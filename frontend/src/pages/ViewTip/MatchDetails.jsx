import React from 'react';
import { Alert } from 'react-bootstrap';

const MatchDetails = ({ match }) => {
  return (
    <>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {match?.matchRunners?.length ? (
             <table className="table table-bordered table-colored">
             <thead>
               <tr>
                 <th>Teams</th>
                 <th>Live Data</th>
                 <th>Time</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>
                   {match.matchRunners?.map((runner, index) => (
                     <span
                       key={index}
                       style={{ color: 'blue', textDecoration: 'underline', marginRight: 8 }}
                     >
                       {runner.runnerName}
                       {index < match.matchRunners.length - 1 ? ' vs ' : ''}
                     </span>
                   ))}
                 </td>
                 <td>Live Data Here</td>
                 <td>{new Date().toLocaleTimeString()}</td>
               </tr>
             </tbody>
           </table>
          ) : (
            <Alert variant="info">No teams available.</Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default MatchDetails;
