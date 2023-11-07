import { Injectable } from "@nestjs/common";
import { AVAILABLE_UPLOAD_VIDEO_FILE_MIMES, MAX_UPLOAD_FILE_VIDEO_SIZE } from "../constant/upload.constant";
import { ParseUploadFilePipe } from "@app/common/pipe/parse-upload-file-pipe";

@Injectable()
export class ParseUploadVideoFilePipe extends ParseUploadFilePipe {
    constructor() {
        super(true , AVAILABLE_UPLOAD_VIDEO_FILE_MIMES , MAX_UPLOAD_FILE_VIDEO_SIZE);
    }

}
