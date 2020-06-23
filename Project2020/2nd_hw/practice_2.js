const Game = function() {  
    let width;
    let height;
    const cubes = [];
    const colors = ['red', 'blue', 'pink', 'purple', 'green', 'yellow'];
    let points = 0;

    const gameBoard = document.getElementById('gameBoard');
  
    let swapCube1 = null;
    let swapCube2 = null;

    this.initBoard = (_width, _height) => {
      width = _width;
      height = _height;
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const cube = {
            x: j,
            y: i,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
          row.push(cube);
        }
        cubes.push(row);
      } 
      this.render();
    };
  
    this.render = () => {
      //point 
      const pointCumulate = document.getElementById("point");
      pointCumulate.innerHTML = points;
      gameBoard.innerHTML = '';
      cubes.forEach(row => {
        const rowDom = document.createElement('div');
        rowDom.className = 'cube-row';
        row.forEach(cube => {
          const cubeDom = document.createElement('div');
          cubeDom.className = `cube ${cube.color}`;
          rowDom.appendChild(cubeDom);
          cube.dom = cubeDom;
          cubeDom.addEventListener('click', e => {
            // swap 구현 
            if (swapCube1 == null) {
              swapCube1 = cube;
            } else if (swapCube2 == null) {
              swapCube2 = cube;
            }
            if (swapCube1 && swapCube2) {
              this.swap(swapCube1, swapCube2);
              swapCube1 = null;
              swapCube2 = null;
            }
          });
        });
        gameBoard.appendChild(rowDom);
        // console.log(rowDom)
      });
    };
 
    // 3match가 일어난 cube를 리턴
    // 여기를 해야 하는군
    this.getMatchedCubes = () => {
      const matchedCubes = [];
      for (let q=0; q < height-2; q++) {
        for(let t =0; t< width ; t++) {
          if (cubes[q][t].color === cubes[q+1][t].color && cubes[q+1][t].color === cubes[q+2][t].color) {
            matchedCubes.push(cubes[q][t], cubes[q+1][t], cubes[q+2][t]);
            // console.log(q,t ,cubes[q][t].color , cubes[q+1][t].color, cubes[q+2][t].color)
          };
        };
      }
      for (let t = 0; t < width -2; t++ ){
        for(let q = 0; q <height; q++){
          if (cubes[q][t].color === cubes[q][t+1].color && cubes[q][t+1].color === cubes[q][t+2].color){
            matchedCubes.push(cubes[q][t], cubes[q][t+1], cubes[q][t+2]);
            
          };
        };
      };
      return matchedCubes;
    };

    this.generateNewBlocks = matchedCubes => {
      let NewBlockNumber = matchedCubes.length;
      for (let h = 0; h< NewBlockNumber; h++) {
        matchedCubes[h].color = colors[Math.floor(Math.random()*colors.length)];
        // random color 넣기
      }

    };

    this.handle3Match = () => {
      setTimeout(() => {
        const matchedCubes = this.getMatchedCubes();
        if(matchedCubes.length === 0) return;

        // points += getMatchedCubes.length;
        points += matchedCubes.length;
        // matchedCubes.remove(); 오류발생?? 
        this.generateNewBlocks(matchedCubes);
        this.render();
        this.handle3Match();
      }, 1000);
    };

// 인접한것만 swap
    this.swap = (cube1, cube2) => {
      const cubenumber1 = cube1.x - cube2.x;
      const cubenumber2 = cube1.y - cube2.y;
      let absol_1 = Math.abs(cubenumber1 + cubenumber2);
      console.log(absol_1); 
        if (absol_1 === 1) {
          cubes[cube2.y][cube2.x] = cube1;
          cubes[cube1.y][cube1.x] = cube2;
          const tempCoords = [cube1.y, cube1.x];
          cube1.y = cube2.y;
          cube1.x = cube2.x;
          cube2.y = tempCoords[0];
          cube2.x = tempCoords[1];
          this.render();
          this.handle3Match();
          // const matchedCubes = this.getMatchedCubes().length;
          //3match가 일어나지 않은 경우 swap 철회
          // if(matchedCubes === matchedCubes2 ) {
          //   console.log('nonono');
          //   const gogo = this.swap()
          //   gogo.end(cube1,cube2);
          //   return this.render(cube1,cube2);
          // };
        }
    };
  };
  
const game = new Game();

const form = document.getElementById('form');

const init = () => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let width = this.querySelector('[name="width"]').value;
    let height = this.querySelector('[name="height"]').value;
    game.initBoard(width, height);
  });
};

init();

// 점수: 4개 match시에 6으로 변화
// 3-match: 3 match 일어나지 않으면 다시 되돌리기