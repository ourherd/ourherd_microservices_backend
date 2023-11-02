import { IServiceResponse } from "@app/rabbit";
import { StorageResourceType, StorageResourceBucket, StorageResourceDriverType } from "../interface/storage-resource.interface";

export abstract class StorageResourceDriver {
    abstract type: StorageResourceDriverType;
    abstract upload(
        id: string,
        file: Express.Multer.File,
        type: StorageResourceType,
    ): Promise<IServiceResponse<{ key: string }>>;
}
