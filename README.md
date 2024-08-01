# TYPECRIPT

## 1. Introduction

One of the most common errors that developers encounter is a TypeError where a value of a certain type was used where a different value was expected.
This can be due to typo, lack of knowledge of the API, incorrect assumptions about runtime behaviours etc.
Typescript offers all javascript features plus an additional layer which is the Typescript Type System.
Javascript by default does no do type checks. Typescript can highlight unexpected behaviour in javascript code,
hence catching bugs before they happen.
The goal of typescript is to be a static typecheker,
i.e a tool that runs before your code runs.
Javascript offers a small set of primitives, typescript extends this set with a few more such as:

    * enum - a set of named constants
    * any - allow anything
    * unknown - ensure someone using this type        declares what the type is
    * never - its not possible that this type could happen.
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

Generics provide variables to types. They allow us to create relationships between two types.

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

Like type annotations, type assertions are removed by the compiler and they wont affect your code at runtime.

You can use angle bracket syntax

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById('canvas');
```

## 5. Literal Inference

We can refer to specific strings and numbers as types.
Javascript uses let and var to declare variables that can be reassigned and const to declare variables that cannot be reassigned once initialized.
This is reflected in how typescript creates types from literals. Types declared with var and let are general and can be reassigned, types declared with const are type literals.
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
How these types behave in typescript depends on whether you have the strictNullChecks flag on or off in the tsconfig compiler options.
with the flag off, values that might be null or undefined are accessed normally, and can be assigned to properties of any type.
with the flag on, the developer has to test for the presence of null or undefined before they can use the variable.

### 6.1 Non-Null Assertion Operator

Typescript has a special syntax for removing null or undefined from a variable without any explicit checks.
Writing `!` after any expression is an effective type assertion that the value is not null or undefined.

```ts
function liveDangerously(x?: number | null) {
    console.log(x!.toFixed());
}
```

## 7 Narrowing

Typescript overlays type analysis on Javascript's runtime control flow
constructs like if/else, conditional ternaries, loops, truthiness checks etc.
Typescript follows possible paths of execution that the program can take to analyze the most specific possible type of a value at a given position.
Typescript can narrow the type of a variable by looking at the typeguards and assignments. The process of refining the type of a variable to a more specific type than declared is called narrowing.
There are four ways to narrow types:

### 7.1 The `typeof` operator narrowing

Checking against the value returned by `typeof` is a typeguard.
typeof doesnt return the string `'null'`. Instead, it returns `'object'` for `null` values.
The `typeof` operator gives very basic information about the type of values we have at runtime.

### 7.2 Truthiness narrowing

This is done using any expression in a conditional statement. Conditional statements do not expect their condition expressions to be always boolean. They coerce the condition to a boolean according to some rules set in the ECMAScript specification. `0, NaN, "", null, undefined` and `0n` all coerce to `false` and all other values coerce to `true`.
You can always coerce values to booleans by passing them to the `Boolean` function or double boolean negation. Using double boolean negation has the advantage that typescript infers a narrow literal boolean type (true | false), while the Boolean function is infered as a general boolean type.

```ts
Boolean("Hello") // true
!!"world" // true
```

### 7.3 Equality narrowing

Typescript can narrow types using strict and loose equality checks on variables or literal types and switch statements. In loose equality null == undefined
in strict checks null !== undefined

### 7.4 The `in` operator narrowing
  
Javascript uses the `in` operator to check whether a property is an own/inherited enumerable member of an object.
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

### 7.5 Instanceof Narrowing

js uses instanceof to check whether an object inherited from another.
This checks whether the prototype of a constructor appears anywhere in the prototype chain of the probable instance object.
instanceof is also a typeguard.

### 7.6 Assignments

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

### 7.7 Control flow analysis

Narrowing types based on reachability of code.
In narrowing, The types that did not pass the first typeguard, are applicable in the rest of the body of the function.

### 7.8 Type Predicates

To define a user-defined typeguard, you define a function whose return type is a type predicate.

``` ts
function isFish(pet: Bird | Fish): pet is Fish {
    return (pet as Fish).swim !== undefined
}
```

``pet is Fish`` is the predicate here and it takes the form
`parameter is Type` where parameter must be a parameter from the function signature.
Anytime the typeguard `isFish` is called with any variable, it first narrows down the variable to `Fish` type if it's not compatible.

### 7.9 Discriminated Unions

When every member in a union has a common property with literal types, typescript considers that to be a discriminated union and can narrow out the members of the union by narrowing with the discrimant.

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
Checking whether the `kind` property is a `'circle'` narrows the union `Shape` to `Circle` interface by getting rid of the members of `Shape` whose `kind` property's type was not a literal type `'circle'`

## 8.The `never` type

Typescript will use a `never` type to represent a state that doesn't/shouldn't exist.
The `never` type is assignable to every type, However not type is assignable to `never` except `never` itself. When narrowing types, you can reduce the options of a `union` to the point where you have exhausted all possibilities and in its in these cases that typescript uses a `never` type to represent a state which shouldn't exist.

## 9. FUNCTION TYPE EXPRESSIONS

The simplest way to describe a function is with a function type expression.
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

Functions that can be invoked with the `new` operator are referred to as constructors or constructor functions. These functions create new objects. You can create a construct signature by prefixing the call signature with the `new` keyword.

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
Generics are used where we want to describe a correspondence between two values. This is done by adding a `Type` parameter in a function's signature and using it in two places.

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

By adding a `Type` parameter to the function and using it in two places, we have created a link between the input of the function and the output of the function, the return value.
We did not have to specify `Type`, it was inferred automatically.
Generic functions' parameters take values of any kind of type, in some instances we might need to constrain the kind of types the parameters of a generic function can accept.
To do this, you constrain the `Type` parameter by extending it with the constrain type.

``` ts
function longest<Type extends {length: number}>(a:Type, b:Type) {
    if (a.length >= b.length) {
        return a
    }
    else {
        return b
    }
}
```

Return type inference works with Generic functions as well. This is because generics describe a relation between diffrent values to a type.
If we try to constrain the return type of the function above to `Type`, we are basically telling the compiler this function should return the same kind of object that was passed in, not just some object that meets the constraint.
Typescript can usually infer the intended type arguments in a generic call but in some instances, you might need to specify `Type`.

``` ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
const arr = combine([1, 2, 3], ["hello"]);
Type 'string' is not assignable to type 'number'.

