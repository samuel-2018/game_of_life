import React from "react";

export const Game = props => {
  return (
    <table className="game-board">
      <tbody>
        {props.matrix.map((row, indexI) => {
          return (
            <tr key={`row-${indexI}`}>
              {row.map((cell, indexJ) => {
                return (
                  <td
                    key={`cell-${(indexI, indexJ)}`}
                    className={`cell-${cell} cell`}
                    onClick={() => props.onCellTap(indexI, indexJ)}
                  >
                    <div className="cell__div"></div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
