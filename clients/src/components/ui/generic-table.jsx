import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  .custom-table {
    width: 100%;
    font-size: 14px;
    vertical-align: middle;
    border-color: #c4c4c4;
    caption-side: bottom;
    border-collapse: collapse;
  }

  thead {
    vertical-align: bottom;
    background-color: #f3f6f9;
  }

  tbody {
    vertical-align: inherit;
  }

  th {
    white-space: nowrap;
    color: ${(props) => props.headerColor};
    font-weight: 600;
  }

  th,
  td {
    max-width: 200px;
    padding: 1rem 0.5rem;
    border-bottom-width: 1px;
    text-align: left;
  }

  td:first-child {
    font-weight: ${(props) => props.fontWeight};
  }

  tbody tr:nth-child(even) {
    background-color: #f3f6f9;
  }

  tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }
`;

export const GenericTable = ({ columns = [], data = [] }) => {
  return (
    <TableWrapper>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableWrapper>
  );
};
