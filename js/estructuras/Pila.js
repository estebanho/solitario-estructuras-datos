/**
 * Pila.js
 * Pila (LIFO: el último en entrar es el primero en salir) hecha desde cero
 * con nodos simples enlazados.
 *
 * Uso en el juego: las 4 fundaciones (solo se pone o quita la carta de arriba).
 *
 * Complejidad:
 *   apilar O(1) | desapilar O(1) | verTope O(1) | estaVacia O(1) | tamano O(1) | recorrer O(n)
 */
class Pila {                                   // molde para crear pilas
  /**
   * Crea una pila vacía.
   * @returns {Pila} Una pila sin elementos.
   */
  constructor() {                              // se ejecuta al hacer: new Pila()
    this.tope = null;                          // flecha al nodo de arriba; null = la pila está vacía
    this.cantidad = 0;                         // cuántos elementos hay (para saber el tamaño rápido)
  }                                            // fin del constructor

  /**
   * Agrega un elemento en la parte de arriba de la pila.
   * @param {*} dato - Elemento que se va a apilar.
   * @returns {void} No devuelve nada.
   */
  apilar(dato) {                               // recibe el dato que se quiere poner arriba
    const nuevoNodo = new NodoSimple(dato);    // 1. crea una cajita con ese dato
    nuevoNodo.siguiente = this.tope;           // 2. la cajita nueva apunta al que era el tope
    this.tope = nuevoNodo;                     // 3. la cajita nueva pasa a ser el tope
    this.cantidad++;                           // 4. ahora hay un elemento más
  }                                            // fin de apilar

  /**
   * Quita el elemento de arriba y lo devuelve.
   * @returns {*|null} El elemento que estaba arriba, o null si la pila está vacía.
   */
  desapilar() {                                // no recibe nada
    if (this.estaVacia()) {                    // si no hay elementos...
      return null;                             // ...devuelve null en vez de fallar
    }                                          // fin del if
    const datoQuitado = this.tope.dato;        // guarda el dato de arriba antes de soltarlo
    this.tope = this.tope.siguiente;           // el tope baja al nodo de abajo
    this.cantidad--;                           // ahora hay un elemento menos
    return datoQuitado;                        // devuelve el dato que se quitó
  }                                            // fin de desapilar

  /**
   * Muestra el elemento de arriba SIN quitarlo.
   * @returns {*|null} El elemento de arriba, o null si la pila está vacía.
   */
  verTope() {                                  // no recibe nada
    if (this.estaVacia()) {                    // si no hay elementos...
      return null;                             // ...no hay nada que mostrar
    }                                          // fin del if
    return this.tope.dato;                     // devuelve el dato del nodo de arriba
  }                                            // fin de verTope

  /**
   * Indica si la pila no tiene elementos.
   * @returns {boolean} true si está vacía, false si tiene elementos.
   */
  estaVacia() {                                // no recibe nada
    return this.tope === null;                 // si el tope no apunta a nada, está vacía
  }                                            // fin de estaVacia

  /**
   * Indica cuántos elementos tiene la pila.
   * @returns {number} La cantidad de elementos.
   */
  tamano() {                                   // no recibe nada
    return this.cantidad;                      // devuelve el contador
  }                                            // fin de tamano

  /**
   * Visita todos los elementos, desde el tope hasta el fondo, sin quitarlos.
   * (Operación extra: la usaremos para dibujar las fundaciones en pantalla).
   * @param {function} visitar - Función que recibe (dato, posicion) por cada elemento.
   * @returns {void} No devuelve nada.
   */
  recorrer(visitar) {                          // recibe una función que se aplicará a cada dato
    let nodoActual = this.tope;                // empieza en el nodo de arriba
    let posicion = 0;                          // posición contada desde el tope (0 = arriba)
    while (nodoActual !== null) {              // mientras haya nodos por visitar...
      visitar(nodoActual.dato, posicion);      // ...llama a la función con el dato y su posición
      nodoActual = nodoActual.siguiente;       // avanza al nodo de abajo
      posicion++;                              // la siguiente posición
    }                                          // fin del while
  }                                            // fin de recorrer
}                                              // fin de la clase Pila