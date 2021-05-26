export class Player {
  disconnected = false;
  current = false;

  constructor(public id: string, public name: string) {
  }

  reset() {
    this.disconnected = false;
    this.current = false;
  }
}
