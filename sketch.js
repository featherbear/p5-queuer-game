class Slot {
  constructor (length, xLimit, cellWidth, cellHeight) {
    this.length = length
    console.log(xLimit, length)
    this.x = Math.floor(Math.random() * (xLimit - length + 1))
    this.xLimit = xLimit
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight
  }

  draw (yPos) {
    fill('white')
    rect(0, yPos * this.cellHeight, this.x * this.cellWidth, this.cellHeight)
    rect((this.x + this.length) * this.cellWidth, yPos * this.cellHeight, (this.xLimit - 1) * this.cellWidth, this.cellHeight)
  }
}

class Level {
  constructor (length, x, xLimit, yPos, cellWidth, cellHeight) {
    this.length = length
    this.x = x
    this.xLimit = xLimit
    this.yPos = yPos
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight

    this.isRight = true

    this.colour = null
  }

  draw () {
    fill(this.colour || 'white')

    rect(
      this.x * this.cellWidth,
      this.yPos,
      this.length * this.cellWidth,
      this.cellHeight
    )
  }

  step () {
    if (this.isRight) {
      if (this.x + 1 + this.length > this.xLimit) {
        this.isRight = false
        this.x--
      } else {
        this.x++
      }
    } else {
      if (this.x - 1 < 0) {
        this.isRight = true
        this.x++
      } else {
        this.x--
      }
    }
  }
}

class Grid {
  constructor (width, height, rows, columns) {
    this.width = width
    this.height = height
    this.rows = rows
    this.columns = columns

    this.columnWidth = width / rows
    this.rowHeight = height / columns

    this.maxLevelLength = Math.floor(rows / 2)

    this.slots = []

    this.done = 0

    for (let i = 1; i < columns; i++) {
      const newSlot = new Slot(
        this.maxLevelLength,
        rows,
        this.columnWidth,
        this.rowHeight
      )

      this.slots.push(newSlot)
    }

    this.level = new Level(this.maxLevelLength, 0, this.rows, (this.columns - 1) * this.rowHeight, this.columnWidth, this.rowHeight)
  }

  draw () {
    background(220)
    for (var x = 0; x <= this.width; x += this.columnWidth) {
      for (var y = 0; y <= this.height; y += this.rowHeight) {
        stroke(0)
        strokeWeight(1)
        line(x, 0, x, this.height)
        line(0, y, this.width, y)
      }
    }

    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].draw(i + this.done)
    }
    this.level.draw()
  }

  step () {
    this.level.step()
  }

  place () {
    const lastSlot = this.slots[this.columns - this.done - 2]
    const [sx, sl, lx, ll] = [
      lastSlot.x,
      lastSlot.length,
      this.level.x,
      this.level.length
    ]

    if (sx === lx && sl === ll) {
      if (this.done === this.columns - 2) {
        this.level.colour = 'green'
        gamePlaying = false
        clearInterval(t)
      }
      this.slots.pop()
      this.done++
    } else {
      this.level.colour = 'red'
      gamePlaying = false
      clearInterval(t)
    }
  }
}

let g, t, gamePlaying

function setup () {
  createCanvas(400, 400)
  g = new Grid(400, 400, 7, 10)

  gamePlaying = true
  t = setInterval(g.step.bind(g), 100)
}

function draw () {
  background(220)
  g.draw()
}

function keyPressed () {
  if (keyCode == 0x20 /* SPACE */) {
    if (gamePlaying) {
      g.place()
    } else {
      setup()
    }
  }
}
