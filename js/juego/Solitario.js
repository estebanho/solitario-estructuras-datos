/**
 * Solitario.js
 * Reglas y lógica del Solitario Klondike (sin nada de pantalla).
 * Aquí se usan las estructuras de datos:
 *   - ListaDoble    → las 7 columnas del tablero.
 *   - Pila          → las 4 fundaciones (una por palo, del As al Rey).
 *   - ListaCircular → el mazo de robo, que se recorre una y otra vez.
 *   - Cola          → el reparto de las cartas barajadas.
 */

const MAX_PASADAS = 3;   // cuántas veces se puede recorrer el mazo de robo en una partida

class Solitario {                                           // molde del juego
  /**
   * Crea un juego nuevo y reparte las cartas.
   * @returns {Solitario} El juego listo para jugar.
   */
  constructor() {                                           // se ejecuta al hacer: new Solitario()
    this.nuevaPartida();                                    // prepara todo para empezar
  }                                                         // fin del constructor

  /**
   * Reinicia todas las estructuras y reparte las 52 cartas.
   * @returns {void} No devuelve nada.
   */
  nuevaPartida() {                                          // no recibe nada
    // --- 7 COLUMNAS: cada una es una LISTA DOBLE ---
    // (el vector de 7 solo agrupa las columnas; las cartas van dentro de las listas dobles)
    this.columnas = [];                                     // vector fijo para las 7 columnas
    for (let i = 0; i < 7; i++) {                           // se repite 7 veces
      this.columnas.push(new ListaDoble());                 // agrega una columna vacía
    }

    // --- 4 FUNDACIONES: cada una es una PILA (posición = número del palo) ---
    this.fundaciones = [new Pila(), new Pila(), new Pila(), new Pila()];

    // --- MAZO DE ROBO: una LISTA CIRCULAR ---
    this.mazo = new ListaCircular();                        // el mazo empieza vacío
    this.actual = null;                                     // nodo de la carta visible del descarte (null = ninguna)
    this.posicionActual = -1;                               // posición de esa carta en el mazo (-1 = ninguna)
    this.pasadas = 0;                                       // cuántas veces se ha reiniciado el mazo

    // --- Datos de la partida ---
    this.puntaje = 0;                                       // puntos acumulados
    this.movimientos = 0;                                   // jugadas realizadas
    this.inicio = Date.now();                               // momento en que empezó (en milisegundos)
    this.estado = 'jugando';                                // 'jugando', 'ganado' o 'perdido'

    // 1) BARAJAR: se obtiene una COLA con las 52 cartas en orden aleatorio
    const colaReparto = this.barajar();

    // 2) REPARTIR en las columnas, fila por fila:
    //    la fila 0 pone una carta en las columnas 1 a 7, la fila 1 en las columnas 2 a 7, etc.
    //    Así la columna 1 tiene 1 carta, la 2 tiene 2 cartas... y la 7 tiene 7 cartas.
    for (let fila = 0; fila < 7; fila++) {                  // 7 filas
      for (let columna = fila; columna < 7; columna++) {    // desde la columna "fila" hasta la última
        const carta = colaReparto.desencolar();             // saca la siguiente carta de la COLA (FIFO)
        carta.bocaArriba = (columna === fila);              // solo la última de cada columna queda boca arriba
        this.columnas[columna].insertarFinal(carta);        // la pone encima de esa columna
      }
    }

    // 3) Las 24 cartas que sobran en la cola forman el MAZO DE ROBO
    while (!colaReparto.estaVacia()) {                      // mientras queden cartas en la cola...
      const carta = colaReparto.desencolar();               // ...saca la siguiente
      carta.bocaArriba = true;                              // se verán cuando pasen al descarte
      this.mazo.insertarFinal(carta);                       // la agrega al final del mazo circular
    }
  }                                                         // fin de nuevaPartida

