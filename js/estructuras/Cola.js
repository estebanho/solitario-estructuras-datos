/**
 * Cola.js
 * Cola (FIFO: el primero en entrar es el primero en salir) hecha desde cero
 * con nodos simples enlazados. Guarda dos referencias: frente (por donde se sale)
 * y final (por donde se entra), para que ambas operaciones sean O(1).
 *
 * Uso en el juego: reparto de las cartas barajadas, en el orden en que entraron.
 *
 * Complejidad:
 *   encolar O(1) | desencolar O(1) | verFrente O(1) | estaVacia O(1) | tamano O(1) | recorrer O(n)
 */
class Cola {                                    // molde para crear colas
  /**
   * Crea una cola vacía.
   * @returns {Cola} Una cola sin elementos.
   */
  constructor() {                               // se ejecuta al hacer: new Cola()
    this.frente = null;                         // flecha al primer nodo (el próximo en salir)
    this.final = null;                          // flecha al último nodo (el último que entró)
    this.cantidad = 0;                          // cuántos elementos hay
  }                                             // fin del constructor

  /**
   * Agrega un elemento al final de la cola.
   * @param {*} dato - Elemento que se va a encolar.
   * @returns {void} No devuelve nada.
   */
  encolar(dato) {                               // recibe el dato que entra a la fila
    const nuevoNodo = new NodoSimple(dato);     // 1. crea una cajita con ese dato
    if (this.estaVacia()) {                     // 2. si la cola estaba vacía...
      this.frente = nuevoNodo;                  //    ...el nuevo también es el frente
    } else {                                    //    si ya había elementos...
      this.final.siguiente = nuevoNodo;         //    ...el último actual apunta al nuevo
    }                                           // fin del if
    this.final = nuevoNodo;                     // 3. en ambos casos, el nuevo pasa a ser el final
    this.cantidad++;                            // 4. hay un elemento más
  }                                             // fin de encolar

  /**
   * Quita el elemento del frente y lo devuelve.
   * @returns {*|null} El elemento del frente, o null si la cola está vacía.
   */
  desencolar() {                                // no recibe nada
    if (this.estaVacia()) {                     // si no hay elementos...
      return null;                              // ...devuelve null en vez de fallar
    }                                           // fin del if
    const datoQuitado = this.frente.dato;       // guarda el dato del frente
    this.frente = this.frente.siguiente;        // el frente avanza al siguiente nodo
    if (this.frente === null) {                 // si ya no quedan nodos...
      this.final = null;                        // ...el final también debe quedar vacío
    }                                           // fin del if
    this.cantidad--;                            // hay un elemento menos
    return datoQuitado;                         // devuelve el dato que salió
  }                                             // fin de desencolar

  /**
   * Muestra el elemento del frente SIN quitarlo.
   * @returns {*|null} El elemento del frente, o null si la cola está vacía.
   */
  verFrente() {                                 // no recibe nada
    if (this.estaVacia()) {                     // si no hay elementos...
      return null;                              // ...no hay nada que mostrar
    }                                           // fin del if
    return this.frente.dato;                    // devuelve el dato del primer nodo
  }                                             // fin de verFrente

  /**
   * Indica si la cola no tiene elementos.
   * @returns {boolean} true si está vacía, false si tiene elementos.
   */
  estaVacia() {                                 // no recibe nada
    return this.frente === null;                // si el frente no apunta a nada, está vacía
  }                                             // fin de estaVacia

  /**
   * Indica cuántos elementos tiene la cola.
   * @returns {number} La cantidad de elementos.
   */
  tamano() {                                    // no recibe nada
    return this.cantidad;                       // devuelve el contador
  }                                             // fin de tamano

  /**
   * Visita todos los elementos del frente al final, sin quitarlos.
   * @param {function} visitar - Función que recibe (dato, posicion) por cada elemento.
   * @returns {void} No devuelve nada.
   */
  recorrer(visitar) {                           // recibe una función para aplicar a cada dato
    let nodoActual = this.frente;               // empieza por el frente
    let posicion = 0;                           // posición contada desde el frente (0 = primero)
    while (nodoActual !== null) {               // mientras haya nodos...
      visitar(nodoActual.dato, posicion);       // ...llama a la función con el dato y su posición
      nodoActual = nodoActual.siguiente;        // avanza al siguiente nodo
      posicion++;                               // siguiente posición
    }                                           // fin del while
  }                                             // fin de recorrer
}                                               // fin de la clase Cola