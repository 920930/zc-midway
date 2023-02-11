import { Table, Model, Column, DataType, Default } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  avatar: string;
  
  @Column
  openId: string;

  @Default(0)
  @Column({
    type: DataType.TINYINT('1'),
    comment: '管理员1,用户0',
  })
  isVip: boolean;
  
  @Default(0)
  @Column({
    type: DataType.TINYINT('1'),
    comment: '1已签到,0未签到',
  })
  sign: boolean;

  @Column({
    type: DataType.STRING(30)
  })
  tel: string
}