  /**
   * Crea las 52 cartas en orden y las baraja. Las cartas se ponen en una
   * LISTA DOBLE y se van sacando de posiciones al azar; cada carta sacada se ENCOLA.
   * @returns {Cola} Una cola con las 52 cartas en orden aleatorio.
   */
  barajar() {                                               // no recibe nada
    const barajaOrdenada = new ListaDoble();                // aquí van las 52 cartas en orden
    for (let palo = 0; palo < 4; palo++) {                  // por cada palo (0 a 3)...
      for (let valor = 1; valor <= 13; valor++) {           // ...y cada valor (1 a 13)
        barajaOrdenada.insertarFinal(new Carta(palo, valor)); // crea la carta y la agrega
      }
    }
    const colaBarajada = new Cola();                        // aquí quedarán mezcladas
    while (!barajaOrdenada.estaVacia()) {                   // mientras queden cartas sin sacar...
      // número al azar entre 0 y (cantidad de cartas - 1)
      const posicionAzar = Math.floor(Math.random() * barajaOrdenada.tamano());
      const carta = barajaOrdenada.eliminarEnPosicion(posicionAzar); // saca la carta de esa posición
      colaBarajada.encolar(carta);                          // la mete al final de la cola
    }
    return colaBarajada;                                    // devuelve la cola con la baraja mezclada
  }                                                         // fin de barajar

  // ===================== REGLAS =====================

  /**
   * Indica si una carta puede ponerse en la fundación de su palo.
   * @param {Carta} carta - Carta que se quiere poner.
   * @returns {boolean} true si es el As (fundación vacía) o el valor siguiente al de arriba.
   */
  puedeIrAFundacion(carta) {                                // recibe la carta
    const cartaArriba = this.fundaciones[carta.palo].verTope(); // carta de arriba de la PILA de ese palo
    if (cartaArriba === null) {                             // si la fundación está vacía...
      return carta.valor === 1;                             // ...solo puede empezar con el As
    }
    return carta.valor === cartaArriba.valor + 1;           // si no, debe ser exactamente el siguiente valor
  }                                                         // fin de puedeIrAFundacion

  /**
   * Indica si una carta (o el grupo que empieza en ella) puede ponerse en una columna.
   * @param {Carta} carta - Carta que quedaría encima.
   * @param {number} numeroColumna - Columna destino (0 a 6).
   * @returns {boolean} true si se cumple la regla de las columnas.
   */
  puedeIrAColumna(carta, numeroColumna) {                   // recibe la carta y la columna
    const cartaArriba = this.columnas[numeroColumna].ultimoDato(); // carta de arriba de la LISTA DOBLE
    if (cartaArriba === null) {                             // si la columna está vacía...
      return carta.valor === 13;                            // ...solo puede ir un Rey (K)
    }
    return cartaArriba.bocaArriba                           // la de abajo debe estar boca arriba,
      && cartaArriba.esRoja() !== carta.esRoja()            // los colores deben ser distintos
      && cartaArriba.valor === carta.valor + 1;             // y la nueva debe valer uno menos
  }                                                         // fin de puedeIrAColumna

  /**
   * Revisa si una carta puede ir a un destino y, si no puede, explica por qué.
   * @param {Carta} carta - Carta que se quiere mover.
   * @param {object} destino - {tipo: 'fundacion' o 'columna', numero: posición del destino}.
   * @returns {string} Texto vacío si la jugada es válida; si no, el motivo para mostrar.
   */
  motivoInvalido(carta, destino) {                          // recibe la carta y el destino
    if (destino.tipo === 'fundacion') {                     // si el destino es una fundación...
      if (destino.numero !== carta.palo) {                  // ...y no es la de su palo
        return 'Cada fundación es de un solo palo: ' + carta.simbolo() + ' va en la de ' + NOMBRES_PALOS[carta.palo] + '.';
      }
      if (!this.puedeIrAFundacion(carta)) {                 // ...y no sigue el orden
        return 'Las fundaciones se arman por palo, desde el As (A) hasta el Rey (K).';
      }
      return '';                                            // jugada válida
    }
    if (destino.tipo === 'columna') {                       // si el destino es una columna...
      if (this.puedeIrAColumna(carta, destino.numero)) {    // ...y se cumple la regla
        return '';                                          // jugada válida
      }
      if (this.columnas[destino.numero].estaVacia()) {      // ...si está vacía y no es un Rey
        return 'Solo un Rey (K) puede ir en una columna vacía.';
      }
      return 'En las columnas se baja en orden y alternando colores (rojo sobre negro o negro sobre rojo).';
    }
    return 'Destino no válido.';                            // cualquier otro caso
  }                                                         // fin de motivoInvalido

  // ⬇⬇⬇ AQUÍ PEGAREMOS EL PEDAZO 8.2 (las jugadas) ⬇⬇⬇

