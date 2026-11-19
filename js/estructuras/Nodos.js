/**
 * Nodos.js
 * Un NODO es una "cajita" que guarda un dato y una o más referencias
 * (flechas) a otras cajitas. Todas las estructuras se construyen con nodos.
 */

/**
 * Nodo simple: un dato y una referencia al siguiente nodo.
 * Lo usan la Pila, la Cola y la Lista Circular.
 */
class NodoSimple {                 // molde para crear nodos simples
  /**
   * Crea un nodo simple.
   * @param {*} dato - Valor que se guarda en el nodo.
   * @returns {NodoSimple} El nodo creado, sin siguiente.
   */
  constructor(dato) {              // se ejecuta al hacer: new NodoSimple(algo)
    this.dato = dato;              // guarda el valor dentro del nodo
    this.siguiente = null;         // flecha al siguiente nodo (null = ninguno)
  }
}

/**
 * Nodo doble: un dato, una referencia al siguiente y otra al anterior.
 * Lo usa la Lista Doblemente Enlazada.
 */
class NodoDoble {                  // molde para crear nodos dobles
  /**
   * Crea un nodo doble.
   * @param {*} dato - Valor que se guarda en el nodo.
   * @returns {NodoDoble} El nodo creado, sin vecinos.
   */
  constructor(dato) {
    this.dato = dato;              // guarda el valor
    this.siguiente = null;         // flecha hacia adelante
    this.anterior = null;          // flecha hacia atrás
  }
}

/**
 * Nodo de árbol: un dato y referencias a los hijos izquierdo y derecho.
 * Lo usa el Árbol Binario de Búsqueda.
 */
class NodoArbol {                  // molde para crear nodos de árbol
  /**
   * Crea un nodo de árbol.
   * @param {*} dato - Valor que se guarda en el nodo.
   * @returns {NodoArbol} El nodo creado, sin hijos.
   */
  constructor(dato) {
    this.dato = dato;              // guarda el valor
    this.izquierdo = null;         // hijo izquierdo (datos menores)
    this.derecho = null;           // hijo derecho (datos mayores o iguales)
  }
}