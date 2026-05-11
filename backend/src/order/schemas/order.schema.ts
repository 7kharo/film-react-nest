import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Ticket {
  @Prop() film: string;
  @Prop() session: string;
  @Prop() daytime: string;
  @Prop() day: string;
  @Prop() time: string;
  @Prop() row: number;
  @Prop() seat: number;
  @Prop() price: number;
}

export const ticketSchema = SchemaFactory.createForClass(Ticket);

@Schema()
export class Order {
  @Prop() email: string;
  @Prop() phone: string;
  @Prop([{ type: ticketSchema }]) tickets: Ticket[];
}

export const orderSchema = SchemaFactory.createForClass(Order);
