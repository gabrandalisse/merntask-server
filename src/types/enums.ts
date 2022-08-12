export enum ProjectErrors {
    NOT_FOUND = 'project not found'
}

export enum TaskErrors {
    NOT_FOUND = 'task not found'
}

export enum AuthErrors {
    USER_NOT_AUTHORIZED = 'the user is not authorized',
    INCORRECT_PASSWORD = 'the password is incorrect',
    MISSING_TOKEN = 'the token is missing',
    INVALID_TOKEN = 'invalid token'
}

export enum UserErrors {
    ALREADY_EXISTS = 'the user already exists',
    NOT_EXISTS = 'the user do not exists'
}

export enum ProjectSuccess {
    DELETED = 'project deleted'
}

export enum TaskSuccess {
    DELETED = 'task was deleted'
}

export enum FilterType {
    ID = '_id',
    EMAIL = 'email',
    OWNER = 'owner',
    PROJECT = 'project'
}