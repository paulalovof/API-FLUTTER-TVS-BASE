import { Calculator } from './calculator';
test('2 + 2 equals 4'
    , () => {
        expect(Calculator.sum(2, 2)).toEqual(4);
    });