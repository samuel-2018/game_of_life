import React from "react";
import { Game } from "./Game.js";
import { Controls } from "./Controls.js";
import { Header } from "./Header.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      matrix: [],
      // Values 0-3
      userSelection: 1,
      isRunning: true,
      generation: 0,
      controlsBelowTheFold: false
    };
    this.nextGen = [];
    this.intervalRef = null;
    // Sizes
    this.rows = 0;
    this.cols = 0;
    // cell + padding + spacing
    this.cellSize = 25;
    // Used to calc game board size
    this.controlsHeight = 210;
    this.headerHeight = 55;
    this.downArrow = 40;
  }

  async componentDidMount() {
    // Note: VSC erroneously says "'await' has
    // no effect on the type of this expression."
    // But it does cause it to wait.
    await this.setGameSize();
    // Initualize
    this.setState({ matrix: this.getMatrix.shape() });
    // Start updates
    this.updateMatrix();
  }

  setGameSize = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
    const intFrameWidth = window.innerWidth;
    const intFrameHeight = window.innerHeight;

    // Row calculations

    // Wide screen width > 799px
    // Controls above the fold.
    if (intFrameWidth > 799) {
      this.rows = Math.floor(
        (intFrameHeight - this.headerHeight - this.controlsHeight) /
          this.cellSize
      );
      this.setState({ controlsBelowTheFold: false });

      // All other screens.
      // Controls below the fold.
    } else {
      this.rows = Math.floor(
        (intFrameHeight - this.headerHeight - this.downArrow) / this.cellSize
      );
      this.setState({ controlsBelowTheFold: true });
    }

    // Column uses same calculation for all screen sizes
    this.cols = Math.floor((intFrameWidth - this.cellSize) / this.cellSize);

    return "done";
  };

  getRandomInt = (max = 2) => {
    // Returns a number between 0 and max - 1
    return Math.floor(Math.random() * Math.floor(max));
  };

  getRandomIntWeighted = () => {
    // Each entry in array has equal chance of being chosen.
    // So, the more times a number is in array,
    // the greater its chance of being chosen.
    const weighted = [1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = weighted[this.getRandomInt(weighted.length)];
    return result;
  };

  getMatrix = {
    getMatrixHelper: (empty = true) => {
      const matrixInit = [];
      // Initualize
      for (let i = 0; i < this.rows; i++) {
        matrixInit.push([]);
        for (let j = 0; j < this.cols; j++) {
          matrixInit[i][j] = empty ? 0 : this.getRandomIntWeighted();
        }
      }
      return matrixInit;
    },
    empty: () => {
      return this.getMatrix.getMatrixHelper();
    },
    random: () => {
      return this.getMatrix.getMatrixHelper(false);
    },
    shape: () => {
      const matrix = this.getMatrix.getMatrixHelper();
      let myShape = [];
      console.log(
        "this.state.controlsBelowTheFold: ",
        this.state.controlsBelowTheFold
      );

      if (!this.state.controlsBelowTheFold) {
        myShape = [
          [3, 0, 0, 3, 0, 0, 3],
          [0, 3, 0, 0, 0, 3, 0],
          [0, 0, 0, 3, 0, 0, 0],
          [3, 0, 3, 3, 3, 0, 3],
          [0, 0, 0, 3, 0, 0, 0],
          [0, 3, 0, 0, 0, 3, 0],
          [3, 0, 0, 3, 0, 0, 3]
        ];
      } else {
        myShape = [
          [0, 3, 0],
          [3, 0, 3],
          [0, 0, 0],
          [3, 3, 3],
          [0, 0, 0],
          [3, 0, 3],
          [0, 3, 0]
        ];
      }

      if (this.rows > myShape.length + 4) {
        const leftOffset = Math.floor((this.cols - myShape[0].length) / 2);
        const topOffset = Math.floor((this.rows - myShape.length) / 2);

        for (let i = 0; i < myShape.length; i++) {
          for (let j = 0; j < myShape[i].length; j++) {
            matrix[topOffset + i][leftOffset + j] = myShape[i][j];
          }
        }
      }

      return matrix;
    }
  };

  updateMatrix = () => {
    clearInterval(this.intervalRef);
    const { rows, cols } = this;
    const nextGen = this.getMatrix.empty();

    // data format for cells
    // 0 = empty, 1 = alive, 2 = forever dead, 3 = forever alive

    // interveral function
    // runs every .3 seconds.
    // reads values in the state matrix
    // then adds values to this.nextGen
    // when complete, it calls setState
    // with the new values.

    const scanNeighbors = (prev, i, j) => {
      const { matrix } = prev;
      // Because the the core cell is included in the count,
      // it has to be subtracted from the count (if alive).
      let aliveCount = matrix[i][j] ? -1 : 0;

      for (let row = i - 1; row < i + 2; row++) {
        for (let col = j - 1; col < j + 2; col++) {
          // 1 = alive,  3 = forever alive

          // Gets cell value, will wrap if index is out of range.
          const cellValue =
            matrix[row < 0 || row > rows - 1 ? (row < 0 ? rows - 1 : 0) : row][
              col < 0 || col > cols - 1 ? (col < 0 ? cols - 1 : 0) : col
            ];

          // If the cell is alive, adds to count.
          aliveCount += cellValue === 1 || cellValue === 3 ? 1 : 0;
        }
      }

      let cell = null;
      // If cell is alive
      if (matrix[i][j]) {
        if (aliveCount < 2 || aliveCount > 3) {
          cell = 0;
        } else {
          cell = 1;
        }
        // if cell is dead
      } else {
        if (aliveCount === 3) {
          cell = 1;
        } else {
          cell = 0;
        }
      }

      return cell;
    };

    this.intervalRef = setInterval(
      () => {
        if (this.state.isRunning) {
          this.setState(prev => {
            // Updates nextGen with new cell values.
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                // Gets current value of cell.
                switch (prev.matrix[i][j]) {
                  case 0:
                  case 1:
                    // Normal cell, use standard rules.
                    nextGen[i][j] = scanNeighbors(prev, i, j);
                    break;
                  case 2:
                  case 3:
                    // Fixed cell, use same value.
                    nextGen[i][j] = prev.matrix[i][j];
                    break;
                  default:
                    break;
                }
              }
            }
            // Makes copy
            const nextGenCopy = nextGen.map(row => [...row]);

            return {
              matrix: nextGenCopy,
              generation: prev.generation + 1
            };
          });
        }
      },
      // Interval frequency in mil sec
      300
    );
  };

  // USER INTERACTIONS - CONTROLS

  onSelection = selection => {
    this.setState({ userSelection: selection });
  };

  onRandomize = () => {
    this.setState({ matrix: this.getMatrix.random() });
  };

  onToggleStart = () => {
    this.setState(prev => ({ isRunning: prev.isRunning ? false : true }));
  };

  onClear = () => {
    this.setState({ isRunning: false });
    this.setGameSize();
    // Initualize
    this.setState({ matrix: this.getMatrix.empty(), generation: 0 });
    // Start updates
    this.updateMatrix();
  };

  onCellTap = (i, j) => {
    // Set cell value to that selected in controls.
    // (Will toggle if cell is already that value.)
    this.setState(prev => {
      // Makes copy
      const matrixCopy = prev.matrix.map(row => [...row]);
      // Updates value in copy
      matrixCopy[i][j] =
        matrixCopy[i][j] === this.state.userSelection
          ? 0
          : this.state.userSelection;
      // Updates state
      return { matrix: matrixCopy };
    });
  };

  render() {
    return (
      <div className="App">
        <Header generation={this.state.generation} />
        <Game matrix={this.state.matrix} onCellTap={this.onCellTap} />
        <Controls
          onSelection={this.onSelection}
          onRandomize={this.onRandomize}
          onToggleStart={this.onToggleStart}
          onClear={this.onClear}
          userSelection={this.state.userSelection}
          isRunning={this.state.isRunning}
          controlsBelowTheFold={this.state.controlsBelowTheFold}
        />
      </div>
    );
  }
}

export default App;
