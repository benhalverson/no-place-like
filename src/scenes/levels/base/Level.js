import {Scene} from 'phaser';
import MCAfrica from '../../../sprites/pc/MCAfrica';

class Level extends Scene {
  initScene({bgColor = '#f5efbf', MCClass = MCAfrica, tilemapKey = 'africa-camp-map', tilesetName = 'Basic', tilesetImage = 'basic-tiles', collisionTiles = [[1, 4], [8, 11], [15, 16]], enemies = []}) {
    // Set BG colour
    this.cameras.main.setBackgroundColor(bgColor);
    this.cameras.main.setRoundPixels(true); // seems to solve the janky lines ¯\_(ツ)_/¯

    // Enable multi-touch
    this.input.addPointer(2);

    // Add our sprite to jump around on them
    this.enemies = this.physics.add.group(enemies, {});

    this.mc = new MCClass({
      key: 'mc',
      scene: this,
      x: 500,
      y: 0,
      enemies
      // showHP: true
    });

    // Add our maaaaaaap!
    this.map = this.make.tilemap({ key: tilemapKey, tileWidth: 100, tileHeight: 100 });
    const tileset = this.map.addTilesetImage(tilesetName, tilesetImage);
    
    // Map layers
    this.behindLayer = this.map.createStaticLayer('behind-mc', tileset, 0, 0);    
    this.aboveLayer = this.map.createStaticLayer('above-mc', tileset, 0, 0);
    this.solidLayer = this.map.createStaticLayer('solid', tileset, 0, 0);

    // Map v MC collisions
    for (let i = 0; i < collisionTiles.length; i++) {
      const tiles = collisionTiles[i];
      this.solidLayer.setCollisionBetween(tiles[0], tiles[1]);
    }

    // MC vs enemies & solidLayer collisions
    this.physics.add.collider(this.mc, this.solidLayer);
    this.physics.add.collider(this.enemies, this.solidLayer);

    // Add an HP ticker
    this.hpText = this.add.text(20, 20, 'XX / XX', { fontFamily: 'Sans Serif', color: '#FFF' });
    this.hpText.setScrollFactor(0);

    // Setup our layering
    this.behindLayer.setDepth(-1);
    this.aboveLayer.setDepth(1);
    this.solidLayer.setDepth(0);
    this.mc.setDepth(0);
    this.enemies.setDepth(0);
    this.hpText.setDepth(2);

    // Set camera follow
    this.cameras.main.startFollow(this.mc);
  }

}

export default Level;