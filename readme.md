# Safex

A language for writing safe expressions, in a tiny subset of JavaScript.

## Goals

This library follows these design goals:

- Only a tiny subset of JavaScript is implemented, a subset that can be executed safely.
- Every feature that is implemented works exactly like it would in JavaScript.
- The library itself is implemented defensively, if there are bugs in it almost certainly they won't enable arbitrary code execution.

## Language

The following features of JavaScript are supported:

- **Read-only variables**: you can provide arbitrary read-only variables to your expressions.
- **Restricted function calls**: you can provide arbitrary functions that your expressions are allowed to call.
- **Property accesses**: `a.b.c`, `a[b][c]`.
- **Primitive values**: `true`, `false`, `null`, `undefined`, `bigint`, `number`, `string`.
- **Comparison operators**: `==`, `!=`, `===`, `!==`, `>`, `>=`, `<`, `<=`.
- **Arithmetic operators**: `+`, `-`, `*`, `/`, `%`, `**`.
- **Bitwise operators**: `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`.
- **Logical operators**: `!`, `&&`, `||`, `??`.
- **Group operator**: `(...)`.

The following features of JavaScript are instead _not_ supported:

- **Assignments**: no assignment operators are supported, your variables can't be mutated.
- **Increment/decrement**: no postfix/prefix increment/decrement operators are supported either.
- **`new` operator**: `new` can be used to execute unintentionally-exposed functions, so it's not supported.
- **New variables**: safe expressions can't declare new variables.
- **Arbitrary function calls**: no arbitrary function calls can be performed, only functions you explicitly list can be called.
- **Loops**: not even loops can be created.

## Security

While the language by itself is safe to execute, it's important to note that in order for it to be useful it supports giving expressions explicit access to a set of variables you control. And in order to be an actual subset of JavaScript it must indirectly support some very dynamic parts of the language, like getters and `Proxy` instances.

If you want to make this library useless you can give your expressions access to a variable like this:

```js
const footgun = new Proxy ( {}, {
  get ( target, key ) {
    eval ( key );
  }
});
```

Which the no longer safe expressions could then use like this to execute arbitrary code:

```ts
footgun['alert(1)']
```

Additionally function calls to explicitly-provided functions are allowed, so providing this context object to your expressions is unsafe:

```js
{ eval }
```

Note how a function must be explicitly listed to be callable by the expression:

```js
// This will throw, "min" was not explicitly provided
safex.exec ( 'Math.min ( 1, 2 )', { Math } );
// This is allowed,"min" was explicitly provided
safex.exec ( 'min ( 1, 2 )', { min: Math.min } );
```

Basically executing a function in general is unsafe, and there are a lot of ways to execute a function in JavaScript, even with the allowed language being this restrictive, for example:

- Coercing objects or functions to primitives could call `Symbol.toPrimitive`, `toString` and `valueOf` on them.
- Accessing a property could cause a function call if that property is actually a getter.
- Accessing a property could cause a function call if the property is being accessed on a `Proxy` object.

Unless you do weird stuff expressions executed via this library will be safe, but it's important to understand that you can shoot yourself in the foot by providing usafe variables to your expressions.

## Install

```sh
npm install --save safex
```

## Usage

```ts
import safex from 'safex';

// Execute an expression without pre-compiling it, which is slower if you need to execute it multiple times

safex.exec ( '128 / 2' ); // => 64
safex.exec ( 'activeView === "search"', { activeView: 'search' } ); // => true
safex.exec ( 'isFoo && ( isBar || baz < 3 )', { isFoo: true, isBar: false, baz: 123 } ); // => false

// Compile an expression, parsing it once, which is faster if you need to execute it multiple times with different variables

const expression = safex.compile ( 'isFoo || isBar' );

expression ({ isFoo: 1, isBar: 2 }); // => 1
expression ({ isFoo: 0, isBar: 2 }); // => 2

// Validate that an expression is actually valid syntactically

safex.validate ( '( -1 ) ** 2' ); // => true
safex.validate ( '-1 ** 2' ); // => false
safex.validate ( 'eval ( "alert(1)" )' ); // => false

// Low-level function that parse an expression into an AST

const ast = safex.parse ( '1 + 2' ) // => { type: 'root', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'number', value: 2 }] }] }
```

## License

MIT © Fabio Spampinato
