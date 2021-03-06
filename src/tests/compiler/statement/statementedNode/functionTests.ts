﻿import {expect} from "chai";
import {StatementedNode, FunctionDeclaration} from "./../../../../compiler";
import {FunctionDeclarationStructure} from "./../../../../structures";
import {getInfoFromText} from "./../../testHelpers";

describe(nameof(StatementedNode), () => {
    describe(nameof<StatementedNode>(n => n.insertFunctions), () => {
        function doTest(startCode: string, index: number, structures: FunctionDeclarationStructure[], expectedText: string) {
            const {sourceFile} = getInfoFromText(startCode);
            const result = sourceFile.insertFunctions(index, structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.equal(structures.length);
        }

        it("should insert to an empty file", () => {
            doTest("", 0, [{
                name: "Identifier"
            }], "function Identifier() {\n}\n");
        });

        it("should insert at the start of a file", () => {
            doTest("function Identifier2() {\n}\n", 0, [{ name: "Identifier1" }], "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n");
        });

        it("should insert at the end of a file", () => {
            doTest("function Identifier1() {\n}\n", 1, [{ name: "Identifier2" }], "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n");
        });

        it("should insert in the middle of children", () => {
            doTest("function Identifier1() {\n}\n\nfunction Identifier3() {\n}\n", 1, [{ name: "Identifier2" }],
                "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n\nfunction Identifier3() {\n}\n");
        });

        it("should insert multiple", () => {
            doTest("function Identifier1() {\n}\n", 1, [{ name: "Identifier2" }, { name: "Identifier3" }],
                "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n\nfunction Identifier3() {\n}\n");
        });

        it("should have the expected text adding to non-source file", () => {
            const {sourceFile} = getInfoFromText("namespace Namespace {\n}\n");
            const namespaceDec = sourceFile.getNamespaces()[0];
            namespaceDec.insertFunctions(0, [{
                name: "Identifier"
            }]);

            expect(sourceFile.getFullText()).to.equal("namespace Namespace {\n    function Identifier() {\n    }\n}\n");
        });
    });

    describe(nameof<StatementedNode>(n => n.insertFunction), () => {
        function doTest(startCode: string, index: number, structure: FunctionDeclarationStructure, expectedText: string) {
            const {sourceFile} = getInfoFromText(startCode);
            const result = sourceFile.insertFunction(index, structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(FunctionDeclaration);
        }

        it("should insert", () => {
            doTest("function Identifier2() {\n}\n", 0, { name: "Identifier1" }, "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n");
        });
    });

    describe(nameof<StatementedNode>(n => n.addFunctions), () => {
        function doTest(startCode: string, structures: FunctionDeclarationStructure[], expectedText: string) {
            const {sourceFile} = getInfoFromText(startCode);
            const result = sourceFile.addFunctions(structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.equal(structures.length);
        }

        it("should add multiple", () => {
            doTest("function Identifier1() {\n}\n", [{ name: "Identifier2" }, { name: "Identifier3" }],
                "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n\nfunction Identifier3() {\n}\n");
        });
    });

    describe(nameof<StatementedNode>(n => n.addFunction), () => {
        function doTest(startCode: string, structure: FunctionDeclarationStructure, expectedText: string) {
            const {sourceFile} = getInfoFromText(startCode);
            const result = sourceFile.addFunction(structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(FunctionDeclaration);
        }

        it("should add one", () => {
            doTest("function Identifier1() {\n}\n", { name: "Identifier2" }, "function Identifier1() {\n}\n\nfunction Identifier2() {\n}\n");
        });
    });

    describe(nameof<StatementedNode>(n => n.getFunctions), () => {
        const {sourceFile} = getInfoFromText("function Identifier1();function Identifier1() {}\nfunction Identifier2() {}" +
            "declare function Identifier3(); declare function Identifier3();");
        const functions = sourceFile.getFunctions();

        it("should have the expected number of functions", () => {
            expect(functions.length).to.equal(4);
        });

        it("should have correct type", () => {
            expect(functions[0]).to.be.instanceOf(FunctionDeclaration);
        });
    });

    describe(nameof<StatementedNode>(n => n.getFunction), () => {
        const {sourceFile} = getInfoFromText("function Identifier1() {}\nfunction Identifier2() {}");

        it("should get a function by a name", () => {
            expect(sourceFile.getFunction("Identifier2")!.getName()).to.equal("Identifier2");
        });

        it("should get a function by a search function", () => {
            expect(sourceFile.getFunction(c => c.getName() === "Identifier1")!.getName()).to.equal("Identifier1");
        });

        it("should return undefined when the function doesn't exist", () => {
            expect(sourceFile.getFunction("asdf")).to.be.undefined;
        });
    });
});