    // ===================== GANAR Y PERDER =====================

  /**
   * Cuenta cuántas cartas hay en las 4 fundaciones.
   * @returns {number} Número entre 0 y 52.
   */
  cartasEnFundaciones() {                                   // no recibe nada
    let total = 0;                                          // empieza en cero
    for (let i = 0; i < 4; i++) {                           // por cada una de las 4 PILAS...
      total = total + this.fundaciones[i].tamano();         // ...suma cuántas cartas tiene
    }
    return total;                                           // devuelve la suma
  }                                                         // fin de cartasEnFundaciones

  /**
   * Indica si ya no se puede robar más del mazo
   * (está vacío, o ya se usaron todas las pasadas y se llegó a la última carta).
   * @returns {boolean} true si el mazo está agotado.
   */
  mazoAgotado() {                                           // no recibe nada
    if (this.mazo.estaVacia()) {                            // si no quedan cartas en el mazo...
      return true;                                          // ...está agotado
    }
    const enLaUltimaCarta = this.actual === this.mazo.ultimo;      // ¿la carta visible es la última del mazo?
    const sinPasadas = this.pasadas >= MAX_PASADAS - 1;            // ¿ya no se puede reiniciar?
    return enLaUltimaCarta && sinPasadas;                   // agotado si pasan las dos cosas
  }                                                         // fin de mazoAgotado

  /**
   * Indica si una carta tiene a dónde ir (a su fundación o a alguna columna).
   * @param {Carta} carta - Carta a revisar.
   * @returns {boolean} true si la carta se puede jugar en algún lado.
   */
  cartaTieneLugar(carta) {                                  // recibe la carta
    if (this.puedeIrAFundacion(carta)) {                    // si puede ir a la fundación...
      return true;                                          // ...tiene lugar
    }
    for (let i = 0; i < 7; i++) {                           // revisa las 7 columnas
      if (this.puedeIrAColumna(carta, i)) {                 // si cabe en alguna...
        return true;                                        // ...tiene lugar
      }
    }
    return false;                                           // no cabe en ningún lado
  }                                                         // fin de cartaTieneLugar

  /**
   * Revisa si queda al menos una jugada ÚTIL. Una jugada es útil si ayuda a avanzar:
   * llevar una carta a la fundación, destapar una carta oculta, vaciar una columna,
   * o usar una carta del mazo que todavía se pueda sacar.
   * (Pasar cartas de un lado a otro sin ganar nada no cuenta.)
   * @returns {boolean} true si todavía se puede avanzar; false si el jugador quedó bloqueado.
   */
  hayJugadasUtiles() {                                      // no recibe nada
    // ---- 1) Revisar las cartas boca arriba de cada COLUMNA (lista doble) ----
    for (let i = 0; i < 7; i++) {                           // por cada columna...
      const columna = this.columnas[i];                     // la lista doble de esa columna
      const ultimaPosicion = columna.tamano() - 1;          // posición de la carta de arriba

      // Busca la posición de la primera carta boca arriba
      let primeraVisible = -1;                              // -1 = todavía no se encontró
      columna.recorrerAdelante((carta, posicion) => {       // recorre de abajo hacia arriba
        if (primeraVisible === -1 && carta.bocaArriba) {    // la primera que esté boca arriba...
          primeraVisible = posicion;                        // ...guarda su posición
        }
      });
      if (primeraVisible === -1) {                          // si la columna está vacía...
        continue;                                           // ...pasa a la siguiente columna
      }

      let encontrada = false;                               // ¿ya se encontró una jugada útil?
      columna.recorrerAdelante((carta, posicion) => {       // revisa cada carta de la columna
        if (encontrada || posicion < primeraVisible) {      // si ya se encontró, o la carta está oculta...
          return;                                           // ...no hace nada con esta carta
        }
        // a) La carta de arriba puede subir a su fundación
        if (posicion === ultimaPosicion && this.puedeIrAFundacion(carta)) {
          encontrada = true;
          return;
        }
        // b) ¿Mover esta carta (y las de encima) sirve para algo?
        let sirveMoverla;
        if (posicion === primeraVisible) {                  // si es la primera carta visible...
          // sirve si destapa una carta oculta (hay cartas debajo)
          // o si vacía la columna (excepto un Rey en el fondo, que ya está bien ahí)
          sirveMoverla = posicion > 0 || carta.valor !== 13;
        } else {                                            // si es una carta del medio...
          // sirve si deja libre la carta de abajo para subirla a la fundación
          sirveMoverla = this.puedeIrAFundacion(columna.obtener(posicion - 1));
        }
        if (sirveMoverla) {                                 // si moverla sirve...
          for (let j = 0; j < 7; j++) {                     // ...busca otra columna donde quepa
            if (j !== i && this.puedeIrAColumna(carta, j)) {
              encontrada = true;
              return;
            }
          }
        }
      });
      if (encontrada) {                                     // si en esta columna hubo una jugada útil...
        return true;                                        // ...todavía se puede avanzar
      }
    }

    // ---- 2) Revisar las cartas del MAZO (lista circular) ----
    if (this.mazo.estaVacia()) {                            // si no quedan cartas en el mazo...
      return false;                                         // ...no hay más jugadas
    }
    if (this.actual === null || this.pasadas < MAX_PASADAS - 1) {
      // Todavía se puede dar la vuelta al mazo: CUALQUIER carta del mazo puede salir.
      let algunaSirve = false;                              // ¿alguna carta del mazo tiene lugar?
      this.mazo.recorrer((carta) => {                       // recorre todo el mazo
        if (this.cartaTieneLugar(carta)) {                  // si la carta cabe en algún lado...
          algunaSirve = true;                               // ...hay jugada
        }
      });
      return algunaSirve;
    }
    // Última pasada: solo sirven la carta visible y las que faltan por salir.
    let nodo = this.actual;                                 // empieza en la carta visible
    while (true) {                                          // avanza hasta el final del mazo
      if (this.cartaTieneLugar(nodo.dato)) {                // si esta carta cabe en algún lado...
        return true;                                        // ...hay jugada
      }
      if (nodo === this.mazo.ultimo) {                      // si ya llegó a la última carta...
        return false;                                       // ...no queda ninguna jugada
      }
      nodo = nodo.siguiente;                                // pasa a la siguiente carta del mazo
    }
  }                                                         // fin de hayJugadasUtiles

