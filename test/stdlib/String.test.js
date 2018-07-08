const { UCase, LCase, Asc, Chr, Left } = require("../../lib/stdlib/index");
const { Interpreter } = require("../../lib/interpreter");
const { BrsString, BrsBoolean, Int32 } = require("../../lib/brsTypes");

const interpreter = new Interpreter();

describe("global string functions", () => {
    describe("UCase", () => {
        it("converts a BRS string to its uppercase form", () => {
            expect(
                UCase.call(interpreter, new BrsString("l0rEm"))
            ).toEqual(new BrsString("L0REM"));
        });
    });

    describe("LCase", () => {
        it("converts a BRS string to its lowercase form", () => {
            expect(
                LCase.call(interpreter, new BrsString("l0rEm"))
            ).toEqual(new BrsString("l0rem"));
        });
    });

    describe("Asc", () => {
        it("converts an empty BRS string to zero", () => {
            expect(
                Asc.call(interpreter, new BrsString(""))
            ).toEqual(new Int32(0));
        });

        it("converts a character to a UTF-16 representation", () => {
            expect(
                Asc.call(interpreter, new BrsString("for"))
            ).toEqual(new Int32(102)); // UTF-16 decimal for "f"

            expect(
                Asc.call(interpreter, new BrsString("ぇ"))
            ).toEqual(new Int32(12359));
        });
    });

    describe("Chr", () => {
        it("converts a negative or zero to an empty string", () => {
            expect(
                Chr.call(interpreter, new Int32(-1))
            ).toEqual(new BrsString(""));

            expect(
                Chr.call(interpreter, new Int32(0))
            ).toEqual(new BrsString(""));
        });

        it("converts an UTF-16 integer to character", () => {
            expect(
                Chr.call(interpreter, new Int32(34))
            ).toEqual(new BrsString("\""));

            expect(
                Chr.call(interpreter, new Int32(12359))
            ).toEqual(new BrsString("ぇ"));
        });
    });

    describe("Left", () => {
        it("get first n characters in a string longer than n characters", () => {
            expect(
                Left.call(interpreter, new BrsString("pineapple"), new Int32(4))
            ).toEqual(new BrsString("pine"));
        });

        it("get the original string back with n larger than string length", () => {
            expect(
                Left.call(interpreter, new BrsString("boy"), new Int32(5))
            ).toEqual(new BrsString("boy"));
        });

        it("get back empty string when character length is 0 or negative", () => {
            expect(
                Left.call(interpreter, new BrsString("apple"), new Int32(0))
            ).toEqual(new BrsString(""));

            expect(
                Left.call(interpreter, new BrsString("apple"), new Int32(-5))
            ).toEqual(new BrsString(""));
        });
    });
});