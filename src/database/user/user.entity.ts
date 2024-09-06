import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: false })
  admin: boolean;
}