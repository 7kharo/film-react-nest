import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  async getFilms(): Promise<FilmResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getIdSchedule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ScheduleResponseDto> {
    return this.filmsService.getScheduleFilms(id);
  }
}
