import { ArgumentMetadata, FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe, PipeTransform } from "@nestjs/common";
import { AVAILABLE_UPLOAD_IMAGES_FILE_MIMES, AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, MAX_UPLOAD_FILE_VIDEO_SIZE, MAX_UPLOAD_IMAGE_FILE_SIZE } from "../constant/upload.constant";

@Injectable()
export class ParseUploadImageVideoFilePipe implements PipeTransform {
    constructor(
        private required: boolean = true,
        private mimes: string[] = [...AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, ...AVAILABLE_UPLOAD_IMAGES_FILE_MIMES ],
        private maxSize: number = MAX_UPLOAD_FILE_VIDEO_SIZE
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

}