  /**
   * Revisa si la partida terminó. Se llama después de cada jugada.
   * @returns {void} No devuelve nada (cambia "estado" si se ganó o se perdió).
   */
  revisarFin() {                                            // no recibe nada
    if (this.cartasEnFundaciones() === 52) {                // CONDICIÓN DE GANAR: las 52 cartas arriba
      this.estado = 'ganado';                               // cambia el estado
      this.fin = Date.now();                                // guarda el momento en que terminó
      this.bonificacion = Math.max(0, 1000 - 2 * this.tiempoSegundos()); // premio: más rápido = más puntos
      this.puntaje = this.puntaje + this.bonificacion;      // suma el premio al puntaje
    } else if (!this.hayJugadasUtiles()) {                  // CONDICIÓN DE PERDER: no queda jugada útil
      this.estado = 'perdido';                              // cambia el estado
      this.motivoFin = 'sinJugadas';                        // guarda por qué perdió
      this.fin = Date.now();                                // guarda el momento en que terminó
    }
  }                                                         // fin de revisarFin

  /**
   * El jugador se rinde: la partida se pierde.
   * @returns {void} No devuelve nada.
   */
  rendirse() {                                              // no recibe nada
    if (this.estado !== 'jugando') {                        // si la partida ya había terminado...
      return;                                               // ...no hace nada
    }
    this.estado = 'perdido';                                // pierde
    this.motivoFin = 'rendicion';                           // porque se rindió
    this.fin = Date.now();                                  // momento en que terminó
  }                                                         // fin de rendirse

  // ===================== AUXILIARES =====================

  /**
   * Suma (o resta, si es negativo) puntos, sin dejar el puntaje por debajo de 0.
   * @param {number} puntos - Puntos a sumar.
   * @returns {void} No devuelve nada.
   */
  sumar(puntos) {                                           // recibe los puntos
    this.puntaje = Math.max(0, this.puntaje + puntos);      // Math.max elige el mayor: nunca baja de 0
  }                                                         // fin de sumar

  /**
   * Calcula cuántos segundos lleva (o duró) la partida.
   * @returns {number} Tiempo en segundos.
   */
  tiempoSegundos() {                                        // no recibe nada
    const finDelConteo = this.fin || Date.now();            // si ya terminó usa "fin"; si no, la hora actual
    return Math.floor((finDelConteo - this.inicio) / 1000); // milisegundos ÷ 1000 = segundos
  }                                                         // fin de tiempoSegundos

