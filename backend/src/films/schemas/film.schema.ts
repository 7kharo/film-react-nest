import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Session {
  @Prop() id: string;
  @Prop() daytime: string;
  @Prop() hall: number;
  @Prop() rows: number;
  @Prop() seats: number;
  @Prop() price: number;
  @Prop([String]) taken: string[];
}

export const sessionSchema = SchemaFactory.createForClass(Session);

@Schema()
export class Films {
  @Prop() id: string;
  @Prop() rating: number;
  @Prop() director: string;
  @Prop() tags: string[];
  @Prop() title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop() image: string;
  @Prop() cover: string;
  @Prop([{ type: sessionSchema }]) schedule: Session[];
}

export const filmsSchema = SchemaFactory.createForClass(Films);
