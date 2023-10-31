import { Injectable } from "@nestjs/common";
import { AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, MAX_UPLOAD_FILE_VIDEO_SIZE } from "../constant/upload.constant";
import { ParseUploadFilePipe } from "@app/common/pipe/parse-upload-file-pipe";

@Injectable()
export class ParseUploadVideoFilePipe extends ParseUploadFilePipe {
    constructor(
        private required: boolean = true,
        private mimes: string[] = AVAILABLE_UPLOAD_VIDEO_FILE_MIMES,
        private maxSize: number = MAX_UPLOAD_FILE_VIDEO_SIZE
    ) {
        super(true , AVAILABLE_UPLOAD_VIDEO_FILE_MIMES , MAX_UPLOAD_FILE_VIDEO_SIZE);
    }

}
