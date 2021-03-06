import './tutrial.css'
import React from 'react';
// import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.SquareNum = 0;
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                className = {this.props.classNames[i] ? "highlight_square":"square"}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquareRow(){
        var SquareRow = [];
        for(let i=0; i<3; i++){
            SquareRow = SquareRow.concat(this.renderSquare(this.SquareNum));
            this.SquareNum ++;
        }
        return(
            <div className="board-row">
                {SquareRow}
            </div>
        );
    }

    render() {
        var Board = [];
        this.SquareNum=0;
        for(let i=0; i<3; i++){
            Board = Board.concat(this.renderSquareRow());
        }
        return (
            <div>
                {Board}
            </div>
        );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null), 
          column_number: null
        }
      ],
      highlights: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
      IsListAsc: true
    };
  }

  highlight_line(line){
    let new_arr = this.state.highlights.slice();
    line.forEach(element => {
      new_arr[element]=true;
    });
    this.setState({
      highlights: new_arr
    })
  }

  delete_highlight(){
    this.setState({
      highlights: Array(9).fill(null)
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let win = calculateWinner(squares);
    if (win.winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    let new_win = calculateWinner(squares);
    if (new_win.winner==="DRAW"){
    }else if (new_win.winner){
      this.highlight_line(new_win.win_line);
    }else if (!new_win.winner){
      this.delete_highlight();
    }

    this.setState({
      history: history.concat([
        {
          squares: squares,
          column_number: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  getOrderedMoves(){
    var history = this.state.history;
    if(!this.state.IsListAsc){
        history = history.slice().reverse();
        const moves = history.map((step, move) => {
            move = history.length - move -1;
            const desc = move ?
            'Go to move #' + move + '(' + (step.column_number%3 + 1) + ', '+ (Math.floor(step.column_number/3)+1) +')' :
            'Go to game start';
            if(this.state.stepNumber===move){
                return (
                    <li key={move}>
                        <button className="active" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else{
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }});
        return (moves);
    }
    else{
        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move + '(' + (step.column_number%3 + 1) + ', '+ (Math.floor(step.column_number/3)+1) +')' :
            'Go to game start';
            if(this.state.stepNumber===move){
                return (
                    <li key={move}>
                        <button className="active" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else{
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }});
        return (moves);
    }
  }


  handleIsAscClick(){
    this.setState(
        {IsListAsc: !this.state.IsListAsc}
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);
    const moves = this.getOrderedMoves();

    let status;
    if(win.winner === "DRAW"){
      status = "the game is draw...............";
    }else if (win.winner) {
      status = "Winner: " + win.winner;
    }else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let order = this.state.IsListAsc ?"ASC" : "DESC";

    return (
      <div className="game">
        <div className="game-board">
          <Board
            classNames={this.state.highlights}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleIsAscClick()}>{order}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;

// ========================================

// ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  let win = {winner: null, win_line: null};
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      win.winner = squares[a];
      win.win_line = [a, b, c];
      return win;
    }
  }
  let notnullSquareNum =0;
  squares.forEach(element => {
    if(element!=null){
      notnullSquareNum ++;
    }
  });
  if(notnullSquareNum===9){
    win.winner = "DRAW";
  }
  return win;
}