  // ⬇⬇⬇ AQUÍ PEGAREMOS EL PEDAZO 8.3 (las jugadas) ⬇⬇⬇

    // ===================== JUGADAS =====================

  /**
   * Clic en el mazo: avanza el cursor de la LISTA CIRCULAR a la siguiente carta.
   * Al pasar la última carta, el mazo vuelve a empezar (si quedan pasadas).
   * @returns {object} {ok: true/false, mensaje: texto para el jugador}.
   */
  robar() {                                                 // no recibe nada
    if (this.estado !== 'jugando') {                        // si la partida ya terminó...
      return { ok: false, mensaje: 'La partida terminó.' }; // ...no se puede jugar
    }
    if (this.mazo.estaVacia()) {                            // si no quedan cartas en el mazo...
      return { ok: false, mensaje: 'El mazo está vacío.' };
    }

    if (this.actual === null) {                             // CASO 1: no hay carta visible
      this.actual = this.mazo.ultimo.siguiente;             // gracias al enlace circular, después del último viene la primera
      this.posicionActual = 0;                              // es la posición 0
    } else if (this.actual === this.mazo.ultimo) {          // CASO 2: estaba en la última carta
      if (this.pasadas >= MAX_PASADAS - 1) {                // si ya no quedan pasadas...
        return { ok: false, mensaje: 'Ya usaste las ' + MAX_PASADAS + ' pasadas por el mazo.' };
      }
      this.actual = null;                                   // el mazo vuelve a empezar (no se ve ninguna carta)
      this.posicionActual = -1;
      this.pasadas++;                                       // se gastó una pasada
      this.sumar(-20);                                      // reiniciar el mazo resta 20 puntos
    } else {                                                // CASO 3: caso normal
      this.actual = this.actual.siguiente;                  // avanza al siguiente nodo del mazo
      this.posicionActual++;                                // y a la siguiente posición
    }
    return this.terminarJugada();                           // cuenta el movimiento y revisa si terminó
  }                                                         // fin de robar

  /**
   * Mueve una carta (o un grupo) desde un origen hasta un destino.
   * Revisa de dónde sale la carta y llama a la función que corresponde.
   * @param {object} origen - {tipo:'mazo'} o {tipo:'columna', numero, posicion}.
   * @param {object} destino - {tipo:'fundacion' o 'columna', numero}.
   * @returns {object} {ok: true/false, mensaje: texto para el jugador}.
   */
  mover(origen, destino) {                                  // recibe origen y destino
    if (this.estado !== 'jugando') {                        // si la partida ya terminó...
      return { ok: false, mensaje: 'La partida terminó.' };
    }
    if (!origen || !destino) {                              // si falta alguno de los dos...
      return { ok: false, mensaje: 'Jugada incompleta.' };  // ...no se rompe, solo avisa
    }
    if (origen.tipo === 'mazo') {                           // si la carta sale del descarte...
      return this.moverDesdeMazo(destino);
    }
    if (origen.tipo === 'columna') {                        // si sale de una columna...
      return this.moverDesdeColumna(origen.numero, origen.posicion, destino);
    }
    return { ok: false, mensaje: 'Origen no válido.' };     // cualquier otro caso
  }                                                         // fin de mover

  /**
   * Mueve la carta visible del descarte a una fundación o a una columna.
   * La carta se quita de la LISTA CIRCULAR y el cursor retrocede una posición.
   * @param {object} destino - {tipo:'fundacion' o 'columna', numero}.
   * @returns {object} {ok: true/false, mensaje: texto para el jugador}.
   */
  moverDesdeMazo(destino) {                                 // recibe el destino
    if (this.actual === null) {                             // si no hay carta visible...
      return { ok: false, mensaje: 'No hay carta en el descarte. Toca el mazo para robar.' };
    }
    const carta = this.actual.dato;                         // la carta visible
    const motivo = this.motivoInvalido(carta, destino);     // revisa las reglas
    if (motivo !== '') {                                    // si la jugada no es válida...
      return { ok: false, mensaje: motivo };                // ...explica por qué
    }

    this.mazo.eliminarEnPosicion(this.posicionActual);      // quita la carta de la LISTA CIRCULAR
    this.posicionActual--;                                  // el cursor retrocede una posición
    if (this.posicionActual >= 0) {                         // si quedó alguna carta antes...
      this.actual = this.mazo.obtenerNodo(this.posicionActual); // ...esa pasa a ser la visible
    } else {                                                // si no...
      this.actual = null;                                   // ...no queda carta visible
    }

    if (destino.tipo === 'fundacion') {                     // si va a una fundación...
      this.fundaciones[destino.numero].apilar(carta);       // ...se APILA (PILA)
      this.sumar(10);                                       // +10 puntos
    } else {                                                // si va a una columna...
      this.columnas[destino.numero].insertarFinal(carta);   // ...se pone encima (LISTA DOBLE)
      this.sumar(5);                                        // +5 puntos
    }
    return this.terminarJugada();                           // cuenta el movimiento y revisa si terminó
  }                                                         // fin de moverDesdeMazo

