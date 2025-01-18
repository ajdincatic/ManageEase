import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { Users } from '../../api/users/entities/users.entity';
import { UtilsService } from '../helpers/utils.service';

@EventSubscriber()
export class PasswordSubscriber implements EntitySubscriberInterface<Users> {
  listenTo() {
    return Users;
  }

  beforeInsert(event: InsertEvent<Users>) {
    if (event.entity.password) {
      event.entity.password = UtilsService.generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<Users>) {
    if (
      event?.entity?.password &&
      event.entity.password !== event.databaseEntity.password
    ) {
      event.entity.password = UtilsService.generateHash(event.entity.password);
    }
  }
}
