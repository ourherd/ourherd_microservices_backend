import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { StorageResourceDriverType, StorageResourceType } from "../interface/storage-resource.interface";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";

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

    // If resource_type is VIDEO
    // it needs an image to be used a preload
    @Column({ default: false , nullable: true })
    media_preview_path: string;

    // If resource_type is VIDEO
    // if captions has been created
    @Column({ default: false, nullable: true })
    has_captions_included: boolean;

    // If resource_type is VIDEO
    // if has_captions_included is TRUE
    @Column({ default: false , nullable: true })
    media_captions_path: string;

    // If resource_type is VIDEO
    // if has_captions_included is TRUE
    @Column({ nullable: true })
    media_transcript_path: string;

    // If new media resource If VIDEO MP4
    // If new media resource If IMAGE jpg
    @Column({ nullable: true })
    media_resource_path: string;

    // Original file
    @Column({ nullable: true })
    media_original_resource_path: string;

    @Column({
        type: 'enum',
        enum: StorageResourceDriverType,
        default: StorageResourceDriverType.S3
    })
    driver: StorageResourceDriverType;

    @OneToOne(() => StoryEntity)
    @JoinColumn({ name: "story_id" })
    story: StoryEntity;

}
