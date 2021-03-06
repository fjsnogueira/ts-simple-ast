﻿import * as ts from "typescript";
import {AbstractableNodeStructure} from "./../../../structures";
import {Constructor} from "./../../../Constructor";
import {Node} from "./../../common";
import {ModifierableNode} from "./../../base";
import {callBaseFill} from "./../../callBaseFill";
import {callBaseGetStructure} from "./../../callBaseGetStructure";

export type AbstractableNodeExtensionType = Node & ModifierableNode;

export interface AbstractableNode {
    /**
     * Gets if the node is abstract.
     */
    getIsAbstract(): boolean;
    /**
     * Gets the abstract keyword or undefined if it doesn't exist.
     */
    getAbstractKeyword(): Node | undefined;
    /**
     * Sets if the node is abstract.
     * @param isAbstract - If it should be abstract or not.
     */
    setIsAbstract(isAbstract: boolean): this;
}

export function AbstractableNode<T extends Constructor<AbstractableNodeExtensionType>>(Base: T): Constructor<AbstractableNode> & T {
    return class extends Base implements AbstractableNode {
        getIsAbstract() {
            return this.getAbstractKeyword() != null;
        }

        getAbstractKeyword() {
            return this.getFirstModifierByKind(ts.SyntaxKind.AbstractKeyword);
        }

        setIsAbstract(isAbstract: boolean) {
            this.toggleModifier("abstract", isAbstract);
            return this;
        }

        fill(structure: Partial<AbstractableNodeStructure>) {
            callBaseFill(Base.prototype, this, structure);

            if (structure.isAbstract != null)
                this.setIsAbstract(structure.isAbstract);

            return this;
        }

        getStructure() {
            return callBaseGetStructure<AbstractableNodeStructure>(Base.prototype, this, {
                isAbstract: this.getIsAbstract()
            });
        }
    };
}
