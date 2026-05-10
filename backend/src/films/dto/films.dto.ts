//TODO описать DTO для запросов к /films

export class FilmsDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class FilmResponseDto {
  total: number;
  items: FilmsDto[];
}

export class SessionDto {
  id: string;
  film?: string;
  daytime: string;
  day?: string;
  time?: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class ScheduleResponseDto {
  total: number;
  items: SessionDto[];
}
