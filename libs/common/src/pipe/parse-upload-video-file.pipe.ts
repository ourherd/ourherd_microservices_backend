<<<<<<< HEAD
import {
    ArgumentMetadata,
    FileTypeValidator,
    Injectable,
    MaxFileSizeValidator,
    ParseFilePipe,
    PipeTransform
} from "@nestjs/common";

import { AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, MAX_UPLOAD_FILE_VIDEO_SIZE } from "../constant/upload.constant";

@Injectable()
export class ParseUploadVideoFilePipe implements PipeTransform {
=======
import { Injectable } from "@nestjs/common";
import { AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, MAX_UPLOAD_FILE_VIDEO_SIZE } from "../constant/upload.constant";
import { ParseUploadFilePipe } from "@app/common/pipe/parse-upload-file-pipe";

@Injectable()
export class ParseUploadVideoFilePipe extends ParseUploadFilePipe {
>>>>>>> develop
    constructor(
        private required: boolean = true,
        private mimes: string[] = AVAILABLE_UPLOAD_VIDEO_FILE_MIMES,
        private maxSize: number = MAX_UPLOAD_FILE_VIDEO_SIZE
<<<<<<< HEAD
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        return await new ParseFilePipe({
            fileIsRequired: this.required,
            validators: [
                new FileTypeValidator({ fileType: `.(${this.mimes.join('|')})` }),
                new MaxFileSizeValidator({ maxSize: this.maxSize })
            ]
        }).transform(value);
    }
=======
    ) {
        super(true , AVAILABLE_UPLOAD_VIDEO_FILE_MIMES , MAX_UPLOAD_FILE_VIDEO_SIZE);
    }

>>>>>>> develop
}
