export class RainSymbol {
  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private text = '';

  constructor(
    private x: number,
    private y: number,
    private fontSize: number,
    private canvasHeight: number
  ) {
    // this.reset();
    this.y = 0;
  }

  private reset() {
    this.y = Math.floor(Math.random() * this.canvasHeight);
  }

  draw(context: CanvasRenderingContext2D) {
    this.text = this.characters.charAt(
      Math.floor(Math.random() * this.characters.length)
    );
    context.fillStyle = `hsl(152, 100%, 50%)`;
    context.fillText(
      this.text,
      this.x * this.fontSize,
      this.y * this.fontSize - this.fontSize
    );
    context.fillStyle = `white`;
    context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);

    if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.5) {
      this.reset();
    } else {
      this.y++;
    }
  }
}

export class Effect {
  public fontSize = 20;
  private columns = Math.floor(this.canvasWidth / this.fontSize);
  public symbols: RainSymbol[] = [];

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.symbols = [];
    this.fontSize = 20;
    this.columns = Math.floor(this.canvasWidth / this.fontSize);

    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.columns; i++) {
      this.symbols[i] = new RainSymbol(i, 0, this.fontSize, this.canvasHeight);
    }
  }
}
