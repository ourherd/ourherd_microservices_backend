export enum StorageResourceDriverType {
    LOCAL = 'local',
    S3 = "s3"
}

export enum StorageResourceType {
    STORY_IMAGE = 'IMAGE',
    STORY_VIDEO = 'VIDEO'
}

export enum StorageResourceRoute {
    ROUTE_STORY_IMAGE = 'images',
    ROUTE_STORY_VIDEO = 'videos',
    NO_ROUTE_STORY = 'undefined'
}

export enum StorageResourceBucket {
    PRIMARY_BUCKET = 'primary_bucket',
    SECONDARY_BUCKET = 'secondary_bucket'
}
