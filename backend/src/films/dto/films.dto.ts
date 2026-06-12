//TODO описать DTO для запросов к /films
import { IsArray, IsNumber, IsString } from 'class-validator';

export class FilmsDto {
  @IsString()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  tags: string[];

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  cover: string;
}

export class FilmResponseDto {
  total: number;
  items: FilmsDto[];
}

export class SessionDto {
  @IsString()
  id: string;

  @IsString()
  film?: string;

  @IsString()
  daytime: string;

  @IsString()
  day?: string;

  @IsString()
  time?: string;

  @IsNumber()
  hall: number;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  taken: string[];
}

export class ScheduleResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: SessionDto[];
}
