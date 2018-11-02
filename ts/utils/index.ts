const inputEquals = <InputType>(
    prev: InputType[],
    current: InputType[],
): boolean => {
    if (prev.length !== current.length) {
        return false;
    }

    /* tslint:disable */
    for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== current[i]) {
            return false;
        }
    }

    return true;
};

// 返回最后一次select的结果
// 函数返回一个闭包，当lastInput不存在，或lastInput与新参数不一致时更新select的结果
export const createMemoizer = <InputType extends any[], ResultType>(
    select: (...args: any[]) => ResultType,
): ((...args: InputType) => ResultType) => {
    let lastInput: InputType[];
    let lastResult: ResultType;

    return (...input: InputType[]) => {
        if (!lastInput || !inputEquals(lastInput, input)) {
            lastResult = select(...input);
            lastInput = input;
        }

        return lastResult;
    };
};