const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

#### 9.3.1 Guidelines for Writing Good Generic Functions

* Push Type Parameters down

    Consider these two functions:

    ``` TS
    function firstFunc<Type>(arg: Type[]){
        return arg[0]
    }

    function secondFunc<Type extends any[]>(arg: Type){
        return arg[0]
    }
    ```

    The return type of `firstFunc` is inferred as `Type` but `secondFunc` the return type is inferred as `any` since typescript has to resolve `arg[0]` to the constraint type `any[0]`, making the return type the type first item in the `any[]` type values array. Its for this reason that you should use the `Type` parameter without constraining it.

* Use Fewer Type Parameters

    Consider these two functions:

    ``` ts
    function filter1<Type>(arr:Type[], fn:(arg:Type)=> boolean):Type[]{
        return arr.filter(fn);
    }

    function filter2<Type, Func extends (arg:Type) => boolean>(arr:Type[], fn: Func):Type[]{
        return arr.filter(fn);
    }
    ```

    The type parameter `Func` does not relate two values. This means users have to specify a second type for no reason at all. Always use as few type parameters as possible.

* Type Parameters Should appear twice.
  
    Type parameters are for relating the types of multiple values. If a type parameter is used only once in the function signature its not relating anything. If a type parameter appears only once, you should reconsider using it.

### 9.4 Optional Parameters

Some functions take a variable number of arguments
for example the `toFixed` method takes an optional
digit count. This is modelled in typescript using the question mark `?` after the optional argument name.

``` ts
function optionalArg(arg?: string){
    ///
}
```

