import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from "../constant/roles.enum";
import { Auth } from './auth.decorator';
import { RolesGuard } from '../guard/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        Auth(),
        UseGuards(RolesGuard)
    );
};
