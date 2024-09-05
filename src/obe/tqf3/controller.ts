import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TQF3Service } from './service';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { TQF3 } from './schemas/schema';

@Controller('/tqf3')
@UsePipes(new ValidationPipe({ transform: true }))
export class TQF3Controller {
  constructor(private service: TQF3Service) {}

  @Put('/:id/part1')
  async updateCourse(
    @Param('id') id: string,
    @Body() requestDTO: any,
  ): Promise<ResponseDTO<TQF3>> {
    return this.service.savePart1(id, requestDTO).then((result) => {
      const responseDTO = new ResponseDTO<TQF3>();
      responseDTO.data = result;
      return responseDTO;
    });
  }
}
