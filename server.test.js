import { createTestClient }  from 'apollo-server-testing';


class test {
    constructor() {
        var value = 5;
    };

    setValue = (newValue) => {
        this.value = newValue;
    };

    getValue = () => this.value;
}

describe('Test suite', () => {
    it('Should return 5', () => {
        const value = 5;
        expect(value).toBe(5);
    });

    it('Should return 8', () => {
        let testClass = new test();
        testClass.setValue(8);
        expect(testClass.getValue()).toBe(8);
    });
});
