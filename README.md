# TYPECRIPT

## 1. Introduction

One of the most common errors that developers encounter is a TypeError where a value of a certain type was used where a different value was expected.
This can be due to typo, lack of knowledge of the API, incorrect assumptions about runtime behaviours etc.
Typescript offers all javascript features plus an additional layer which is the Typescript Type System.
Javascript by default does no type checks. Typescript can highlight unexpected behaviour in javascript code,
hence catching bugs before they happen.
The goal of typescript is to be a static typecheker,
i.e a tool that runs before your code runs.
Javascript offers a small set of primitives, typescript extends this set with a few more such as:

* enum - a set of named constants
* any - allow anything
* unknown - ensure someone using this type declares what the type is
* never - its not possible that this type could happen
* void - nothing (undefined or null)

## 2. Type Composition

There are two syntaxes for building types:

    - Type
    - Interface
You can create complex types by combining multiple types.
There are two ways to achieve this:

    - Union
    - Generics

### 2.1 Union

A union is a type that can be of many types representing variables whose values can be any of the types in the union.

```ts
type MyType = string | number;
```

### 2.2 Generics

Generics provide variables to types.

```ts
type MyType<T> = T;

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

interface Backpack {
    <Type>add: (obj:Type) => void;
    <Type>get: ()=> Type;
}
```

### 2.3 Type vs Interface

* An interface is extendable while a type alias is not.
* Type alias names may appear in error messages while interface names always appear in error messages.
* Type aliases may not partcicipate in declaration merging but interfaces can.
* Interfaces can only be used to describe the shapes of objects but cannot be used to rename primitives.
* Using interfaces with extends is more friendly to the compiler than uisng types with intersections.

## 3. Structural Type System

One of typescripts core principles is that type checking focuses on the shape the values have. This is called ducktyping or structural typing. if two objects are of the same shape they are considered to be of the same type.

The shape matching requires only a subset of the members of the object to match.

```ts
interface Point {
    x: number;
    y: number;
}

function printPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}

const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"
```

## 4. Type Assertion

Sometimes you might know about the type of a value that typescript cannot infer. In such cases, you can use type assertion to specify the type of a value.

```ts
const myCanvas = document.getElementById('canvas') as HTMLCanvasElement;
```

like type annotations, type assertions are removed by the compiler and they wont affect your code at runtime.

You can use angle bracket syntax

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById('canvas');
```

## 5. Literal Inference

When you initialize a variable within an object, typescript will infer the type of the variable to be the type of the value you initialized it with.

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;
const req = {url: "example.com" , method:"GET"};
handleRequest(req.url, req.method);
```

    Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
There are two workarounds to this:

* Change the inference by adding type assertion in either location.
  
```ts
handleRequest(req.url, req.method as "GET");
const req ={ url: "example.com", method: "GET" as "GET"}
```

* use as const to convert the entire object into a type literal

```ts
const req = { url : "example.com", method : "GET" } as const;
```

The `as const` suffix acts as `const` but for the type system, ensuring all properties are assigned the literal type.

## 6. Null and Undefined

The language provides two primitives null and undefined to signal absent or uninitialized values.
How these types behave in typescript depend on whether you have the strictNullChecks flag on or off in the tsconfig compiler options.
with the flag off, values that might be null or undefined are accessed normally, and can be assigned to properties of any type.
with the flag on, the developer has to test for the presence of null or undefined before you can use the variable.

### 6.1 Non-Null Assertion Operator

Typescript has a special syntax for removing null or undefined from a variable without any explicit checks.
Writing `!` after any expression is an effective type assertion that the value is not null or undefined.

```ts
function liveDangerously(x?: number | null) {
    console.log(x!.toFixed());
}
```

## 7. Narrowing

Typescript overlays type analysis on Javascript's runtime control flow
constructs like if/else, conditional ternaries, loops, truthiness checks etc.
Typescript follows possible paths of execution that the program can take to analyze the most specific possible type of a value at a given position.
Typescript can narrow the type of a variable by looking at the typeguards and assignments. The process of refining the type of a variable to a more specific type than declared is called narrowing.
There are four ways to narrow types:

* The typeof narrowing

    checking against the value returned by typeof is a typeguard.
    typeof doesnt return the string 'null'. Instead, it returns 'object' for null values.
    the typeof operator gives very basic information about the type of values we have at runtime.
* Truthiness narrowing

    This is done using any expression in a conditional statement. conditional statements do not expect their condition expressions to be always boolean. They coerce the condition to a boolean according to some rules set in the ECMAScript specification. 0, NAN, "", null, undefined and 0n all coerce to false and all other values coerce to true.
    You can always coerce values to booleans by passing them to the Boolean function or double boolean negation. Using double boolean negation has the advantage that typescript infers a narrow literal boolean type (true | false), while the Boolean function is infered as a general boolean type.

    ```ts
    Boolean("Hello") // true
    !!"world" // true
    ```

* Equality narrowing

    Typescript can narrow types using strict and loose equality checks on variables or literal types and switch statements. In loose equality null == undefined
    in strict checks null !== undefined

