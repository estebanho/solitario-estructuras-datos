/**
 * ListaDoble.js
 * Lista doblemente enlazada hecha desde cero.
 * Cada nodo conoce a su anterior y a su siguiente, y la lista guarda la
 * cabeza (primer nodo) y la cola (último nodo). Se recorre en ambos sentidos.
 *
 * Uso en el juego: cada una de las 7 COLUMNAS del tablero.
 *   cabeza = carta del fondo, cola = carta de arriba.
 *   Mover un grupo de cartas = cortarDesde() + concatenar().
 *
 * Complejidad:
 *   insertarInicio O(1) | insertarFinal O(1) | insertarEnPosicion O(n)
 *   eliminarEnPosicion O(n) | eliminarFinal O(1) | eliminar O(n) | buscar O(n)
 *   obtener O(n) | recorrerAdelante O(n) | recorrerAtras O(n)
 *   cortarDesde O(n) | concatenar O(1) | estaVacia O(1) | tamano O(1)
 */
class ListaDoble {                                      // molde para crear listas dobles
  /**
   * Crea una lista doble vacía.
   * @returns {ListaDoble} Lista sin elementos.
   */
  constructor() {                                       // se ejecuta al hacer: new ListaDoble()
    this.cabeza = null;                                 // flecha al primer nodo (carta del fondo)
    this.cola = null;                                   // flecha al último nodo (carta de arriba)
    this.cantidad = 0;                                  // cuántos elementos hay
  }                                                     // fin del constructor

  /**
   * Indica si la lista está vacía.
   * @returns {boolean} true si no tiene elementos.
   */
  estaVacia() {                                         // no recibe nada
    return this.cabeza === null;                        // vacía si no hay cabeza
  }                                                     // fin de estaVacia

  /**
   * Indica cuántos elementos tiene la lista.
   * @returns {number} Cantidad de elementos.
   */
  tamano() {                                            // no recibe nada
    return this.cantidad;                               // devuelve el contador
  }                                                     // fin de tamano

  /**
   * Inserta un elemento al inicio de la lista.
   * @param {*} dato - Elemento a insertar.
   * @returns {void} No devuelve nada.
   */
  insertarInicio(dato) {                                // recibe el dato
    const nuevoNodo = new NodoDoble(dato);              // crea la cajita doble
    if (this.estaVacia()) {                             // si la lista está vacía...
      this.cabeza = nuevoNodo;                          // ...el nuevo es la cabeza
      this.cola = nuevoNodo;                            // ...y también la cola
    } else {                                            // si ya hay elementos...
      nuevoNodo.siguiente = this.cabeza;                // ...el nuevo apunta hacia adelante a la cabeza vieja
      this.cabeza.anterior = nuevoNodo;                 // ...la cabeza vieja apunta hacia atrás al nuevo
      this.cabeza = nuevoNodo;                          // ...el nuevo pasa a ser la cabeza
    }                                                   // fin del if
    this.cantidad++;                                    // hay un elemento más
  }                                                     // fin de insertarInicio

  /**
   * Inserta un elemento al final de la lista (poner una carta encima de la columna).
   * @param {*} dato - Elemento a insertar.
   * @returns {void} No devuelve nada.
   */
  insertarFinal(dato) {                                 // recibe el dato
    const nuevoNodo = new NodoDoble(dato);              // crea la cajita doble
    if (this.estaVacia()) {                             // si la lista está vacía...
      this.cabeza = nuevoNodo;                          // ...el nuevo es la cabeza
      this.cola = nuevoNodo;                            // ...y también la cola
    } else {                                            // si ya hay elementos...
      nuevoNodo.anterior = this.cola;                   // ...el nuevo apunta hacia atrás a la cola vieja
      this.cola.siguiente = nuevoNodo;                  // ...la cola vieja apunta hacia adelante al nuevo
      this.cola = nuevoNodo;                            // ...el nuevo pasa a ser la cola
    }                                                   // fin del if
    this.cantidad++;                                    // hay un elemento más
  }                                                     // fin de insertarFinal

  /**
   * Devuelve el NODO de una posición. Empieza por la punta más cercana
   * (cabeza o cola), aprovechando que la lista tiene doble enlace.
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {NodoDoble|null} El nodo, o null si la posición no es válida.
   */
  obtenerNodo(posicion) {                               // recibe la posición
    if (posicion < 0 || posicion >= this.cantidad) {    // si está fuera de rango...
      return null;                                      // ...no hay nodo
    }                                                   // fin del if
    let nodoActual;                                     // aquí quedará el nodo buscado
    if (posicion < this.cantidad / 2) {                 // si está en la primera mitad...
      nodoActual = this.cabeza;                         // ...empieza desde la cabeza
      for (let i = 0; i < posicion; i++) {              // ...y avanza hacia adelante
        nodoActual = nodoActual.siguiente;
      }
    } else {                                            // si está en la segunda mitad...
      nodoActual = this.cola;                           // ...empieza desde la cola
      for (let i = this.cantidad - 1; i > posicion; i--) { // ...y retrocede hacia atrás
        nodoActual = nodoActual.anterior;
      }
    }                                                   // fin del if
    return nodoActual;                                  // devuelve el nodo encontrado
  }                                                     // fin de obtenerNodo

