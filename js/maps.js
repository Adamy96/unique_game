let maps = [{
  obstacles: [],
  obstaclesCreated: false,
  count: 0,
  chasers: [],
  bullets: [],

  createObstacles: () => {
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<< MAP 0 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    for (let i = 0; i < 25; i++) { // Chão
      // Posição Left, posição Top, speedX, speed Y, Tamanho
      maps[currentMap].obstacles.push(new Obstacle(i * tile1.size, canvas.height - tile1.size, 0, 0, tile1.size)); // Chão
    }

    maps[currentMap].obstacles.push(new Obstacle(4 * tile1.size, canvas.height - 4 *  tile1.size, 0, 0, tile1.size));
    maps[currentMap].obstacles.push(new Obstacle(18 * tile1.size, canvas.height - 4 * tile1.size, 0, 0, tile1.size));
  


  },

  draw: (player) => {
    // FUNDO "CAVERNA"
    ctx.drawImage(backgroundImg2, 0, 0, canvas.width, canvas.height - tile1.size);

    // Obstáculos
    for (let i = 0; i < maps[currentMap].obstacles.length; i++) {
      ctx.drawImage(cTile1, maps[currentMap].obstacles[i].x, maps[currentMap].obstacles[i].y, maps[currentMap].obstacles[i].size, maps[currentMap].obstacles[i].size);
      player.handleColision(maps[currentMap].obstacles[i]);
    }

    if (maps[currentMap].count % 1000 === 0) {
      let rndNum = Math.floor(Math.random() * 100);

      if (rndNum < 50) {
        maps[currentMap].chasers.push(new Chaser(100 + rndNum, -1.5 * tile1.size));
      } else {
        maps[currentMap].chasers.push(new Chaser(canvas.width - rndNum, -1.5 * tile1.size));
      }
    }

    for (let i = 0; i < maps[currentMap].chasers.length; i++) {
      // Chasers Health
      ctx.font = "25px Chilanka";
      ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
      // ctx.fillText('Chaser', maps[currentMap].chasers[i].x + 35, maps[currentMap].chasers[i].y - 65);
      ctx.fillText(`${maps[currentMap].chasers[i].currentHealth.toFixed(0)} / ${maps[currentMap].chasers[i].maxHealth}`, maps[currentMap].chasers[i].x + 20, maps[currentMap].chasers[i].y - 35);
      ctx.fillStyle = 'rgb(60, 60, 60)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, 100, 10);
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, maps[currentMap].chasers[i].currentHealth / 2, 10);

      ctx.drawImage(cChaser, maps[currentMap].chasers[i].x, maps[currentMap].chasers[i].y, maps[currentMap].chasers[i].width, maps[currentMap].chasers[i].height)
      
      if (player.checkColisionRectangle(maps[currentMap].chasers[i])) {
        player.health -= maps[currentMap].chasers[i].damage;

        // Knockback no player
        player.speedX = 8 * maps[currentMap].chasers[i].speedX;
        player.speedY = 3 * maps[currentMap].chasers[i].speedY;

        // Knockback no chaser
        maps[currentMap].chasers[i].x = maps[currentMap].chasers[i].x - 12 * player.speedX;
        maps[currentMap].chasers[i].y = maps[currentMap].chasers[i].y - 12 * player.speedY;
      }

      maps[currentMap].chasers[i].move(player);
    }

    // Desenhando as bullets
    for (let i = 0; i < maps[currentMap].bullets.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 40, 40, .9)';
      ctx.arc(maps[currentMap].bullets[i].x, maps[currentMap].bullets[i].y, maps[currentMap].bullets[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[currentMap].bullets[i].move();

      // Deletando a bala caso saia do mapa
      if (maps[currentMap].bullets[i].x < 0 || maps[currentMap].bullets[i].x > canvas.width || maps[currentMap].bullets[i].y < 0 || maps[currentMap].bullets[i].y > canvas.height) maps[currentMap].bullets.splice(i, 1);
    
      // Balas colidindo com os Chasers
      for (let j = 0; j < maps[currentMap].chasers.length; j++) {
        if (maps[currentMap].bullets[i].checkColisionRectangle(maps[currentMap].chasers[j])) {
          maps[currentMap].chasers[j].currentHealth -= maps[currentMap].bullets[i].damage;
          maps[currentMap].chasers[j].speedX = maps[currentMap].bullets[i].speedX;
          maps[currentMap].chasers[j].speedY = maps[currentMap].bullets[i].speedY;
          maps[currentMap].bullets.splice(i, 1);
          if (maps[currentMap].chasers[j].currentHealth <= 0) maps[currentMap].chasers.splice(j, 1);
        }
      }
      
    }

    maps[0].count += 1;

    // INFOS
    ctx.font = "50px Chilanka";
    ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
    ctx.fillText("Movements", 3.8 * tile1.size, 3 * tile1.size);
    ctx.drawImage(arrowKeysImg, 2 * tile1.size, 4 * tile1.size, 96 * 2, 63 * 2);
    ctx.drawImage(asdKeysImg, 7 * tile1.size, 4 * tile1.size, 96 * 2, 63 * 2);
    ctx.fillText("Attack", 18 * tile1.size, 3 * tile1.size);
    ctx.drawImage(mouseClickImg, 18.5 * tile1.size, 4 * tile1.size, 68 * 1.5, 95 * 1.5);

    // Health Player
    ctx.font = "25px Chilanka";
    ctx.fillText(`${player.health.toFixed(0)} / 100`, player.x + 10, player.y - 30);
    ctx.fillStyle = 'rgb(60, 60, 60)';
    ctx.fillRect(player.x + 10, player.y - 20, 100, 10);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(player.x + 10, player.y - 20, player.health, 10);
  },
}, { // <<<<<<<<<<<<<<<<<<<<<<<<<<<< MAP 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  obstacles: [],
  fireBalls: [],
  lava: [],
  obstaclesCreated: false,
  count: 0,
  chasers: [],
  bullets: [],

  createObstacles: () => {
    for (let i = 0; i < 25; i++) { // Chão
      // Posição Left, posição Top, speedX, speed Y, Tamanho
      maps[currentMap].obstacles.push(new Obstacle(i * tile1.size, canvas.height - tile1.size, 0, 0, tile1.size)); // Chão
    }
    maps[currentMap].obstacles.push(new Obstacle(9 * tile1.size, canvas.height - 2 * tile1.size, 0, 0, tile1.size));
    maps[currentMap].obstacles.push(new Obstacle(9 * tile1.size, canvas.height - 3 * tile1.size, 0, 0, tile1.size));
    maps[currentMap].obstacles.push(new Obstacle(8 * tile1.size, canvas.height - 2 * tile1.size, 0, 0, tile1.size));
    maps[currentMap].obstacles.push(new Obstacle(8 * tile1.size, canvas.height - 3 * tile1.size, 0, 0, tile1.size));
  
    for (let i = 0; i < 3; i++) {
      maps[currentMap].obstacles.push(new Obstacle((i + 11) * tile1.size, canvas.height - 4 * tile1.size, 0, 0, tile1.size));
    }

    for (let i = 0; i < 2; i++) {
      maps[currentMap].obstacles.push(new Obstacle((i + 17) * tile1.size, canvas.height - 4 * tile1.size, 0, 0, tile1.size));
    }

    for (let i = 0; i < 3; i++) {
      maps[currentMap].obstacles.push(new Obstacle((i + 22) * tile1.size, canvas.height - 4 * tile1.size, 0, 0, tile1.size));
    }

    maps[currentMap].lava.push(new Lava (10 * tile1.size, (canvas.height - 2 * tile1.size) + 10, 15 * tile1.size, tile1.size));
  },

  draw: (player) => {
    // FUNDO "CAVERNA"
    ctx.drawImage(backgroundImg2, 0, 0, canvas.width, canvas.height - tile1.size);

    // Obstáculos
    for (let i = 0; i < maps[currentMap].obstacles.length; i++) {
      ctx.drawImage(cTile1, maps[currentMap].obstacles[i].x, maps[currentMap].obstacles[i].y, maps[currentMap].obstacles[i].size, maps[currentMap].obstacles[i].size);
      player.handleColision(maps[currentMap].obstacles[i]);
      
    }

    if (maps[currentMap].count % 1000 === 0) {
      let rndNum = Math.floor(Math.random() * 100);

      if (rndNum < 50) {
        maps[currentMap].chasers.push(new Chaser(100 + rndNum, -1.5 * tile1.size));
      } else {
        maps[currentMap].chasers.push(new Chaser(canvas.width - rndNum, -1.5 * tile1.size));
      }
    }

    for (let i = 0; i < maps[currentMap].chasers.length; i++) {
      // Chasers Health
      ctx.font = "25px Chilanka";
      ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
      ctx.fillText(`${maps[currentMap].chasers[i].currentHealth.toFixed(0)} / ${maps[currentMap].chasers[i].maxHealth}`, maps[currentMap].chasers[i].x + 20, maps[currentMap].chasers[i].y - 35);
      ctx.fillStyle = 'rgb(60, 60, 60)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, 100, 10);
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, maps[currentMap].chasers[i].currentHealth / 2, 10);

      ctx.drawImage(cChaser, maps[currentMap].chasers[i].x, maps[currentMap].chasers[i].y, maps[currentMap].chasers[i].width, maps[currentMap].chasers[i].height)
      
      if (player.checkColisionRectangle(maps[currentMap].chasers[i])) {
        player.health -= maps[currentMap].chasers[i].damage;

        // Knockback no player
        player.speedX = 8 * maps[currentMap].chasers[i].speedX;
        player.speedY = 3 * maps[currentMap].chasers[i].speedY;

        // Knockback no chaser
        maps[currentMap].chasers[i].x = maps[currentMap].chasers[i].x - 12 * player.speedX;
        maps[currentMap].chasers[i].y = maps[currentMap].chasers[i].y - 12 * player.speedY;

      }

      maps[currentMap].chasers[i].move(player);
    }

    // Desenhando as bullets
    for (let i = 0; i < maps[currentMap].bullets.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 40, 40, .9)';
      ctx.arc(maps[currentMap].bullets[i].x, maps[currentMap].bullets[i].y, maps[currentMap].bullets[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[currentMap].bullets[i].move();

      // Deletando a bala caso saia do mapa
      if (maps[currentMap].bullets[i].x < 0 || maps[currentMap].bullets[i].x > canvas.width || maps[currentMap].bullets[i].y < 0 || maps[currentMap].bullets[i].y > canvas.height) maps[currentMap].bullets.splice(i, 1);
    
      // Balas colidindo com os Chasers
      for (let j = 0; j < maps[currentMap].chasers.length; j++) {
        if (maps[currentMap].bullets[i].checkColisionRectangle(maps[currentMap].chasers[j])) {
          maps[currentMap].chasers[j].currentHealth -= maps[currentMap].bullets[i].damage;
          maps[currentMap].chasers[j].speedX = maps[currentMap].bullets[i].speedX;
          maps[currentMap].chasers[j].speedY = maps[currentMap].bullets[i].speedY;
          maps[currentMap].bullets.splice(i, 1);
          if (maps[currentMap].chasers[j].currentHealth <= 0) maps[currentMap].chasers.splice(j, 1);
        }
      }
      
    }


    // Lava
    for (let i = 0; i < maps[currentMap].lava.length; i++) {
      ctx.beginPath();
      ctx.drawImage(cLava, maps[currentMap].lava[i].x, maps[currentMap].lava[i].y, maps[currentMap].lava[i].width, maps[currentMap].lava[i].height)
      if (player.checkColisionRectangle(maps[currentMap].lava[i])) {
        player.health -= maps[currentMap].lava[i].damage;
      }
    }
    
    ctx.font = "50px Chilanka";
    ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
    ctx.fillText("You will never get over your fears", 5 * tile1.size, 3 * tile1.size);

    // Health Player
    ctx.font = "25px Chilanka";
    ctx.fillText(`${player.health.toFixed(0)} / 100`, player.x + 10, player.y - 30);
    ctx.fillStyle = 'rgb(60, 60, 60)';
    ctx.fillRect(player.x + 10, player.y - 20, 100, 10);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(player.x + 10, player.y - 20, player.health, 10);
    
    maps[currentMap].count += 1;

    if (maps[currentMap].count % 300 === 0) {
      maps[currentMap].fireBalls.push(new FireBall(15.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
      maps[currentMap].fireBalls.push(new FireBall(20.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
    }
    
    for (let i = 0; i < maps[currentMap].fireBalls.length; i++) {
      ctx.beginPath();
      ctx.arc(maps[currentMap].fireBalls[i].x, maps[currentMap].fireBalls[i].y, maps[currentMap].fireBalls[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[currentMap].fireBalls[i].move();
      if (player.checkColisionSphere(maps[currentMap].fireBalls[i])) { // Player colidindo com as fireBalls
        player.health -= maps[currentMap].fireBalls[i].damage;
        maps[currentMap].fireBalls.splice(i, 1);
      }
      if (maps[currentMap].fireBalls[i].y > canvas.height - 2 * tile1.size) { // Excluindo as fireBalls que sairem do mapa
        maps[currentMap].fireBalls.splice(i, 1);
      }
    }
  }

}, { // <<<<<<<<<<<<<<<<<<<<<<<<<<<< MAP 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  obstacles: [],
  fireBalls: [],
  lava: [],
  obstaclesCreated: false,
  count: 0,
  bullets: [],
  chasers: [],

  createObstacles: () => {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) { // Base esquerda
        maps[2].obstacles.push(new Obstacle(i * tile1.size, canvas.height - (j + 1) * tile1.size, 0, 0, tile1.size));
      }
    }

    // Chão
    for (let i = 0; i < 23; i++) {
      maps[2].obstacles.push(new Obstacle((i + 1) * tile1.size, canvas.height - (1 * tile1.size), 0, 0, tile1.size));
    }

    // Plataformas
    for (let i = 0; i < 4; i++) {
      maps[2].obstacles.push(new Obstacle((i + 1) * 5 * tile1.size, canvas.height - (5 * tile1.size), 0, 0, tile1.size));
      console.log(maps[2].obstacles[maps[2].obstacles.length - 1]);
    }

    for (let i = 0; i < 4; i++) {
      maps[2].obstacles.push(new Obstacle(24 * tile1.size, canvas.height - (i + 1) * tile1.size, 0, 0, tile1.size));
    }

    maps[2].lava.push(new Lava (2 * tile1.size, (canvas.height - 2 * tile1.size) + 10, 22 * tile1.size, tile1.size));
  },

  draw: (player) => {
    // FUNDO "CAVERNA"
    ctx.drawImage(backgroundImg2, 0, 0, canvas.width, canvas.height - tile1.size);

    // Obstáculos
    for (let i = 0; i < maps[2].obstacles.length; i++) {
      ctx.drawImage(cTile1, maps[2].obstacles[i].x, maps[2].obstacles[i].y, maps[2].obstacles[i].size, maps[2].obstacles[i].size);
      player.handleColision(maps[currentMap].obstacles[i]);
    }

    // Lava
    for (let i = 0; i < maps[2].lava.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.drawImage(cLava, maps[2].lava[i].x, maps[2].lava[i].y, maps[2].lava[i].width, maps[2].lava[i].height)
      if (player.checkColisionRectangle(maps[2].lava[i])) {
        player.health -= maps[2].lava[i].damage;
      }
    }

    if (maps[2].count % 300 === 0) {
      maps[2].fireBalls.push(new FireBall(3.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
      maps[2].fireBalls.push(new FireBall(8.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
      maps[2].fireBalls.push(new FireBall(13.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
      maps[2].fireBalls.push(new FireBall(18.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
      maps[2].fireBalls.push(new FireBall(22.5 * tile1.size, canvas.height - 2 * tile1.size, 0, -8, 25, 0.1));
    }

    if (maps[2].count % 900 === 0) {
      maps[2].fireBalls.push(new FireBall(canvas.width, canvas.height - 6 * tile1.size, -6, -0, 25));
      maps[2].fireBalls.push(new FireBall(canvas.width, canvas.height - 6 * tile1.size, -6, -0, 25));
      maps[2].fireBalls.push(new FireBall(canvas.width, canvas.height - 6 * tile1.size, -6, -0, 25));
      maps[2].fireBalls.push(new FireBall(canvas.width, canvas.height - 6 * tile1.size, -6, -0, 25));
      maps[2].fireBalls.push(new FireBall(canvas.width, canvas.height - 6 * tile1.size, -6, -0, 25));
    }

    maps[2].count += 1;

    for (let i = 0; i < maps[2].fireBalls.length; i++) {
      ctx.beginPath();
      ctx.arc(maps[2].fireBalls[i].x, maps[2].fireBalls[i].y, maps[2].fireBalls[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[2].fireBalls[i].move();
      if (player.checkColisionSphere(maps[2].fireBalls[i])) { // Player colidindo com as fireBalls
        player.health -= maps[2].fireBalls[i].damage;
        maps[2].fireBalls.splice(i, 1);
      }
      if (maps[2].fireBalls[i].y > canvas.height - 2 * tile1.size) { // Excluindo as fireBalls que sairem do mapa
        maps[2].fireBalls.splice(i, 1);
      }
    }

    // Desenhando as bullets
    for (let i = 0; i < maps[currentMap].bullets.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 40, 40, .9)';
      ctx.arc(maps[currentMap].bullets[i].x, maps[currentMap].bullets[i].y, maps[currentMap].bullets[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[currentMap].bullets[i].move();

      // Deletando a bala caso saia do mapa
      if (maps[currentMap].bullets[i].x < 0 || maps[currentMap].bullets[i].x > canvas.width || maps[currentMap].bullets[i].y < 0 || maps[currentMap].bullets[i].y > canvas.height) maps[currentMap].bullets.splice(i, 1);
    
      // Balas colidindo com os Chasers
      for (let j = 0; j < maps[currentMap].chasers.length; j++) {
        if (maps[currentMap].bullets[i].checkColisionRectangle(maps[currentMap].chasers[j])) {
          maps[currentMap].chasers[j].currentHealth -= maps[currentMap].bullets[i].damage;
          maps[currentMap].chasers[j].speedX = maps[currentMap].bullets[i].speedX;
          maps[currentMap].chasers[j].speedY = maps[currentMap].bullets[i].speedY;
          maps[currentMap].bullets.splice(i, 1);
          if (maps[currentMap].chasers[j].currentHealth <= 0) maps[currentMap].chasers.splice(j, 1);
        }
      }
      
    }
    
    ctx.font = "50px Chilanka";
    ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
    ctx.fillText("They will haunt you forever", 7 * tile1.size, 3 * tile1.size);

    ctx.font = "25px Chilanka";
    ctx.fillText(`${player.health.toFixed(0)} / 100`, player.x + 10, player.y - 30);
    ctx.fillStyle = 'rgb(60, 60, 60)';
    ctx.fillRect(player.x + 10, player.y - 20, 100, 10);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(player.x + 10, player.y - 20, player.health, 10);

  }
}, { // <<<<<<<<<<<<<<<<<<<<<<<<<<<< MAP 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  obstacles: [],
  fireBalls: [],
  lava: [],
  obstaclesCreated: false,
  count: 0,
  chasers: [],
  bullets: [],

  createObstacles: () => {
    for (let i = 0; i < 25; i++) { // Chão
      maps[3].obstacles.push(new Obstacle(i * tile1.size, canvas.height - tile1.size, 0, 0, tile1.size));
    }

    maps[3].obstacles.push(new Obstacle(3 * tile1.size, canvas.height - 4 *  tile1.size, 0, 0, tile1.size));
    maps[3].obstacles.push(new Obstacle(7 * tile1.size, canvas.height - 6 * tile1.size, 0, 0, tile1.size));
    maps[3].obstacles.push(new Obstacle(11 * tile1.size, canvas.height - 8 * tile1.size, 0, 0, tile1.size));
    maps[3].obstacles.push(new Obstacle(15 * tile1.size, canvas.height - 6 * tile1.size, 0, 0, tile1.size));
    maps[3].obstacles.push(new Obstacle(19 * tile1.size, canvas.height - 4 * tile1.size, 0, 0, tile1.size));
  },

  draw: (player) => {
    // FUNDO "CAVERNA"
    ctx.drawImage(backgroundImg2, 0, 0, canvas.width, canvas.height - tile1.size);

    // Obstáculos
    for (let i = 0; i < maps[3].obstacles.length; i++) {
      ctx.drawImage(cTile1, maps[3].obstacles[i].x, maps[3].obstacles[i].y, maps[3].obstacles[i].size, maps[3].obstacles[i].size);
      player.handleColision(maps[currentMap].obstacles[i]);
    }


    // Desenhando o boss
    ctx.drawImage(cBoss, boss.x, boss.y, boss.width, boss.height);

    // "Acionando" os outros estágios do boss
    if (boss.currentHealth > 0.75 * boss.maxHealth && maps[3].count % 250 === 0) {
      boss.pattern100();
    } else if (boss.currentHealth > 0.5 * boss.maxHealth && maps[3].count % 250 === 0) {
      boss.pattern75();
    } else if (boss.currentHealth > 0.25 * boss.maxHealth && maps[3].count % 250 === 0) {
      boss.pattern50();
    } else if (boss.currentHealth > 0 && maps[3].count % 125 === 0){
      boss.pattern25();
    }

    // Inserindo chasers
    if (maps[currentMap].count % 1000 === 0 && boss.currentHealth < 0.5 * boss.maxHealth) {
      let rndNum = Math.floor(Math.random() * 100);

      if (rndNum < 50) {
        maps[currentMap].chasers.push(new Chaser(100 + rndNum, -1.5 * tile1.size));
      } else {
        maps[currentMap].chasers.push(new Chaser(canvas.width - rndNum, -1.5 * tile1.size));
      }
    }

    // Iterando sobre os Chasers
    for (let i = 0; i < maps[currentMap].chasers.length; i++) {
      // Chasers Health
      ctx.font = "25px Chilanka";
      ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
      // ctx.fillText('Chaser', maps[currentMap].chasers[i].x + 35, maps[currentMap].chasers[i].y - 65);
      ctx.fillText(`${maps[currentMap].chasers[i].currentHealth.toFixed(0)} / ${maps[currentMap].chasers[i].currentHealth}`, maps[currentMap].chasers[i].x + 20, maps[currentMap].chasers[i].y - 35);
      ctx.fillStyle = 'rgb(60, 60, 60)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, 100, 10);
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(maps[currentMap].chasers[i].x + 25, maps[currentMap].chasers[i].y - 25, maps[currentMap].chasers[i].currentHealth / 2, 10);

      ctx.drawImage(cChaser, maps[currentMap].chasers[i].x, maps[currentMap].chasers[i].y, maps[currentMap].chasers[i].width, maps[currentMap].chasers[i].height)
      
      if (player.checkColisionRectangle(maps[currentMap].chasers[i])) {
        player.health -= maps[currentMap].chasers[i].damage;

        // Knockback no player
        player.speedX = 8 * maps[currentMap].chasers[i].speedX;
        player.speedY = 3 * maps[currentMap].chasers[i].speedY;

        // Knockback no chaser
        maps[currentMap].chasers[i].x = maps[currentMap].chasers[i].x - 12 * player.speedX;
        maps[currentMap].chasers[i].y = maps[currentMap].chasers[i].y - 12 * player.speedY;

      }

      maps[currentMap].chasers[i].move(player);
    }

    // Desenho das schytes + Player colidindo com as schytes1
    for (let i = 0; i < boss.schytes1.length; i++) {
      ctx.drawImage(cSchyte, boss.schytes1[i].srcX, boss.schytes1[i].srcY, boss.schytes1[i].frameWidth, boss.schytes1[i].frameHeight, boss.schytes1[i].x, boss.schytes1[i].y, boss.schytes1[i].width, boss.schytes1[i].height);

      if (player.checkColisionRectangle(boss.schytes1[i])) {
        player.health -= boss.schytes1[i].damage;
        boss.schytes1.splice(i, 1);
      }

      boss.schytes1[i].move();
    }

  // Desenho das schytes + Player colidindo com as schytes2
    for (let i = 0; i < boss.schytes2.length; i++) {
      ctx.drawImage(cSchyte, boss.schytes2[i].srcX, boss.schytes2[i].srcY, boss.schytes2[i].frameWidth, boss.schytes2[i].frameHeight, boss.schytes2[i].x, boss.schytes2[i].y, boss.schytes2[i].width, boss.schytes2[i].height);
      
      if (player.checkColisionRectangle(boss.schytes2[i])) {
        console.log(player.health);
        player.health -= boss.schytes2[i].damage;
        boss.schytes2.splice(i, 1);
      }

      boss.schytes2[i].move();
    }

    // Desenhando as bullets
    for (let i = 0; i < maps[currentMap].bullets.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 40, 40, .9)';
      ctx.arc(maps[currentMap].bullets[i].x, maps[currentMap].bullets[i].y, maps[currentMap].bullets[i].size, 0, Math.PI * 2);
      ctx.fill();
      maps[currentMap].bullets[i].move();

      // Deletando a bala caso saia do mapa
      if (maps[currentMap].bullets[i].x < 0 || maps[currentMap].bullets[i].x > canvas.width || maps[currentMap].bullets[i].y < 0 || maps[currentMap].bullets[i].y > canvas.height) maps[currentMap].bullets.splice(i, 1);
    
      // Balas colidindo com os Chasers
      for (let j = 0; j < maps[currentMap].chasers.length; j++) {
        if (maps[currentMap].bullets[i].checkColisionRectangle(maps[currentMap].chasers[j])) {
          maps[currentMap].chasers[j].currentHealth -= maps[currentMap].bullets[i].damage;
          maps[currentMap].chasers[j].speedX = maps[currentMap].bullets[i].speedX;
          maps[currentMap].chasers[j].speedY = maps[currentMap].bullets[i].speedY;
          maps[currentMap].bullets.splice(i, 1);
          if (maps[currentMap].chasers[j].currentHealth <= 0) maps[currentMap].chasers.splice(j, 1);
        }
      }
      
      // Balas colidindo com o Boss
        if (maps[currentMap].bullets[i].checkColisionRectangle(boss)) {
          boss.currentHealth -= maps[currentMap].bullets[i].damage;
          maps[currentMap].bullets.splice(i, 1);
        }

    
  }

    // Frase
    ctx.font = "50px Chilanka";
    ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
    ctx.fillText("Unless you DEFEAT them!", 7 * tile1.size, 3 * tile1.size);

    ctx.font = "25px Chilanka";
    ctx.fillText(`${boss.currentHealth.toFixed(0)} / 2000`, boss.x + 55, boss.y - 50);
    ctx.fillStyle = 'rgb(60, 60, 60)';
    ctx.fillRect(boss.x + 25, boss.y - 40, 200, 20);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(boss.x + 25, boss.y - 40, boss.currentHealth / 10, 20);

    ctx.fillStyle = 'rgba(255 ,255 ,255 , .6)';
    ctx.font = "25px Chilanka";
    ctx.fillText(`${player.health.toFixed(0)} / 100`, player.x + 10, player.y - 30);
    ctx.fillStyle = 'rgb(60, 60, 60)';
    ctx.fillRect(player.x + 10, player.y - 20, 100, 10);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(player.x + 10, player.y - 20, player.health, 10); 

    maps[3].count += 1;
  }
}];