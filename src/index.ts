function padLeft(padding: number | string, input: string): string{
    if(typeof padding === "number"){
        return " ".repeat(padding) + input;
    }
    return padding + input;
}

interface Backpack<Type> {
  
    add: (obj: Type) => void; 
    get: () => Type;
  }

interface Backpack2 {

    add<Type> (obj:Type): void; /* add method with generic type */
    get<Type> (): Type;
}

let backpack: Backpack<string> = {
    
    add: (obj:string):void => {
        console.log(obj);
    },
    get: () => {
        return "hi";
    }
};

function add(obj:string):void{
    console.log(obj);
}

function get(): string {
    return "hi";
}

let backpack2: Backpack2 = {add, get} as Backpack2;

backpack.add("hi");
const object = backpack.get();
console.log(object);

backpack2.add("hi");
const object2 = backpack2.get();
console.log(object2);

function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
  }
   
  // Parameter 'n' is of type 'string'
  // 'parsed' is of type 'number[]'
  const parsed = map(["1", "2", "3"], (n) => parseInt(n));