  /**
   * Mueve una carta, o un grupo de cartas, desde una columna.
   * Si arriba queda una carta boca abajo, se voltea.
   * @param {number} numeroColumna - Columna de origen (0 a 6).
   * @param {number} posicion - Posición de la primera carta del grupo en esa columna.
   * @param {object} destino - {tipo:'fundacion' o 'columna', numero}.
   * @returns {object} {ok: true/false, mensaje: texto para el jugador}.
   */
  moverDesdeColumna(numeroColumna, posicion, destino) {     // recibe columna, posición y destino
    const columna = this.columnas[numeroColumna];           // la LISTA DOBLE de esa columna
    if (!columna) {                                         // si el número de columna no existe...
      return { ok: false, mensaje: 'Columna no válida.' };
    }
    const carta = columna.obtener(posicion);                // primera carta del grupo
    if (carta === null) {                                   // si en esa posición no hay carta...
      return { ok: false, mensaje: 'No hay carta en esa posición.' };
    }
    if (!carta.bocaArriba) {                                // si está boca abajo...
      return { ok: false, mensaje: 'Esa carta está boca abajo.' };
    }
    if (destino.tipo === 'columna' && destino.numero === numeroColumna) { // si la suelta en la misma columna...
      return { ok: false, mensaje: '' };                    // ...no pasa nada (sin mensaje)
    }
    const cantidadCartas = columna.tamano() - posicion;     // cuántas cartas se mueven (ella y las de encima)
    if (destino.tipo === 'fundacion' && cantidadCartas > 1) { // a la fundación solo va de a una
      return { ok: false, mensaje: 'A una fundación solo se mueve una carta a la vez.' };
    }
    const motivo = this.motivoInvalido(carta, destino);     // revisa las reglas
    if (motivo !== '') {                                    // si no es válida...
      return { ok: false, mensaje: motivo };                // ...explica por qué
    }

    const grupo = columna.cortarDesde(posicion);            // LISTA DOBLE: corta el grupo de cartas
    if (destino.tipo === 'fundacion') {                     // si va a la fundación...
      this.fundaciones[destino.numero].apilar(grupo.cabeza.dato); // ...se APILA la única carta
      this.sumar(10);                                       // +10 puntos
    } else {                                                // si va a otra columna...
      this.columnas[destino.numero].concatenar(grupo);      // LISTA DOBLE: pega el grupo encima
    }

    const nuevaCartaArriba = columna.ultimoDato();          // la carta que quedó arriba en el origen
    if (nuevaCartaArriba !== null && !nuevaCartaArriba.bocaArriba) { // si existe y está boca abajo...
      nuevaCartaArriba.bocaArriba = true;                   // ...se voltea
      this.sumar(5);                                        // +5 puntos por destapar una carta
    }
    return this.terminarJugada();                           // cuenta el movimiento y revisa si terminó
  }                                                         // fin de moverDesdeColumna

  /**
   * Se llama al final de toda jugada válida: cuenta el movimiento
   * y revisa si con esa jugada se ganó o se perdió.
   * @returns {object} {ok: true, mensaje: ''}.
   */
  terminarJugada() {                                        // no recibe nada
    this.movimientos++;                                     // un movimiento más
    this.revisarFin();                                      // ¿ganó o perdió? (pedazo 8.2)
    return { ok: true, mensaje: '' };                       // la jugada fue válida
  }                                                         // fin de terminarJugada


}                                                           // fin de la clase Solitario