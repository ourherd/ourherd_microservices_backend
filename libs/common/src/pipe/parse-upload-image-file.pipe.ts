import { Injectable } from "@nestjs/common";
import { AVAILABLE_UPLOAD_IMAGES_FILE_MIMES, MAX_UPLOAD_IMAGE_FILE_SIZE } from "../constant/upload.constant";
import { ParseUploadFilePipe } from "@app/common/pipe/parse-upload-file-pipe";

@Injectable()
export class ParseUploadImageFilePipe extends ParseUploadFilePipe {
    constructor(
        private required: boolean = true,
        private mimes: string[] = AVAILABLE_UPLOAD_IMAGES_FILE_MIMES,
        private maxSize: number = MAX_UPLOAD_IMAGE_FILE_SIZE
    ) {
        super(true , AVAILABLE_UPLOAD_IMAGES_FILE_MIMES , MAX_UPLOAD_IMAGE_FILE_SIZE);
    }

}
