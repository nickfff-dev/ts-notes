function createComponent<T extends HTMLElement = HTMLDivElement, U extends HTMLElement[] = T[]>(element?: T, children?: U): Container<T, U> {
    if ( element ) {
        if (children) {
            for (const child of children) {
                element.appendChild(child);
            }
    }
}
return {
    element: (element || document.createElement('div')) as T,
    children: children || undefined
};
};


var list = document.createElement('ol');
var listItem1 = document.createElement('li');
var listItem2 = document.createElement('li');
listItem1.textContent = "Hello Worlds";
listItem2.textContent = "Habari Gani";

const mylist = createComponent(createComponent().element, [createComponent(list, [listItem1, listItem2]).element]);

console.log(mylist);

document.body.appendChild(mylist.element);

interface Backpack<Type> {
  
    (obj: Type) : Type; 
    
}

interface Backpack2 {
    <Type>(obj:Type): Type; /* add method with generic type */
}


function add<Input>(obj:Input):Input{
    return obj;
}


let backpack: Backpack<string> = add;
let backpack2: Backpack2 = add;



let object2 = backpack2(5);
let object3 = backpack2("hi");
console.log(object3);

console.log(object2);

function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
  }
   
  // Parameter 'n' is of type 'string'
  // 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));




function multiply(n:number, ...m: number[]){
    return m.map((x ) => n * x )
};
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);