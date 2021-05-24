export class Player {
  disconnected = false;

  constructor(public id: string, public name: string) {
  }

  reset() {
    return undefined;
  }
}
