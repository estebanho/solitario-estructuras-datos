/**
 * ListaCircular.js
 * Lista simplemente enlazada CIRCULAR hecha desde cero.
 * El último nodo apunta otra vez a la cabeza, así que se puede dar la vuelta
 * a la lista una y otra vez. Solo se guarda "ultimo"; la cabeza es ultimo.siguiente.
 *
 * Uso en el juego: el MAZO DE ROBO, que se recorre una y otra vez.
 *
 * Complejidad:
 *   insertarInicio O(1) | insertarFinal O(1) | insertarEnPosicion O(n)
 *   eliminarEnPosicion O(n) | eliminar O(n) | buscar O(n) | obtener O(n)
 *   recorrer O(n) | estaVacia O(1) | tamano O(1)
 */
class ListaCircular {                                   // molde para crear listas circulares
  /**
   * Crea una lista circular vacía.
   * @returns {ListaCircular} Lista sin elementos.
   */
  constructor() {                                       // se ejecuta al hacer: new ListaCircular()
    this.ultimo = null;                                 // flecha al último nodo (su siguiente es la cabeza)
    this.cantidad = 0;                                  // cuántos elementos hay
  }                                                     // fin del constructor

  /**
   * Devuelve el primer nodo (la cabeza).
   * @returns {NodoSimple|null} La cabeza, o null si la lista está vacía.
   */
  obtenerCabeza() {                                     // no recibe nada
    if (this.ultimo === null) {                         // si la lista está vacía...
      return null;                                      // ...no hay cabeza
    }                                                   // fin del if
    return this.ultimo.siguiente;                       // la cabeza es el que sigue al último
  }                                                     // fin de obtenerCabeza

  /**
   * Indica si la lista está vacía.
   * @returns {boolean} true si no tiene elementos.
   */
  estaVacia() {                                         // no recibe nada
    return this.ultimo === null;                        // vacía si no hay último
  }                                                     // fin de estaVacia

  /**
   * Indica cuántos elementos tiene la lista.
   * @returns {number} Cantidad de elementos.
   */
  tamano() {                                            // no recibe nada
    return this.cantidad;                               // devuelve el contador
  }                                                     // fin de tamano

  /**
   * Inserta un elemento al inicio (será la nueva cabeza).
   * @param {*} dato - Elemento a insertar.
   * @returns {void} No devuelve nada.
   */
  insertarInicio(dato) {                                // recibe el dato a insertar
    const nuevoNodo = new NodoSimple(dato);             // crea la cajita
    if (this.estaVacia()) {                             // si la lista está vacía...
      nuevoNodo.siguiente = nuevoNodo;                  // ...el nodo se apunta a sí mismo (círculo de 1)
      this.ultimo = nuevoNodo;                          // ...y es también el último
    } else {                                            // si ya hay elementos...
      nuevoNodo.siguiente = this.ultimo.siguiente;      // ...el nuevo apunta a la cabeza vieja
      this.ultimo.siguiente = nuevoNodo;                // ...y el último apunta al nuevo (nueva cabeza)
    }                                                   // fin del if
    this.cantidad++;                                    // hay un elemento más
  }                                                     // fin de insertarInicio

  /**
   * Inserta un elemento al final.
   * Truco: se inserta al inicio y luego se mueve "ultimo" un paso,
   * porque en un círculo "antes de la cabeza" y "al final" es el mismo lugar.
   * @param {*} dato - Elemento a insertar.
   * @returns {void} No devuelve nada.
   */
  insertarFinal(dato) {                                 // recibe el dato a insertar
    this.insertarInicio(dato);                          // lo pone justo después del último
    this.ultimo = this.ultimo.siguiente;                // el nodo nuevo pasa a ser el último
  }                                                     // fin de insertarFinal

  /**
   * Devuelve el NODO que está en una posición (0 = cabeza).
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {NodoSimple|null} El nodo, o null si la posición no es válida.
   */
  obtenerNodo(posicion) {                               // recibe la posición buscada
    if (posicion < 0 || posicion >= this.cantidad) {    // si la posición está fuera de rango...
      return null;                                      // ...no hay nodo
    }                                                   // fin del if
    let nodoActual = this.obtenerCabeza();              // empieza en la cabeza
    for (let i = 0; i < posicion; i++) {                // avanza "posicion" veces
      nodoActual = nodoActual.siguiente;                // pasa al siguiente nodo
    }                                                   // fin del for
    return nodoActual;                                  // devuelve el nodo encontrado
  }                                                     // fin de obtenerNodo

  /**
   * Devuelve el DATO que está en una posición.
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {*|null} El dato, o null si la posición no es válida.
   */
  obtener(posicion) {                                   // recibe la posición
    const nodo = this.obtenerNodo(posicion);            // busca el nodo
    if (nodo === null) {                                // si no existe...
      return null;                                      // ...devuelve null
    }                                                   // fin del if
    return nodo.dato;                                   // devuelve el dato del nodo
  }                                                     // fin de obtener

