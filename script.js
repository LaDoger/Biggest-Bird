document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
  
    const bird = {
      x: 50,
      y: canvas.height / 2,
      width: 50,
      height: 50,
      velocity: 0,
      gravity: 0.1,
      jumpHeight: -5,
    };
  
    const pipe = {
      width: 80,
      gapHeight: 150,
      speed: 2,
      pairs: [],
    };
  
    function drawBird() {
      ctx.fillStyle = 'red';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
  
    function drawPipes() {
      ctx.fillStyle = 'white';
  
      pipe.pairs.forEach(pair => {
        ctx.fillRect(pair.x, pair.topPipe.y, pipe.width, pair.topPipe.height);
        ctx.fillRect(pair.x, pair.bottomPipe.y, pipe.width, pair.bottomPipe.height);
      });
    }
  
    function updatePipes() {
      const randomDistance = Math.random() * (600 - 300) + 300;
  
      if (pipe.pairs.length === 0 || pipe.pairs[pipe.pairs.length - 1].x < canvas.width - randomDistance) {
        const topPipeHeight = Math.random() * (canvas.height - pipe.gapHeight - 100) + 50;
        const randomGapHeight = Math.random() * (200 - 120) + 200;
        const bottomPipeY = topPipeHeight + randomGapHeight;
        const bottomPipeHeight = canvas.height - bottomPipeY;
  
        pipe.pairs.push({
          x: canvas.width,
          topPipe: { y: 0, height: topPipeHeight },
          bottomPipe: { y: bottomPipeY, height: bottomPipeHeight },
        });
      }
  
      pipe.pairs.forEach(pair => {
        pair.x -= pipe.speed;
  
        // Collision detection
        if (
          bird.x + bird.width > pair.x &&
          bird.x < pair.x + pipe.width &&
          (bird.y < pair.topPipe.height || bird.y + bird.height > pair.bottomPipe.y)
        ) {
          resetGame();
        }
      });
  
      // Remove off-screen pipes
      if (pipe.pairs[0] && pipe.pairs[0].x < -pipe.width) {
        pipe.pairs.shift();
      }
    }
  
    function resetGame() {
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      pipe.pairs = [];
    }
  
    function drawTitle() {
        const title = 'Biggest Bird';
        ctx.fillStyle = 'red';
        ctx.font = '48px Ubuntu Mono, bold';
        const titleWidth = ctx.measureText(title).width;
        const titleX = (canvas.width - titleWidth) / 2;
        const titleY = 50;
        ctx.fillText(title, titleX, titleY);
      }
    
      function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
    
        if (bird.y < 0 || bird.y + bird.height > canvas.height) {
          resetGame();
        }
    
        updatePipes();
        drawPipes();
        drawBird();
        drawTitle(); // Add this line
    
        requestAnimationFrame(gameLoop);
      }
    
      gameLoop();
    
      window.addEventListener('keydown', e => {
        if (e.key === ' ') {
          bird.velocity = bird.jumpHeight;
        }
      });
    });