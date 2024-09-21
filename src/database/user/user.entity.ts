import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { PropertyEntity } from '../property/property.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
  
  @Column({ unique: true })
  email: string;

  @Column(
    {
      nullable: false,
    }
  )
  phone: string;
  
  @Column()
  password: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: false })
  admin: boolean;

  @ManyToMany(() => PropertyEntity, (property) => property.users)
  @JoinTable({
    name: 'favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'property_id',
      referencedColumnName: 'id',
    },
  })
  favoriteProperties: PropertyEntity[];
}