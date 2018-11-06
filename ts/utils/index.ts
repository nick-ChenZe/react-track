const inputEquals = <InputType>(
    prev: InputType[],
    current: InputType[],
): boolean => {
    if (prev.length !== current.length) {
        return false;
    }

    /* tslint:disable-next-line */
    for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== current[i]) {
            return false;
        }
    }

    return true;
};

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
