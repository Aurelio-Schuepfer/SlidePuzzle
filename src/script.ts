let isPuzzleStarted = false;
let tiles: (number | string)[] = [];  

function setHeaderText(text: string) {
  const h2 = document.querySelector('h2');
  if (h2) h2.innerHTML = text;
} 

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.code === "Space") {
      if (!isPuzzleStarted) {
          isPuzzleStarted = true;
          startPuzzle();
          setHeaderText('Press <span>⌨️</span> Space to Reset');
      } else {
          startPuzzle();
          setHeaderText('Press <span>⌨️</span> Space to Reset');
      }
  }
});

function shuffleArray(array: (number | string)[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getTileStyle(tile: number | string): string {
  if (tile === "empty") return "";
  const colors = [
      "#ff595e", "#ffca3a", "#8ac926",
      "#1982c4", "#6a4c93", "#f72585",
      "#b5179e", "#4361ee", "#4cc9f0"
  ];
  const idx = typeof tile === "number" ? tile - 1 : 0;
  return `background-color: ${colors[idx]};`;
}

function startPuzzle(): void {
  tiles = [1, 2, 3, 4, 5, 6, 7, 8, "empty"];
  shuffleArray(tiles);
  generateGrid(tiles, true); 
  animateTiles();
}

function generateGrid(tiles: (number | string)[], animate = false): void {
  const puzzleGrid = document.querySelector('.puzzle-grid') as HTMLElement;

  if (puzzleGrid) {
      puzzleGrid.innerHTML = "";
  }

  tiles.forEach((tile, index) => {
    const tileDiv = document.createElement('div');
    tileDiv.setAttribute('draggable', 'true');

    if (tile === "empty") {
        tileDiv.classList.add("empty");
    } else {
        tileDiv.textContent = tile.toString();
        tileDiv.setAttribute("style", getTileStyle(tile));
    }

      tileDiv.addEventListener('dragstart', (e: DragEvent) => {
          const dataTransfer = e.dataTransfer;
          if (dataTransfer) {
              dataTransfer.setData('text/plain', index.toString());
          }
          tileDiv.classList.add("dragging");
      });

      tileDiv.addEventListener('dragend', () => {
          tileDiv.classList.remove("dragging"); 
      });

      puzzleGrid.appendChild(tileDiv);
  });

  resetTileAnimations(!animate);

  if (puzzleGrid) {
      puzzleGrid.addEventListener('dragover', (e: DragEvent) => {
          e.preventDefault();
      });

      puzzleGrid.addEventListener('drop', (e: DragEvent) => {
          const draggedIndex = e.dataTransfer?.getData('text/plain');
          if (draggedIndex) {
              const dragged = parseInt(draggedIndex);
              const emptyIndex = findEmptyTile(tiles);

              if (isAdjacent(dragged, emptyIndex)) {
                  [tiles[dragged], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[dragged]];
                  generateGrid(tiles, false);
                  if (isSolved(tiles)) {
                      setHeaderText('🎉 You solved the puzzle! Press <span>⌨️</span> Space to Play Again');
                  }
              }
          }
      });
  }
}

function animateTiles(): void {
    if (!isPuzzleStarted) return;

    const tiles = document.querySelectorAll('.puzzle-grid div');
    tiles.forEach((tile, index) => {
        if (!tile.classList.contains("empty")) {
            (tile as HTMLElement).classList.add("start-anim");
        }
    });
}

function resetTileAnimations(visible = true): void {
  const tiles = document.querySelectorAll('.puzzle-grid div');
  tiles.forEach(tile => {
      tile.classList.remove("start-anim");
      if (visible) {
          (tile as HTMLElement).style.opacity = "1";
          (tile as HTMLElement).style.transform = "scale(1)";
      } else {
          (tile as HTMLElement).style.opacity = "0";
          (tile as HTMLElement).style.transform = "scale(0)";
      }
  });
}

function findEmptyTile(tiles: (number | string)[]): number {
    return tiles.indexOf("empty");
}

function isAdjacent(index1: number, index2: number): boolean {
    const rowSize = 3;
    const row1 = Math.floor(index1 / rowSize);
    const col1 = index1 % rowSize;
    const row2 = Math.floor(index2 / rowSize);
    const col2 = index2 % rowSize;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

function isSolved(tiles: (number | string)[]): boolean {
    const solution = [1,2,3,4,5,6,7,8,"empty"];
    return tiles.every((val, idx) => val === solution[idx]);
}

function renderPreviewGrid(): void {
  const previewGrid = document.querySelector('.preview-grid');
  if (!previewGrid) return;
  previewGrid.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
      const div = document.createElement('div');
      if (i === 9) {
          div.classList.add("empty");
      } else {
          div.textContent = i.toString();
          div.setAttribute("style", getTileStyle(i));
      }
      previewGrid.appendChild(div);
  }
}

renderPreviewGrid();