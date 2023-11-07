import { Column, Entity } from "typeorm";
import { StorageResourceDriverType, StorageResourceType } from "../interface/storage-resource.interface";
import { AbstractEntity } from "@app/database/base/base.entity";

@Entity({
    name: 'storage_resources'
})
export class StorageResourceEntity extends AbstractEntity {

    @Column({ nullable: true })
    story_id: string

    @Column({
        type: 'enum',
        enum: StorageResourceType
    })
    resource_type: StorageResourceType;

    @Column({ default: false, nullable: true })
    has_captions_included: boolean;

    @Column({ default: false , nullable: true })
    media_captions_path: string;

    @Column({ nullable: true })
    media_resource_path: string;

    @Column({
        type: 'enum',
        enum: StorageResourceDriverType,
        default: StorageResourceDriverType.S3
    })
    driver: StorageResourceDriverType;




}
