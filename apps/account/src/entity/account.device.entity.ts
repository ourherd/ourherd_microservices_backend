import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';


@Entity({
  name: 'account_device'
})

export class AccountDeviceEntity extends AbstractEntity {

  @Column({ nullable: false })
  account_id: Date;

  @Column({ nullable: true })
  device_id: string;

  @Column({ nullable: true })
  device_type: string;


}
