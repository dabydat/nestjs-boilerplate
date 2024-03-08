import { BadRequestException } from "@nestjs/common";

const databaseErrorMessages = {
    "23505": {
        databaseErrorType: "UNIQUE_CONSTRAINT_VIOLATION",
        databaseErrorMessage: "The value exists in the table."
    },
    "23503": {
        databaseErrorType: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
        databaseErrorMessage: "The foreign key does not correspond to any value.",
    },
    "22P02": {
        databaseErrorType: "INVALID_TEXT_REPRESENTATION",
        databaseErrorMessage: "At least one of the fields has an invalid value. Please check and try again.",
    },
    "23502": {
        databaseErrorType: "NOT_NULL_VIOLATION",
        databaseErrorMessage: "The value cannot be null."
    }
}

export const handleDatabaseErrorMessages = (error: any) => {
    return new BadRequestException({ ...databaseErrorMessages[error.code], message: error.detail ? error.detail : error.message });
}