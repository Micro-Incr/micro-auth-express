import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  githubId: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ default: false })
  isAccountExpired: boolean;

  @Column({ default: false })
  isBanned: boolean;

  constructor(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string,
    googleId: string,
    facebookId: string,
    githubId: string
  ) {
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.googleId = googleId;
    this.facebookId = facebookId;
    this.githubId = githubId;
  }
}
