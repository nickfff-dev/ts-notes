interface Container<T extends HTMLElement = HTMLDivElement, U extends HTMLElement[] = T[]> {
    element: T;
    children?: U;
}

declare function createComponent<T extends HTMLElement = HTMLDivElement, U extends HTMLElement[] = T[]>(element?: T, children?: U): Container<T, U>;

// declare namespace createComponent {
 
// }

