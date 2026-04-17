import {
  BadRequestException,
  HttpException,
} from "npm:@nestjs/common@10.4.15";

const domainErrorPatterns = [
  /^At least one (activity|substance|tag) field must be provided\.$/,
  /^(Activity|Substance|Tag) name is required\.$/,
  /^Invalid (tag category|substance type|effectDropTime) for .+\.$/,
  /^date cannot be combined with startDate or endDate\.$/,
  /^startDate cannot be after endDate\.$/,
  /^days cannot be combined with startDate or endDate\.$/,
  /^days must be a positive integer\.$/,
  /^date must use YYYY-MM-DD format\.$/,
  /^exactDose is required for substances\.$/,
];

export function rethrowAsHttpError(error: unknown, fallbackMessage: string): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Error && isDomainErrorMessage(error.message)) {
    throw new BadRequestException(error.message);
  }

  if (!(error instanceof Error)) {
    throw new Error(fallbackMessage);
  }

  throw error;
}

function isDomainErrorMessage(message: string): boolean {
  return domainErrorPatterns.some((pattern) => pattern.test(message));
}