  /**
   * Devuelve el DATO de una posición.
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {*|null} El dato, o null si la posición no es válida.
   */
  obtener(posicion) {                                   // recibe la posición
    const nodo = this.obtenerNodo(posicion);            // busca el nodo
    if (nodo === null) {                                // si no existe...
      return null;                                      // ...devuelve null
    }
    return nodo.dato;                                   // devuelve su dato
  }                                                     // fin de obtener

  /**
   * Devuelve el último dato (la carta de arriba de la columna).
   * @returns {*|null} El dato de la cola, o null si la lista está vacía.
   */
  ultimoDato() {                                        // no recibe nada
    if (this.cola === null) {                           // si está vacía...
      return null;                                      // ...no hay último dato
    }
    return this.cola.dato;                              // devuelve el dato de la cola
  }                                                     // fin de ultimoDato

  /**
   * Inserta un elemento en una posición (0 = inicio, tamano = final).
   * @param {number} posicion - Índice donde quedará el elemento.
   * @param {*} dato - Elemento a insertar.
   * @returns {boolean} true si se insertó; false si la posición no es válida.
   */
  insertarEnPosicion(posicion, dato) {                  // recibe posición y dato
    if (posicion < 0 || posicion > this.cantidad) {     // si la posición no es válida...
      return false;                                     // ...no hace nada
    }
    if (posicion === 0) {                               // al inicio
      this.insertarInicio(dato);
      return true;
    }
    if (posicion === this.cantidad) {                   // al final
      this.insertarFinal(dato);
      return true;
    }
    const nodoSiguiente = this.obtenerNodo(posicion);   // el que hoy ocupa esa posición
    const nodoAnterior = nodoSiguiente.anterior;        // el que está antes de él
    const nuevoNodo = new NodoDoble(dato);              // crea la cajita
    nuevoNodo.anterior = nodoAnterior;                  // nuevo ← anterior
    nuevoNodo.siguiente = nodoSiguiente;                // nuevo → siguiente
    nodoAnterior.siguiente = nuevoNodo;                 // anterior → nuevo
    nodoSiguiente.anterior = nuevoNodo;                 // siguiente ← nuevo
    this.cantidad++;                                    // hay un elemento más
    return true;                                        // se insertó
  }                                                     // fin de insertarEnPosicion

  /**
   * Elimina el elemento de una posición.
   * @param {number} posicion - Índice entre 0 y tamano-1.
   * @returns {*|null} El dato eliminado, o null si la posición no es válida.
   */
  eliminarEnPosicion(posicion) {                        // recibe la posición
    const nodo = this.obtenerNodo(posicion);            // busca el nodo a borrar
    if (nodo === null) {                                // si no existe...
      return null;                                      // ...no hace nada
    }
    if (nodo.anterior !== null) {                       // si tiene un nodo antes...
      nodo.anterior.siguiente = nodo.siguiente;         // ...ese nodo se salta al eliminado
    } else {                                            // si no tiene anterior, era la cabeza...
      this.cabeza = nodo.siguiente;                     // ...la nueva cabeza es el siguiente
    }
    if (nodo.siguiente !== null) {                      // si tiene un nodo después...
      nodo.siguiente.anterior = nodo.anterior;          // ...ese nodo apunta hacia atrás al anterior
    } else {                                            // si no tiene siguiente, era la cola...
      this.cola = nodo.anterior;                        // ...la nueva cola es el anterior
    }
    this.cantidad--;                                    // hay un elemento menos
    return nodo.dato;                                   // devuelve el dato eliminado
  }                                                     // fin de eliminarEnPosicion

  /**
   * Elimina el último elemento (quitar la carta de arriba de la columna).
   * @returns {*|null} El dato eliminado, o null si la lista está vacía.
   */
  eliminarFinal() {                                     // no recibe nada
    if (this.estaVacia()) {                             // si está vacía...
      return null;                                      // ...no hay nada que quitar
    }
    return this.eliminarEnPosicion(this.cantidad - 1);  // elimina la última posición
  }                                                     // fin de eliminarFinal

  /**
   * Busca un elemento y devuelve su posición.
   * @param {*} datoBuscado - Elemento que se busca.
   * @returns {number} Posición del elemento, o -1 si no existe.
   */
  buscar(datoBuscado) {                                 // recibe el dato que se busca
    let nodoActual = this.cabeza;                       // empieza en la cabeza
    let posicion = 0;                                   // posición actual
    while (nodoActual !== null) {                       // mientras haya nodos...
      if (nodoActual.dato === datoBuscado) {            // si lo encontró...
        return posicion;                                // ...devuelve la posición
      }
      nodoActual = nodoActual.siguiente;                // avanza
      posicion++;
    }
    return -1;                                          // no estaba
  }                                                     // fin de buscar

