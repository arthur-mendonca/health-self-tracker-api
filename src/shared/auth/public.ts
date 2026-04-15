import { SetMetadata } from "npm:@nestjs/common@10.4.15";

export const IS_PUBLIC_ROUTE = "isPublicRoute";

export const Public = () => SetMetadata(IS_PUBLIC_ROUTE, true);
