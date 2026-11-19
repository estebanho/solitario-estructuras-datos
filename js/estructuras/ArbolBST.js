/**
 * ArbolBST.js
 * Árbol Binario de Búsqueda hecho desde cero.
 * Regla: en cada nodo, las claves MENORES van a la izquierda y las
 * MAYORES o IGUALES a la derecha. Por eso el inorden sale ordenado.
 * Recorrido	Orden de visita	Resultado en el ejemplo	Uso en el juego
 * Inorden	izquierdo → raíz → derecho	20 30 40 50 60 70 80	Sale ordenado de menor a mayor
 * Preorden	raíz → izquierdo → derecho	50 30 20 40 70 60 80	Para guardar el árbol
 * Posorden	izquierdo → derecho → raíz	20 40 30 60 80 70 50	Se muestra en la ventana de puntajes
 *
 * Uso en el juego: tabla de MEJORES PUNTAJES (la clave es el puntaje).
 *
 * Complejidad (h = altura del árbol; promedio h = log n, peor caso h = n):
 *   insertar O(h) | buscar O(h) | eliminar O(h)
 *   inorden O(n) | preorden O(n) | posorden O(n) | tamano O(1)
 */
class ArbolBST {                                           // molde para crear árboles
  /**
   * Crea un árbol vacío.
   * @param {function} obtenerClave - Función que saca el número con el que se compara
   *        cada dato. Si no se da, el dato mismo es la clave.
   * @returns {ArbolBST} Árbol sin nodos.
   */
  constructor(obtenerClave = (dato) => dato) {             // por defecto la clave es el mismo dato
    this.raiz = null;                                      // flecha al nodo de arriba del todo
    this.cantidad = 0;                                     // cuántos nodos hay
    this.obtenerClave = obtenerClave;                      // guarda la función para sacar la clave
  }                                                        // fin del constructor

  /**
   * Indica si el árbol no tiene nodos.
   * @returns {boolean} true si está vacío.
   */
  estaVacio() {                                            // no recibe nada
    return this.raiz === null;                             // vacío si no hay raíz
  }                                                        // fin de estaVacio

  /**
   * Indica cuántos nodos tiene el árbol.
   * @returns {number} Cantidad de nodos.
   */
  tamano() {                                               // no recibe nada
    return this.cantidad;                                  // devuelve el contador
  }                                                        // fin de tamano

  /**
   * Inserta un dato respetando la regla del árbol.
   * @param {*} dato - Dato a insertar.
   * @returns {void} No devuelve nada.
   */
  insertar(dato) {                                         // recibe el dato
    const nuevoNodo = new NodoArbol(dato);                 // crea la cajita del árbol
    this.cantidad++;                                       // hay un nodo más
    if (this.raiz === null) {                              // si el árbol está vacío...
      this.raiz = nuevoNodo;                               // ...el nuevo es la raíz
      return;                                              // ...y termina
    }
    const claveNueva = this.obtenerClave(dato);            // número con el que se va a comparar
    let nodoActual = this.raiz;                            // empieza a bajar desde la raíz
    while (true) {                                         // baja hasta encontrar un hueco libre
      const claveActual = this.obtenerClave(nodoActual.dato); // clave del nodo donde estamos
      if (claveNueva < claveActual) {                      // si es MENOR, va a la izquierda
        if (nodoActual.izquierdo === null) {               // si a la izquierda hay hueco...
          nodoActual.izquierdo = nuevoNodo;                // ...se pone ahí
          return;                                          // ...y termina
        }
        nodoActual = nodoActual.izquierdo;                 // si no, sigue bajando por la izquierda
      } else {                                             // si es MAYOR o IGUAL, va a la derecha
        if (nodoActual.derecho === null) {                 // si a la derecha hay hueco...
          nodoActual.derecho = nuevoNodo;                  // ...se pone ahí
          return;                                          // ...y termina
        }
        nodoActual = nodoActual.derecho;                   // si no, sigue bajando por la derecha
      }
    }                                                      // fin del while
  }                                                        // fin de insertar

  /**
   * Busca un dato por su clave.
   * @param {number} claveBuscada - Clave que se busca (en el juego, un puntaje).
   * @returns {*|null} El dato encontrado, o null si no existe.
   */
  buscar(claveBuscada) {                                   // recibe la clave a buscar
    let nodoActual = this.raiz;                            // empieza en la raíz
    while (nodoActual !== null) {                          // mientras haya nodos...
      const claveActual = this.obtenerClave(nodoActual.dato); // clave del nodo actual
      if (claveBuscada === claveActual) {                  // si coincide...
        return nodoActual.dato;                            // ...lo encontró
      }
      if (claveBuscada < claveActual) {                    // si es menor...
        nodoActual = nodoActual.izquierdo;                 // ...busca a la izquierda
      } else {                                             // si es mayor...
        nodoActual = nodoActual.derecho;                   // ...busca a la derecha
      }
    }
    return null;                                           // llegó al fondo sin encontrarlo
  }                                                        // fin de buscar

  /**
   * Elimina el nodo que tiene una clave.
   * @param {number} claveBuscada - Clave del nodo a eliminar.
   * @returns {boolean} true si se eliminó; false si no existía.
   */
  eliminar(claveBuscada) {                                 // recibe la clave a borrar
    const cantidadAntes = this.cantidad;                   // para saber si de verdad se borró
    this.raiz = this.eliminarDesde(this.raiz, claveBuscada); // borra empezando por la raíz
    return this.cantidad < cantidadAntes;                  // si bajó la cantidad, se eliminó
  }                                                        // fin de eliminar

