import {
  ArgumentMetadata,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
  PipeTransform
} from "@nestjs/common";

@Injectable()
export class ParseUploadFilePipe implements PipeTransform {
  constructor(
    private required: boolean = true,
    private mimes: string[],
    private maxSize: number
  ) { }

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
