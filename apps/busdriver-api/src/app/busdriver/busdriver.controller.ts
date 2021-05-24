import { Controller, Post, Body, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { BusdriverGateway } from './busdriver.gateway';
import { BusdriverService } from './busdriver.service';


@Controller()
export class BusdriverController {

  constructor(private readonly busdriverService: BusdriverService, private readonly busdriverGateway: BusdriverGateway) {}


  @Get('create')
  craete(@Query('name') name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.busdriverService.addRoom(name).newGame();
    return;
  }

  @Get()
  test(@Query('name') name: string) {

    const game = this.busdriverService.getRoom(name).getGame();
    game.printPyramid();
    game.turnCurrentCard();
    game.printPyramid();
    return game;
  }

  @Post('/join')
  join(@Body() { username, room, socketID, playerID }) {
    if (!socketID || !username || !room) {
      throw new HttpException('Bad Request!', HttpStatus.BAD_REQUEST);
    }
    const response = this.busdriverService.join(username, room, playerID);

    this.busdriverGateway.handlePlayerConnect(socketID, response.room, response.playerID);

    return response;
  }

}