* The `in` operator narrowing
  
    Javascript uses the `in` operator to check whether a property is an enumerable, own or inherited member of an object.
    Typescript uses the `in` operator to narrow the type of a variable in a conditional block.
    In typescript an example is `"value" in x`. `"value"` is a string literal and `x` is a union type. True narrows down `x`'s types to those that have either an optional or required property `"value"`.
    False narrows down `x`'s types to those that have an optional or missing property `"value"`.

    ```ts
    type Fish = {swim: () => void};
    type Bird = { fly: () => void};

    function move(animal:  Bird | Fish): void{
        if ("swim" in animal)
        {
            return animal.swim();
        }
        return animal.fly()
    }
    ```

    Optional properties appear on both sides of narrowing tests.
    For example a human can swim and fly(with equipment) hence will show on both sides of the `"swim" in animal` check

    ```ts
    type Fish = {swim: () => void};
    type Bird = { fly: () => void};
    type Human = { swim?: () => void; fly?: ()=> void };

    function move(animal:  Bird | Fish | Human): void{
        if ("swim" in animal)
        {
            animal;
            // (parameter) animal: Fish | Human
            return animal.swim();
        }
        animal;
        // (parameter) animal: Bird | Human
        return animal.fly()
    }
    ```

* Instanceof Narrowing

    js uses instanceof to check whether an object inherited from another.
    This checks whether the prototype of a constructor appears anywhere in the prototype chain of the probable instance object.
    instanceof is also a typeguard.
* Assignments

    When we assign to any variable, typescript looks at the right side of the assignment and narrows the left side appropriately

    ``` ts
    let x = Math.random() < 0.5 ? 10 : "hello world"
    // let x: string | number
    x = 1;
    // let x: number

    x = "goodbye!"
    // let x : string
    ```

    We first assigned a number to `x` and we were still able to assign a string to `x`. This is because the declared type of `x`, is `string | number` and assignability is always checked against the declared type.

* Control flow analysis
  
    In narrowing, The types that did not pass the first typeguard, are applicable in the rest of the body of the function.

* Type Predicates

    To define a user-defined typeguard, you define a function whose return type is a type predicate.

    ``` ts
    function isFish(pet: Bird | Fish): pet is Fish {
        return (pet as Fish).swim !== undefined
    }
    ```

    ``pet is Fish`` is the predicate here and it takes the form
    `parameter is Type` where parameter must be a parameter from the function signature.
    Anytime the typeguard `isFish` is called with any variable, it first narrows down the variable to `Fish` type if it's not compatible.

* Discriminated Unions

    When every type in a union contains a common property with literal types, typescript considers that to be a discriminated union and can narrow out the members of the union.

    ``` ts
    interface Circle {
        kind: "circle",
        radius: number
    }
    interface Square{
        kind: "square",
        sideLength: number
    }
    type Shape =  Circle | Square
    ```

    In this example, `kind` is the discriminant property. Its common among all members of the union and its value is a literal type.
    checking whether the `kind` property is a `'circle'` narrows the union `Shape` to `Circle` interface by getting rid of the members of `Shape` whose `kind` property's type was not a literal type `'circle'`

## 8. THE NEVER TYPE

Typescript will use a never type to represent a state that doesn't/shouldn't exist.
The `never` type is assignable to every type, However not ype is assignable to `never` except `never` itself. When narrowing types, you can reduce the options of a `union` to the point where you have exhausted all possibilities and in its in these cases that typescript uses a `never` type to represent a state which shouldn't exist.

## 9.FUNCTION TYPE EXPRESSIONS

The simplest way to describe a function is with a function expression.
It takes the form of

``` ts
fn: (a:string) => void;
type GreetFunction = (a: string) => void;
```

### 9.1 Call signatures

Functions can have properties in addition to being callable. Function type expressions do not allow for declaring such properties. To declare a function and its properties, a call signature in an object type is used.

``` ts
type DescribableFunction = {
    description: string;
    (arg: number): boolean;
}
function doSomething(fn: DescribableFunction){
    console.log(fn.description + "I returned " + fn(6))
}

function checkNumber(n: number){
    return n > 3;
}
checkNumber.description = "check me out yo .."
```

Note that the syntax is different from a function type expression, use of `:` instead of `=>` between the parameter list and the return type.

### 9.2 Construct Signatures

Functions that can be invoked with the `new` operator are referred to as constructors or constructor functions. These functions create new objects. You can create a construct signature by prefixing the call signature with the `new` keyword

``` ts
type SomeConstructor = {
    new (s: string): SomeObject;
}

function fn(cns: SomeConstructor):string {
    return new cns("Hello");
}
```

### 9.3 Generic Functions

It is common to write functions where the type of inputs relate to the type of outputs or where the inputs are related in someway.
Generics are used where we want to describe a correspondence between two values. This is done by adding a `Type` parameter in a function's signature.

``` ts
function firstElement<Type>(arr: Type[]): Type | undefined {
    return arr[0];
}
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

By adding a Type parameter to the function and using it in two places,  we have created a link between the input of the function and the output of the function, the return value.
We did not have to specify `Type`, it was inferred automatically.
Generic functions parameters take any kind of type, in some instances we might need to constrain the kind of types the parameters of a generic function can accept.
To do this, you constrain the `Type` parameter by writing an extends clause

``` ts
function longest<Type extends {length: number}>(a:Type, b:Type):Type {
    if (a.length >= b.length) {
        return a
    }
    else {
        return b
    }
}
```

Typescript can usually infer the intended type arguments in a generic call but in some instances, you might need to specify `Type`

``` ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
const arr = combine([1, 2, 3], ["hello"]);
Type 'string' is not assignable to type 'number'.

const arr = combine<string | number>([1, 2, 3], ["hello"]);
```
