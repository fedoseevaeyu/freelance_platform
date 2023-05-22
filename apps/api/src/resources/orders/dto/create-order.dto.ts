import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  job_post_id: string;

  @IsString()
  service_id: string;

  @IsString()
  client_id: string;

  @IsString()
  freelancer_id: string;
}
