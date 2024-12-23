// 자주 사용하는 공통 enum, const 모음
export enum E_API_METHOD_TYPES {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum E_PRIORITY_TYPES {
  HIGH = 'HIGH',
  MIDDLE = 'MIDDLE',
  LOW = 'LOW',
}

export enum E_DATE_TYPES {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'date',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}

export enum E_ROLE_TYPES {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum E_SUBSCRIPTION_STATUS_TYPES {
  SUBSCRIBED = 'S',
  CANCELED = 'C',
  UNSUBSCRIBED = 'U',
}
