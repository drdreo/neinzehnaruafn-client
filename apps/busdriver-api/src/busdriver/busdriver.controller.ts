import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { BusdriverGateway } from './busdriver.gateway';
import { BusdriverService } from './busdriver.service';


@Controller()
export class BusdriverController {

  constructor(private readonly busdriverService: BusdriverService, private readonly busdriverGateway: BusdriverGateway
  ) {}

  @Get()
  test() {
    return 'success';
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
