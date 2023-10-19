import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';

@Entity({
  name: 'account'
})

export class AccountEntity extends AbstractEntity {

}
