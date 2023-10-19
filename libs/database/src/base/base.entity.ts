import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deleted_at!: Date;

}