Even though `arg` is annotated as ``string``, the actual type is `string | undefined` unspecified values get undefined in js.
You can also provide a default value for the parameter, and now `arg` will have a type of `string` because any `undefined` argument will be replaced with the default value of the optional parameter.

### 9.5 Function Overloads

Some functions can be called with a variety of argument counts and types.
In ts if a function is called in a variety of ways, it can be modelled using Overload signatures. To do this, write a function signature for every form of the function and an implementation signature, which holds the body of the function.

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y : number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?:number): Date{
    if(d !== undefined && y !== undefined){
        return new Date(y, mOrTimestamp, d)
    }
    return new Date(mOrTimestamp)
}

```

The implementation signature is not visible from the outside.
The implementation must be compatible with its signatures in terms of parameter types and return types.

#### 9.5.1 Guidelines to writing Overloads

* Always prefer parameters with union types instead of overloads when possible

### 9.6 Declaring `this` in a function

`this` refers to the current object from which a method  is called from
Typescript will infer this using [Control Flow Analysis](#77-control-flow-analysis)
You cannot have a parameter called `this`, so in ts `this` is declared inside the function body.

``` ts
const user ={
    id:10,
    admin: true,
    becomeAdmin: function(){
        this.admin = true;
    }
}
interface DB {
    filterusers(filter:(this: User) => boolean): User[]
}
const db = getDb();
const admins = db.filterusers(function (this: User){
    return this.admin
})
```

This pattern is common with callback-style apis.

### 9.7. Other Types

#### 9.7.1. void

`void` represents the return values of functions with no return statement or their return statement does not return an explicit value.
In js a function with no return, will implicitly return `undefined` but `undefined` is not the same as `void`.

#### 9.7.2 unknown

The `unknown` type represents any value. Its similar to the any type but its safer since its not possible to do anything on an `unknown` type value

``` ts
function f1 (a: any){
    return a.b();
};
function f2 (a: unknown){
    return a.b(); // 'a' is of type unknown

}
```

This is useful when describing function types.
You can describe functions that accept any kind of value without using `any`

#### 9.7.3 never

This type represents values which are never observed.
In a return type this means the function throws an exception or terminates execution of the program
`never` is also observed when typescript determines theres nothing left in a `union`

#### 9.7.4 Rest Parameters & Arguments

We can define functions that take an unbounded number of arguments using rest parameters.
A rest parameter appears after all parameters and uses the `...` syntax which causes all remaining parameters to be placed within an array.
Rest parameters allow a function to accept an indefinite number of arguments as an array.
A function definition can only have one rest parameter
Trailing commas are not allowed after the rest parameter.
Rest parameter cannot have a default value

``` ts
function multiply(n:number: ...m: number[]){
    return m.map((x) => n * x)
};
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
const arr = [1, 2, 3, 4];
const b = multiply(10, ...arr) // spread syntax to unpack
```

The inferred type here is `any[]`. Any annotation should be added in the form of `Array<T>` or `T[]`.

Conversely we can provide a variable number of arguments from an `iterable` like a `string` or `array` using the `spread` syntax. The `spread` syntax differs from the `rest` syntax in that `rest` syntax packs distinct variables into an array,
while `spread` syntax, unpacks an array to distinct elements.

#### 9.7.5 Parameter Destructuring

You can use `destructuring assignment` to unpack values from an array or properties from an object provided as an argument, into local variables.

``` ts
function sum ({a, b, c}){
    return a + b + c;
}
type ABC = {a: number, b: number, c: number}
function sum ({a,b,c}: ABC){
    return a + b + c;
}
// type annotations
```

### 9.8 Assignability of Functions

A function type expresion with a return type of `void`:
`type voidFunc = () => void`
does not force functions to not return something, It can return any value but it will be ignored. Thus the following implementations are valid:

``` ts
type voidFunc: () => void;

const f1: voidFunc = () => true;
```

And when the return value of such function is assigned to another variable it will retain its void type.
This explains how `Array.prototype.push` returns a number and the `Array.prototype.forEach` method expects a function with a return type of `void`.
A special case to consider is when a function declaration specifies a return type of void, such a function is not allowed to return anything
