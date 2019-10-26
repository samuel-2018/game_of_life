import React from "react";

export const Controls = props => {
  return (
    <section className="controls">
      {props.controlsBelowTheFold && (
        <div className="double-down-arrow">
          <a href="#instructions">
            <img src="svg/arrows_down_double-34.svg" alt="page down" />
          </a>
        </div>
      )}
      <div className="instructions" id="instructions">
        <p className="instructions__text">Select cell type.</p>
        <p className="instructions__text">Tap a square above to add a cell.</p>
      </div>
      <div className="button-group">
        <div className="button-row button-row--selection">
          <div className="button-row__sub">
            <button
              onClick={() => props.onSelection(0)}
              className={`button button--selection button--selection--cell-0 ${
                props.userSelection === 0 ? "active-btn" : ""
              }`}
            >
              Dead
            </button>
            <button
              onClick={() => props.onSelection(2)}
              className={`button button--selection button--selection--cell-2 ${
                props.userSelection === 2 ? "active-btn" : ""
              }`}
            >
              Forever Dead
            </button>
          </div>
          <div className="button-row__sub">
            <button
              onClick={() => props.onSelection(1)}
              className={`button button--selection button--selection--cell-1 ${
                props.userSelection === 1 ? "active-btn" : ""
              }`}
            >
              Alive
            </button>

            <button
              onClick={() => props.onSelection(3)}
              className={`button button--selection button--selection--cell-3 ${
                props.userSelection === 3 ? "active-btn" : ""
              }`}
            >
              Forever Alive
            </button>
          </div>
        </div>
        <div className="button-row">
          <button
            onClick={props.onRandomize}
            className="button button--control"
          >
            Randomize
          </button>
          <button
            onClick={props.onToggleStart}
            className="button button--control"
          >
            {props.isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={props.onClear} className="button button--control">
            Clear
          </button>
        </div>
      </div>
    </section>
  );
};
