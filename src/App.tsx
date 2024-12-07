import React, { useEffect, useState } from 'react';
import './App.css';
import CustomModal from './modals/CustomModal';
import GameIntroModal from './modals/GameIntroModal';

type Cell = {
    value: string | null;
    highlighted: boolean;
};

const generateGrid = (size: number): Cell[][] => {
    const elements = ['🔴', '🟢', '🔵', '🟡', '🟠'];
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
            value: elements[Math.floor(Math.random() * elements.length)],
            highlighted: false,
        }))
    );
};

const App: React.FC = () => {
    const [gridSize, setGridSize] = useState<number>(5);
    const [grid, setGrid] = useState<Cell[][]>(generateGrid(gridSize));
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showIntro, setShowIntro] = useState(true);


    useEffect(() => {
        const storedHighScore = localStorage.getItem('highScore');
        const storedGridSize = localStorage.getItem('gridSize');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore));
        }
        if (storedGridSize) {
            setGridSize(parseInt(storedGridSize));
        }

        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setShowIntro(true);
            localStorage.setItem('hasSeenIntro', 'true');
        }
    }, []);

    // Initialize the grid
    useEffect(() => {
      resetGrid()
    }, [gridSize])

    const resetGrid = () => {
        setGrid(generateGrid(gridSize));
        setScore(0);
    };

    const resetHighlight = (grid: Cell[][]) => {
        return grid.map((row) =>
            row.map((cell) => ({
                ...cell,
                highlighted: false,
            }))
        );
    };

    const findAdjacent = (row: number, col: number): [number, number][] => {
        const targetValue = grid[row][col].value;
        const visited = new Set<string>();
        const adjacent: [number, number][] = [];

        const dfs = (r: number, c: number) => {
            if (
                r < 0 ||
                c < 0 ||
                r >= gridSize ||
                c >= gridSize ||
                grid[r][c].value !== targetValue ||
                visited.has(`${r}-${c}`)
            ) {
                return;
            }

            visited.add(`${r}-${c}`);
            adjacent.push([r, c]);

            dfs(r - 1, c);
            dfs(r + 1, c);
            dfs(r, c - 1);
            dfs(r, c + 1);
        };

        dfs(row, col);
        return adjacent;
    };

    const handleCellClick = (row: number, col: number) => {
         if (isProcessing) return;

        if(grid[row][col].value === null) return;

        let newGrid = resetHighlight(grid);
        const adjacentCells = findAdjacent(row, col);

        if (adjacentCells.length > 1) {
          setIsProcessing(true);

          adjacentCells.forEach(([r, c]) => {
              newGrid[r][c].highlighted = true;
          });
          setGrid([...newGrid]);

          setTimeout(() => {
              adjacentCells.forEach(([r, c]) => {
                  newGrid[r][c] = {
                      ...newGrid[r][c],
                      value: null,
                      highlighted: false,
                  };
              });
              setGrid([...newGrid]);
              const pointsEarned = adjacentCells.length * 10;
              setScore((prevScore) => {
                  const newScore = prevScore + pointsEarned;
                  if (newScore > highScore) {
                      setHighScore(newScore);
                      localStorage.setItem('highScore', newScore.toString());
                  }
                  return newScore;
              });
              setIsProcessing(false);
          }, 1000);
        }
    };

    const renderGrid = () => {
        return grid.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
                {row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`cell 
            ${cell.highlighted ? 'highlighted' : ''}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                        {cell.value || ''}
                    </div>
                ))}
            </div>
        ));
    };

    const handleCustomSizeSubmit = (customSize: number | string) => {
        if (typeof customSize === 'string' || (typeof customSize === 'number' && customSize <= 1)) return;
        setGridSize(customSize);
        localStorage.setItem('gridSize', customSize.toString());
        setGrid(generateGrid(Number(customSize)));
        setIsModalOpen(false);
        setScore(0);
    };

    return (
        <div className="App">
            <div className='flex justify-center items-center flex-col'>
                <h1>Grid Matching Game</h1>
                <div className="button-container">
                    <button onClick={() => setIsModalOpen(true)}>
                        Customize Grid
                    </button>
                    <button onClick={resetGrid}>Reset Grid</button>
                </div>
                <div className="scoreboard">
                    <p>Score: {score}</p>
                    <p>High Score: {highScore}</p>
                </div>
                <div className="grid">{renderGrid()}</div>

            </div>
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialGridSize={gridSize}
                onApply={handleCustomSizeSubmit}
            />
            {showIntro && (
                <GameIntroModal onClose={() => setShowIntro(false)} />
            )}
        </div>
    );
};

export default App;
