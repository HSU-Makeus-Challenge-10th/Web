// src/types/common.ts

export type CommonResponse<T> = {  // <T>를 추가하여 제네릭으로 만듭니다.
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;                     // 결과값의 타입을 전달받은 T로 설정합니다.
};