﻿import * as ts from "typescript";
import * as errors from "./../../errors";
import {removeClassMember} from "./../../manipulation";
import {Node} from "./../common";
import {PropertyNamedNode, StaticableNode, ScopedNode, DecoratableNode, BodiedNode} from "./../base";
import {FunctionLikeDeclaration} from "./../function";
import {AbstractableNode} from "./base";
import {GetAccessorDeclaration} from "./GetAccessorDeclaration";
import {ClassDeclaration} from "./ClassDeclaration";

export const SetAccessorDeclarationBase = DecoratableNode(AbstractableNode(ScopedNode(StaticableNode(FunctionLikeDeclaration(BodiedNode(PropertyNamedNode(Node)))))));
export class SetAccessorDeclaration extends SetAccessorDeclarationBase<ts.SetAccessorDeclaration> {
    /**
     * Gets the corresponding get accessor if one exists.
     */
    getGetAccessor(): GetAccessorDeclaration | undefined {
        const parent = this.getParentIfKindOrThrow(ts.SyntaxKind.ClassDeclaration) as ClassDeclaration;
        const thisName = this.getName();
        for (const prop of parent.getInstanceProperties()) {
            if (prop.getKind() === ts.SyntaxKind.GetAccessor && prop.getName() === thisName)
                return prop as GetAccessorDeclaration;
        }

        return undefined;
    }

    /**
     * Removes the set accessor.
     */
    remove() {
        removeClassMember(this);
    }
}