  /**
   * Función auxiliar (recursiva) de eliminar. Busca la clave dentro de un
   * subárbol, la quita y devuelve cómo queda la raíz de ese subárbol.
   * Casos: 1) hoja, 2) un solo hijo, 3) dos hijos (se usa el sucesor).
   * @param {NodoArbol|null} nodo - Raíz del subárbol donde se busca.
   * @param {number} claveBuscada - Clave a eliminar.
   * @returns {NodoArbol|null} Nueva raíz del subárbol.
   */
  eliminarDesde(nodo, claveBuscada) {                      // recibe el subárbol y la clave
    if (nodo === null) {                                   // si llegó a un hueco...
      return null;                                         // ...la clave no estaba
    }
    const claveNodo = this.obtenerClave(nodo.dato);        // clave del nodo actual
    if (claveBuscada < claveNodo) {                        // si es menor, está a la izquierda
      nodo.izquierdo = this.eliminarDesde(nodo.izquierdo, claveBuscada);
      return nodo;
    }
    if (claveBuscada > claveNodo) {                        // si es mayor, está a la derecha
      nodo.derecho = this.eliminarDesde(nodo.derecho, claveBuscada);
      return nodo;
    }
    // Si llega aquí, ESTE es el nodo a eliminar.
    this.cantidad--;                                       // hay un nodo menos
    if (nodo.izquierdo === null) {                         // caso 1 y 2: no tiene hijo izquierdo...
      return nodo.derecho;                                 // ...sube el hijo derecho (o null si es hoja)
    }
    if (nodo.derecho === null) {                           // caso 2: no tiene hijo derecho...
      return nodo.izquierdo;                               // ...sube el hijo izquierdo
    }
    // Caso 3: tiene dos hijos. Se busca el SUCESOR: el menor del subárbol derecho.
    let sucesor = nodo.derecho;                            // una vez a la derecha...
    while (sucesor.izquierdo !== null) {                   // ...y luego todo a la izquierda
      sucesor = sucesor.izquierdo;
    }
    nodo.dato = sucesor.dato;                              // se copia el dato del sucesor en este nodo
    this.cantidad++;                                       // se compensa: la siguiente línea volverá a restar
    nodo.derecho = this.eliminarDesde(nodo.derecho, this.obtenerClave(sucesor.dato)); // se borra el sucesor
    return nodo;                                           // este nodo sigue en su lugar con el dato nuevo
  }                                                        // fin de eliminarDesde

  /**
   * Recorrido INORDEN: izquierdo, raíz, derecho (de menor a mayor).
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  inorden(visitar) {                                       // recibe una función
    this.inordenDesde(this.raiz, visitar);                 // empieza por la raíz
  }
  /**
   * Auxiliar recursivo del inorden.
   * @param {NodoArbol|null} nodo - Nodo actual.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  inordenDesde(nodo, visitar) {
    if (nodo === null) return;                             // caso base: no hay nodo, se devuelve
    this.inordenDesde(nodo.izquierdo, visitar);            // 1. todo el lado izquierdo
    visitar(nodo.dato);                                    // 2. el nodo actual
    this.inordenDesde(nodo.derecho, visitar);              // 3. todo el lado derecho
  }

  /**
   * Recorrido PREORDEN: raíz, izquierdo, derecho.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  preorden(visitar) {
    this.preordenDesde(this.raiz, visitar);
  }
  /**
   * Auxiliar recursivo del preorden.
   * @param {NodoArbol|null} nodo - Nodo actual.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  preordenDesde(nodo, visitar) {
    if (nodo === null) return;                             // caso base
    visitar(nodo.dato);                                    // 1. el nodo actual
    this.preordenDesde(nodo.izquierdo, visitar);           // 2. lado izquierdo
    this.preordenDesde(nodo.derecho, visitar);             // 3. lado derecho
  }

  /**
   * Recorrido POSORDEN: izquierdo, derecho, raíz.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  posorden(visitar) {
    this.posordenDesde(this.raiz, visitar);
  }
  /**
   * Auxiliar recursivo del posorden.
   * @param {NodoArbol|null} nodo - Nodo actual.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  posordenDesde(nodo, visitar) {
    if (nodo === null) return;                             // caso base
    this.posordenDesde(nodo.izquierdo, visitar);           // 1. lado izquierdo
    this.posordenDesde(nodo.derecho, visitar);             // 2. lado derecho
    visitar(nodo.dato);                                    // 3. el nodo actual
  }

  /**
   * Recorrido INORDEN INVERSO: derecho, raíz, izquierdo (de mayor a menor).
   * Se usa para mostrar el ranking de puntajes.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  inordenInverso(visitar) {
    this.inordenInversoDesde(this.raiz, visitar);
  }
  /**
   * Auxiliar recursivo del inorden inverso.
   * @param {NodoArbol|null} nodo - Nodo actual.
   * @param {function} visitar - Función que recibe cada dato.
   * @returns {void} No devuelve nada.
   */
  inordenInversoDesde(nodo, visitar) {
    if (nodo === null) return;                             // caso base
    this.inordenInversoDesde(nodo.derecho, visitar);       // 1. lado derecho (los mayores)
    visitar(nodo.dato);                                    // 2. el nodo actual
    this.inordenInversoDesde(nodo.izquierdo, visitar);     // 3. lado izquierdo (los menores)
  }
}                                                          // fin de la clase ArbolBST