import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Verification from "./Verification";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "text" })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;

  @Column({ type: "boolean", default: false })
  isRiding: boolean;

  @Column({ type: "boolean", default: false })
  isTaken: boolean;

  @Column({ type: "double precision", default: 0 })
  lastLng: number;

  @Column({ type: "double precision", default: 0 })
  lastLat: number;

  @Column({ type: "double precision", default: 0 })
  lastOrientation: number;

  @Column({ type: "text", nullable: true })
  fbId: string;

  @ManyToOne((type) => Chat, (chat) => chat.participants)
  chat: Chat;

  @OneToMany((type) => Message, (message) => message.user)
  messages: Message[];

  @OneToMany((type) => Verification, (verification) => verification.user)
  verifications: Verification[];

  @OneToMany((type) => Ride, (ride) => ride.passenger)
  ridesAsPassenger: Ride[];

  @OneToMany((type) => Ride, (ride) => ride.driver)
  ridesAsDriver: Ride[];

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;

  // 풀네임 리턴해주는 함수
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // 넘겨받은 비밀번호(평문)와 암호화된 비밀번호가 일치하는지 체크하여 Boolean값을 리턴해주는 함수
  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // insert, update가 일어나기 전에 실행되는 함수 (비밀번호 암호화 하기 위함)
  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  // 비밀번호 암호화 함수
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}

export default User;
