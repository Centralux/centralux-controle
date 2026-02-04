import React from 'react';
import { TimeEntry } from '../types';

interface AttendanceLogProps {
  entries: TimeEntry[];
}

const AttendanceLog: React.FC<AttendanceLogProps> = ({ entries }) => {
  return (
    <div className="attendance-log">
      <h2>Registro de Ponto</h2>
      <table>
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>Data</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.employeeId}</td>
              <td>{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
              <td>{entry.checkIn || '-'}</td>
              <td>{entry.checkOut || '-'}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceLog;