  /**
   * Inserta un elemento en una posición (0 = inicio, tamano = final).
   * @param {number} posicion - Índice donde quedará el nuevo elemento.
   * @param {*} dato - Elemento a insertar.
   * @returns {boolean} true si se insertó; false si la posición no es válida.
   */
  insertarEnPosicion(posicion, dato) {                  // recibe la posición y el dato
    if (posicion < 0 || posicion > this.cantidad) {     // si la posición no es válida...
      return false;                                     // ...no hace nada
    }                                                   // fin del if
    if (posicion === 0) {                               // si es al inicio...
      this.insertarInicio(dato);                        // ...usa insertarInicio
      return true;
    }
    if (posicion === this.cantidad) {                   // si es al final...
      this.insertarFinal(dato);                         // ...usa insertarFinal
      return true;
    }
    const nodoAnterior = this.obtenerNodo(posicion - 1); // nodo que quedará antes del nuevo
    const nuevoNodo = new NodoSimple(dato);             // crea la cajita
    nuevoNodo.siguiente = nodoAnterior.siguiente;       // el nuevo apunta al que estaba en esa posición
    nodoAnterior.siguiente = nuevoNodo;                 // el anterior apunta al nuevo
    this.cantidad++;                                    // hay un elemento más
    return true;                                        // se insertó correctamente
  }                                                     // fin de insertarEnPosicion

  /**
   * Elimina el elemento de una posición.
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {*|null} El dato eliminado, o null si la posición no es válida.
   */
  eliminarEnPosicion(posicion) {                        // recibe la posición a eliminar
    if (posicion < 0 || posicion >= this.cantidad) {    // si la posición no es válida...
      return null;                                      // ...no hace nada
    }                                                   // fin del if
    let nodoAnterior;                                   // aquí guardaremos el nodo de antes
    if (posicion === 0) {                               // si se borra la cabeza...
      nodoAnterior = this.ultimo;                       // ...su anterior es el último (por ser circular)
    } else {                                            // si es otra posición...
      nodoAnterior = this.obtenerNodo(posicion - 1);    // ...se busca el nodo anterior
    }                                                   // fin del if
    const nodoEliminado = nodoAnterior.siguiente;       // el nodo que se va a borrar
    if (this.cantidad === 1) {                          // si era el único elemento...
      this.ultimo = null;                               // ...la lista queda vacía
    } else {                                            // si hay más elementos...
      nodoAnterior.siguiente = nodoEliminado.siguiente; // ...el anterior "se salta" al eliminado
      if (nodoEliminado === this.ultimo) {              // si se borró el último...
        this.ultimo = nodoAnterior;                     // ...el anterior pasa a ser el último
      }                                                 // fin del if
    }                                                   // fin del if
    this.cantidad--;                                    // hay un elemento menos
    return nodoEliminado.dato;                          // devuelve el dato eliminado
  }                                                     // fin de eliminarEnPosicion

  /**
   * Busca un elemento y devuelve su posición.
   * @param {*} datoBuscado - Elemento que se busca.
   * @returns {number} Posición del elemento, o -1 si no existe.
   */
  buscar(datoBuscado) {                                 // recibe el dato que se busca
    let nodoActual = this.obtenerCabeza();              // empieza en la cabeza
    for (let i = 0; i < this.cantidad; i++) {           // da UNA vuelta (usa la cantidad para no girar infinito)
      if (nodoActual.dato === datoBuscado) {            // si lo encontró...
        return i;                                       // ...devuelve la posición
      }                                                 // fin del if
      nodoActual = nodoActual.siguiente;                // pasa al siguiente
    }                                                   // fin del for
    return -1;                                          // no estaba en la lista
  }                                                     // fin de buscar

  /**
   * Elimina la primera aparición de un elemento.
   * @param {*} datoBuscado - Elemento a eliminar.
   * @returns {boolean} true si se encontró y eliminó; false si no existía.
   */
  eliminar(datoBuscado) {                               // recibe el dato a eliminar
    const posicion = this.buscar(datoBuscado);          // primero lo busca
    if (posicion === -1) {                              // si no existe...
      return false;                                     // ...no elimina nada
    }                                                   // fin del if
    this.eliminarEnPosicion(posicion);                  // lo elimina por su posición
    return true;                                        // se eliminó
  }                                                     // fin de eliminar

  /**
   * Recorre la lista una vuelta completa, desde la cabeza.
   * @param {function} visitar - Función que recibe (dato, posicion) por cada elemento.
   * @returns {void} No devuelve nada.
   */
  recorrer(visitar) {                                   // recibe una función
    let nodoActual = this.obtenerCabeza();              // empieza en la cabeza
    for (let i = 0; i < this.cantidad; i++) {           // una vuelta completa
      visitar(nodoActual.dato, i);                      // aplica la función al dato
      nodoActual = nodoActual.siguiente;                // pasa al siguiente (del último salta a la cabeza)
    }                                                   // fin del for
  }                                                     // fin de recorrer
}                                                       // fin de la clase ListaCircular