import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

import { EResponseCode } from '../enums/response-code.enum';

export class HttpSuccessResponse<T> {
  @ApiProperty({
    type: Number,
  })
  public code: EResponseCode;

  public data: T;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  public message?: string;

  constructor(code: number, data: T, message = '') {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}

export class PaginatedResult<T> {
  @ApiProperty({
    type: Number,
  })
  public total: number;

  public items: T[];
}

export const ApiOkResponseCommon = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description?: string,
) =>
  applyDecorators(
    ApiExtraModels(HttpSuccessResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(HttpSuccessResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
      description,
    }),
  );

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description?: string,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResult, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(HttpSuccessResponse) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                },
              },
            },
          },
        ],
      },
      description,
    }),
  );
