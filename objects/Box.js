class Box extends Mesh {
    constructor({
      width, height, depth, color = '#00ff00', velocity = {
        x: 0,
        y: 0,
        z: 0
      },
      position = {
        x: 0,
        y: 0,
        z: 0
      },
      zAccel = false,
    }) {
      super(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ color }))

      this.position.set(position.x, position.y, position.z)

      this.height = height
      this.width = width
      this.depth = depth
      this.color = color

      this.bottom = this.position.y - this.height / 2
      this.top = this.position.y + this.height / 2

      this.front = this.position.z + this.depth / 2
      this.back = this.position.z - this.depth / 2

      this.right = this.position.x + this.width / 2
      this.left = this.position.x - this.width / 2

      this.velocity = velocity
      this.gravity = -0.002

     // this.zAccel = zAccel

    }
    updateSides() {
      this.right = this.position.x + this.width / 2
      this.left = this.position.x - this.width / 2

      this.bottom = this.position.y - this.height / 2
      this.top = this.position.y + this.height / 2

      this.front = this.position.z + this.depth / 2
      this.back = this.position.z - this.depth / 2
    }

    update(ground) {

      this.updateSides()
     // if (zAccel) this.velocity.z += 0.0002
      this.position.x += this.velocity.x
      this.position.z += this.velocity.z

      this.applyGravity(ground)
    }
    applyGravity(ground) {

      this.velocity.y += this.gravity

      if (boxCollision({
        box1: this,
        box2: ground
      })) {
        this.velocity.y *= 0.8
        this.velocity.y = -this.velocity.y

      }
      else this.position.y += this.velocity.y
    }




  }

  export {Box};