  /**
   * Elimina la primera aparición de un elemento.
   * @param {*} datoBuscado - Elemento a eliminar.
   * @returns {boolean} true si se eliminó; false si no existía.
   */
  eliminar(datoBuscado) {                               // recibe el dato
    const posicion = this.buscar(datoBuscado);          // lo busca
    if (posicion === -1) {                              // si no existe...
      return false;
    }
    this.eliminarEnPosicion(posicion);                  // lo elimina
    return true;
  }                                                     // fin de eliminar

  /**
   * Recorre la lista de la cabeza a la cola (hacia adelante).
   * @param {function} visitar - Función que recibe (dato, posicion).
   * @returns {void} No devuelve nada.
   */
  recorrerAdelante(visitar) {                           // recibe una función
    let nodoActual = this.cabeza;                       // empieza en la cabeza
    let posicion = 0;
    while (nodoActual !== null) {                       // mientras haya nodos...
      visitar(nodoActual.dato, posicion);               // aplica la función
      nodoActual = nodoActual.siguiente;                // avanza hacia adelante
      posicion++;
    }
  }                                                     // fin de recorrerAdelante

  /**
   * Recorre la lista de la cola a la cabeza (hacia atrás), usando "anterior".
   * @param {function} visitar - Función que recibe (dato, posicion).
   * @returns {void} No devuelve nada.
   */
  recorrerAtras(visitar) {                              // recibe una función
    let nodoActual = this.cola;                         // empieza en la cola
    let posicion = this.cantidad - 1;                   // la última posición
    while (nodoActual !== null) {                       // mientras haya nodos...
      visitar(nodoActual.dato, posicion);               // aplica la función
      nodoActual = nodoActual.anterior;                 // retrocede
      posicion--;
    }
  }                                                     // fin de recorrerAtras

  /**
   * Corta la lista desde una posición hasta el final y devuelve ese pedazo
   * como una lista nueva. En el juego: "levantar" un grupo de cartas.
   * @param {number} posicion - Posición del primer nodo del pedazo.
   * @returns {ListaDoble|null} Lista con los nodos cortados, o null si la posición no es válida.
   */
  cortarDesde(posicion) {                               // recibe desde dónde cortar
    const nodoCorte = this.obtenerNodo(posicion);       // nodo donde empieza el corte
    if (nodoCorte === null) {                           // si la posición no es válida...
      return null;
    }
    const pedazo = new ListaDoble();                    // lista nueva para el pedazo
    pedazo.cabeza = nodoCorte;                          // empieza en el nodo de corte
    pedazo.cola = this.cola;                            // termina donde terminaba esta lista
    pedazo.cantidad = this.cantidad - posicion;         // cuántos nodos se llevó
    if (nodoCorte.anterior !== null) {                  // si quedan nodos antes del corte...
      this.cola = nodoCorte.anterior;                   // ...el de antes pasa a ser la cola
      this.cola.siguiente = null;                       // ...y ya no apunta al pedazo
    } else {                                            // si se cortó desde la cabeza...
      this.cabeza = null;                               // ...esta lista queda vacía
      this.cola = null;
    }
    nodoCorte.anterior = null;                          // el pedazo ya no apunta hacia atrás
    this.cantidad = posicion;                           // quedan exactamente "posicion" nodos
    return pedazo;                                      // devuelve el pedazo cortado
  }                                                     // fin de cortarDesde

  /**
   * Pega otra lista al final de esta. La otra queda vacía.
   * En el juego: "soltar" un grupo de cartas sobre otra columna. Es O(1).
   * @param {ListaDoble} otraLista - Lista cuyos nodos se agregan al final.
   * @returns {void} No devuelve nada.
   */
  concatenar(otraLista) {                               // recibe la lista a pegar
    if (otraLista === null || otraLista.estaVacia()) {  // si no hay nada que pegar...
      return;                                           // ...no hace nada
    }
    if (this.estaVacia()) {                             // si esta lista está vacía...
      this.cabeza = otraLista.cabeza;                   // ...la otra se vuelve toda la lista
    } else {                                            // si ya tiene nodos...
      this.cola.siguiente = otraLista.cabeza;           // ...mi último apunta al primero de la otra
      otraLista.cabeza.anterior = this.cola;            // ...el primero de la otra apunta a mi último
    }
    this.cola = otraLista.cola;                         // la cola ahora es la de la otra lista
    this.cantidad = this.cantidad + otraLista.cantidad; // sumo los elementos
    otraLista.cabeza = null;                            // la otra lista queda vacía
    otraLista.cola = null;
    otraLista.cantidad = 0;
  }                                                     // fin de concatenar
}                                                       // fin de la clase ListaDoble