---
title: Decorators
---

## Decorators

Decorators can be retrieved from class related nodes by calling the `getDecorators()` method.

```typescript
const decorators = classDeclaration.getDecorators();
```

### Name

You can get the name or fully qualified name of a decorator by using the `getName()` or `getFullName()` functions respectively.

For example, given the following code:

```typescript
@obj.decorator
function myFunction() {
}
```

The following happens:

```typescript
decorator.getName(); // decorator
decorator.getFullName(); // obj.decorator
```

### Decorator factory

Decorators with parenthesis (ex. `@decorator(3)`) are decorator factories, while decorators without (ex. `@decorator`) are not.

```typescript
decorator.isDecoratorFactory(); // returns: boolean
```

### Arguments

Get the decorator's arguments by calling `.getArguments()`:

```typescript
const args = decorator.getArguments(); // returns: Expression[]
```

### Type arguments

Get the decorator's type arguments by calling `.getTypeArguments()`:

```typescript
const typeArgs = decorator.getTypeArguments(); // returns: TypeNode[]
```

### Call expression

Decorator factories are call expressions. You can get the call expression by calling:

```typescript
const callExpression = decorator.getCallExpression(); // returns: CallExpression | undefined
```

### Add/Insert decorators

Decorators can be added or inserted by calling `addDecorator(decorator)`, `addDecorators(decorators)`, `insertDecorator(index, decorator)`, or `insertDecorators(index, decorators)`.

For example:

```typescript
classDeclaration.addDecorator({
    name: "MyDecorator",
    arguments: ["3", `"some string"`]
});
```

### Remove decorators

Call `.remove()` on them:

```typescript
decorator.remove();
```
