/**
 * Interfaz.js
 * Dibuja el juego en pantalla y recibe los clics del jugador.
 * NO tiene reglas: todo se lo pregunta a Solitario y a GestorPuntajes.
 * Para dibujar, recorre las estructuras de datos con sus propios métodos.
 */

// Integrantes del grupo (cambiar por los nombres reales)
const INTEGRANTES = 'Esteban Hernández · Yoskar Lopez ';

/**
 * Atajo para buscar un elemento de la página por su selector.
 * @param {string} selector - Por ejemplo '#mazo' (busca el elemento con id="mazo").
 * @returns {HTMLElement} El elemento encontrado.
 */
function $(selector) {
  return document.querySelector(selector);                  // busca el primer elemento que coincida
}

/**
 * Convierte segundos al formato minutos:segundos.
 * @param {number} segundos - Tiempo en segundos.
 * @returns {string} Por ejemplo 185 → "3:05".
 */
function formatoTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);                // minutos completos
  const resto = segundos % 60;                              // segundos que sobran
  return minutos + ':' + String(resto).padStart(2, '0');    // padStart pone un 0 adelante si hace falta (5 → "05")
}

/**
 * Convierte un texto en HTML seguro, para que un nombre como "<b>"
 * se muestre como texto y no se interprete como código.
 * @param {string} texto - Texto a proteger.
 * @returns {string} Texto seguro.
 */
function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')                                 // & se escribe &amp;
    .replace(/</g, '&lt;')                                  // < se escribe &lt;
    .replace(/>/g, '&gt;');                                 // > se escribe &gt;
}

class Interfaz {                                            // molde de la interfaz
  /**
   * Prepara la interfaz y conecta los botones.
   * @param {GestorPuntajes} gestorPuntajes - El gestor de la tabla de puntajes (árbol BST).
   * @returns {Interfaz} La interfaz lista.
   */
  constructor(gestorPuntajes) {                             // recibe el gestor de puntajes
    this.puntajes = gestorPuntajes;                         // guarda el gestor
    this.juego = null;                                      // todavía no hay partida (se crea con "Nueva partida")
    this.seleccion = null;                                  // carta elegida por el jugador (null = ninguna)
    this.temporizador = null;                               // reloj que actualiza el tiempo cada segundo
    $('#integrantes').textContent = 'Integrantes: ' + INTEGRANTES; // escribe los integrantes en el menú
    this.conectarBotones();                                 // hace que los botones respondan
  }                                                         // fin del constructor

  /**
   * Ejecuta una acción protegida: si algo falla, muestra un aviso
   * en vez de que el juego se cierre.
   * @param {function} accion - Lo que se quiere ejecutar.
   * @returns {void} No devuelve nada.
   */
  seguro(accion) {                                          // recibe una función
    try {                                                   // intenta ejecutarla...
      accion();
    } catch (error) {                                       // ...si falla:
      console.error(error);                                 // escribe el error en la consola (para nosotros)
      this.aviso('Ocurrió un error, pero el juego sigue funcionando.'); // y avisa al jugador sin cerrarse
    }
  }                                                         // fin de seguro

  /**
   * Conecta cada botón con la función que debe ejecutar al hacer clic.
   * (Reglas, puntajes, rendirse y los clics del tablero se programan en los pedazos 11.3 y 11.4.)
   * @returns {void} No devuelve nada.
   */
  conectarBotones() {                                       // no recibe nada
    $('#btn-nueva').onclick = () => this.seguro(() => this.nuevaPartida());           // Nueva partida
    $('#btn-continuar').onclick = () => this.seguro(() => this.mostrarPantalla('juego')); // Continuar
    $('#btn-menu').onclick = () => this.seguro(() => this.mostrarPantalla('menu'));   // volver al menú
    $('#btn-reglas').onclick = () => this.seguro(() => this.mostrarReglas());         // pedazo 11.4
    $('#btn-puntajes').onclick = () => this.seguro(() => this.mostrarPuntajes());     // pedazo 11.4
    $('#btn-rendirse').onclick = () => this.seguro(() => this.confirmarRendirse());   // pedazo 11.4
    $('#tablero').onclick = (evento) => this.seguro(() => this.alHacerClic(evento));  // pedazo 11.3
  }                                                         // fin de conectarBotones

  /**
   * Muestra una pantalla y oculta la otra.
   * @param {string} nombre - 'menu' o 'juego'.
   * @returns {void} No devuelve nada.
   */
  mostrarPantalla(nombre) {                                 // recibe qué pantalla mostrar
    $('#pantalla-menu').classList.toggle('activa', nombre === 'menu');   // activa el menú si nombre es 'menu'
    $('#pantalla-juego').classList.toggle('activa', nombre === 'juego'); // activa el juego si nombre es 'juego'
    const hayPartida = this.juego !== null && this.juego.estado === 'jugando'; // ¿hay una partida en curso?
    $('#btn-continuar').hidden = !hayPartida;               // "Continuar" solo se ve si hay partida
  }                                                         // fin de mostrarPantalla

  /**
   * Empieza una partida nueva: crea el juego, arranca el reloj y dibuja.
   * @returns {void} No devuelve nada.
   */
  nuevaPartida() {                                          // no recibe nada
    this.juego = new Solitario();                           // la LÓGICA crea, baraja y reparte todo
    this.seleccion = null;                                  // no hay carta elegida
    clearInterval(this.temporizador);                       // detiene el reloj anterior (si había)
    this.temporizador = setInterval(() => this.actualizarBarra(), 1000); // actualiza el tiempo cada 1000 ms
    this.mostrarPantalla('juego');                          // muestra el tablero
    this.dibujar();                                         // dibuja las cartas
  }                                                         // fin de nuevaPartida

  // ===================== DIBUJAR =====================

  /**
   * Crea el elemento visual de una carta.
   * @param {Carta} carta - La carta a dibujar.
   * @param {string} zona - Dónde está: 'columna', 'fundacion' o 'mazo'.
   * @param {number} numero - Número de la columna o fundación.
   * @param {number} posicion - Posición de la carta dentro de su columna.
   * @returns {HTMLElement} El elemento de la carta, listo para ponerlo en la página.
   */
  crearElementoCarta(carta, zona, numero, posicion) {       // recibe la carta y dónde está
    const elemento = document.createElement('div');         // crea un <div> nuevo
    elemento.className = 'carta';                           // le pone la clase "carta"
    if (carta.esRoja()) elemento.classList.add('roja');     // si es roja, agrega la clase "roja"
    if (!carta.bocaArriba) elemento.classList.add('oculta');// si está boca abajo, agrega "oculta"
    if (this.estaSeleccionada(zona, numero, posicion)) {    // si es la carta elegida (o está encima de ella)...
      elemento.classList.add('seleccionada');               // ...brillo naranja
    }
    elemento.innerHTML =                                    // contenido: esquina y centro
      '<span class="esquina">' + carta.nombre() + '</span>' +
      '<span class="centro">' + carta.simbolo() + '</span>';
    elemento.dataset.zona = zona;                           // guarda en el elemento dónde está la carta...
    elemento.dataset.numero = numero;                       // ...en qué columna o fundación...
    elemento.dataset.posicion = posicion;                   // ...y en qué posición (para saber qué se tocó)
    return elemento;                                        // devuelve el elemento creado
  }                                                         // fin de crearElementoCarta

  /**
   * Indica si una carta forma parte de la selección actual del jugador.
   * @param {string} zona - Zona de la carta.
   * @param {number} numero - Número de columna o fundación.
   * @param {number} posicion - Posición en la columna.
   * @returns {boolean} true si debe verse seleccionada.
   */
  estaSeleccionada(zona, numero, posicion) {                // recibe dónde está la carta
    const s = this.seleccion;                               // lo que el jugador eligió
    if (s === null) return false;                           // si no eligió nada, ninguna está seleccionada
    if (s.tipo === 'mazo') return zona === 'mazo';          // si eligió el descarte
    return zona === 'columna'                               // si eligió en una columna: la carta elegida
      && numero === s.numero                                // y las que están encima de ella
      && posicion >= s.posicion;                            // (posición mayor o igual) se ven seleccionadas
  }                                                         // fin de estaSeleccionada

  /**
   * Dibuja todo el tablero recorriendo las estructuras de datos.
   * @returns {void} No devuelve nada.
   */
  dibujar() {                                               // no recibe nada
    const juego = this.juego;                               // atajo para escribir menos

    // ---- 1) COLUMNAS: se recorre cada LISTA DOBLE de abajo hacia arriba ----
    for (let i = 0; i < 7; i++) {                           // por cada una de las 7 columnas...
      const divColumna = $('#columna-' + i);                // el hueco de esa columna en la página
      divColumna.innerHTML = '';                            // lo vacía para dibujarlo de nuevo
      divColumna.classList.toggle('vacia', juego.columnas[i].estaVacia()); // si no tiene cartas, muestra la "K"
      let ocultas = 0;                                      // cuántas cartas boca abajo van dibujadas
      let visibles = 0;                                     // cuántas boca arriba van dibujadas
      juego.columnas[i].recorrerAdelante((carta, posicion) => { // RECORRE la lista doble
        const elemento = this.crearElementoCarta(carta, 'columna', i, posicion); // crea la carta
        // cada carta baja según cuántas hay debajo (las ocultas bajan menos que las visibles)
        elemento.style.top = 'calc(' + ocultas + ' * var(--sep-oculta) + ' + visibles + ' * var(--sep-visible))';
        divColumna.appendChild(elemento);                   // la pone en la columna
        if (carta.bocaArriba) visibles++; else ocultas++;   // cuenta la carta que se acaba de poner
      });
    }

    // ---- 2) FUNDACIONES: se muestra el tope de cada PILA ----
    for (let f = 0; f < 4; f++) {                           // por cada fundación...
      const divFundacion = $('#fundacion-' + f);            // su hueco en la página
      const cartaArriba = juego.fundaciones[f].verTope();   // VER TOPE de la pila
      if (cartaArriba === null) {                           // si está vacía...
        divFundacion.textContent = PALOS[f];                // ...muestra el símbolo del palo
      } else {                                              // si tiene cartas...
        divFundacion.innerHTML = '';                        // ...vacía el hueco
        divFundacion.appendChild(this.crearElementoCarta(cartaArriba, 'fundacion', f, 0)); // y dibuja el tope
      }
    }

    // ---- 3) MAZO (lista circular): dorso si quedan cartas por robar ----
    const divMazo = $('#mazo');                             // hueco del mazo
    const quedanPorRobar = juego.mazo.tamano() - (juego.posicionActual + 1); // cartas después de la visible
    if (quedanPorRobar > 0) {                               // si quedan cartas por robar...
      divMazo.innerHTML = '<div class="carta oculta"></div>'; // ...dibuja una carta boca abajo
    } else if (juego.mazoAgotado()) {                       // si ya no se puede robar más...
      divMazo.textContent = '✕';                            // ...muestra una X
    } else {                                                // si se puede reiniciar el mazo...
      divMazo.textContent = '↻';                            // ...muestra la flecha de reiniciar
    }

    // ---- 4) DESCARTE: la carta visible del mazo ----
    const divDescarte = $('#descarte');                     // hueco del descarte
    divDescarte.innerHTML = '';                             // lo vacía
    if (juego.actual !== null) {                            // si hay carta visible...
      divDescarte.appendChild(this.crearElementoCarta(juego.actual.dato, 'mazo', 0, juego.posicionActual)); // ...la dibuja
    }

    this.actualizarBarra();                                 // actualiza puntaje, movimientos, tiempo y pasada
  }                                                         // fin de dibujar

  /**
   * Actualiza los datos de la barra de arriba.
   * @returns {void} No devuelve nada.
   */
  actualizarBarra() {                                       // no recibe nada
    if (this.juego === null) return;                        // si no hay partida, no hace nada
    $('#dato-puntaje').textContent = this.juego.puntaje;    // puntaje
    $('#dato-movimientos').textContent = this.juego.movimientos; // movimientos
    $('#dato-tiempo').textContent = formatoTiempo(this.juego.tiempoSegundos()); // tiempo en m:ss
    $('#dato-pasada').textContent = (this.juego.pasadas + 1) + '/' + MAX_PASADAS; // pasada actual de 3
  }                                                         // fin de actualizarBarra

  /**
   * Muestra un mensaje corto arriba de la pantalla durante unos segundos.
   * @param {string} texto - Mensaje a mostrar.
   * @returns {void} No devuelve nada.
   */
  aviso(texto) {                                            // recibe el mensaje
    const divAviso = $('#aviso');                           // el cuadro del aviso
    divAviso.textContent = texto;                           // escribe el mensaje
    divAviso.classList.add('visible');                      // lo hace bajar y verse
    clearTimeout(this.tiempoAviso);                         // cancela el ocultado anterior (si había)
    this.tiempoAviso = setTimeout(() => divAviso.classList.remove('visible'), 2500); // lo oculta en 2,5 s
  }                                                         // fin de aviso

  // ⬇⬇⬇ AQUÍ PEGAREMOS EL PEDAZO 11.3 (los clics) ⬇⬇⬇
    // ===================== CLICS DEL JUGADOR =====================

  /**
   * Se ejecuta con cada clic en el tablero. Decide si el jugador quiere
   * robar, elegir una carta o mover la carta elegida a un destino.
   * @param {MouseEvent} evento - Información del clic (sobre qué elemento fue).
   * @returns {void} No devuelve nada.
   */
  alHacerClic(evento) {                                     // recibe el clic
    if (this.juego === null || this.juego.estado !== 'jugando') { // si no hay partida en curso...
      return;                                               // ...no hace nada
    }
    // "closest" busca, desde lo que se tocó hacia afuera, el elemento que coincida
    const divMazo = evento.target.closest('#mazo');                 // ¿se tocó el mazo?
    const divFundacion = evento.target.closest('[id^="fundacion-"]'); // ¿una fundación? (id que empieza por "fundacion-")
    const divColumna = evento.target.closest('.columna');           // ¿una columna?
    const divCarta = evento.target.closest('.carta');               // ¿una carta?

    // ---- 1) Clic en el MAZO: robar ----
    if (divMazo !== null) {                                 // si se tocó el mazo...
      this.seleccion = null;                                // ...se quita cualquier selección
      this.procesarResultado(this.juego.robar());           // ...y se roba (LISTA CIRCULAR)
      return;                                               // termina aquí
    }

    // ---- 2) Si ya hay una carta elegida y se tocó un DESTINO: intentar mover ----
    if (this.seleccion !== null) {                          // si el jugador ya había elegido una carta...
      let destino = null;                                   // aquí quedará el destino (si lo hay)
      if (divFundacion !== null) {                          // si tocó una fundación...
        destino = { tipo: 'fundacion', numero: Number(divFundacion.dataset.numero) };
      } else if (divColumna !== null) {                     // si tocó una columna...
        const numeroColumna = Number(divColumna.dataset.numero);    // número de esa columna
        const esLaMisma = this.seleccion.tipo === 'columna' && this.seleccion.numero === numeroColumna;
        if (!esLaMisma) {                                   // si es una columna distinta a la de origen...
          destino = { tipo: 'columna', numero: numeroColumna };     // ...ese es el destino
        }
      }
      if (destino !== null) {                               // si se encontró un destino...
        const origen = this.seleccion;                      // ...el origen es la carta elegida
        this.seleccion = null;                              // se quita la selección
        this.procesarResultado(this.juego.mover(origen, destino)); // la LÓGICA decide si se puede
        return;                                             // termina aquí
      }
    }

    // ---- 3) Clic en una CARTA: elegirla ----
    if (divCarta !== null && divCarta.dataset.zona) {       // si se tocó una carta del tablero...
      const zona = divCarta.dataset.zona;                   // dónde está: 'columna', 'mazo' o 'fundacion'
      let nuevaSeleccion = null;                            // lo que se va a seleccionar
      if (zona === 'columna') {                             // si está en una columna...
        if (divCarta.classList.contains('oculta')) {        // ...y está boca abajo
          this.aviso('Esa carta está boca abajo.');         // avisa y no la elige
          return;
        }
        nuevaSeleccion = {                                  // elige la carta (y las de encima)
          tipo: 'columna',
          numero: Number(divCarta.dataset.numero),          // en qué columna
          posicion: Number(divCarta.dataset.posicion),      // desde qué posición
        };
      } else if (zona === 'mazo') {                         // si es la carta del descarte...
        nuevaSeleccion = { tipo: 'mazo' };                  // elige el descarte
      } else {                                              // si es una carta de una fundación...
        return;                                             // las fundaciones no se mueven: no hace nada
      }
      if (this.mismaSeleccion(this.seleccion, nuevaSeleccion)) { // si tocó otra vez la misma carta...
        this.seleccion = null;                              // ...la deselecciona
      } else {
        this.seleccion = nuevaSeleccion;                    // si no, queda seleccionada
      }
      this.dibujar();                                       // redibuja para mostrar el brillo naranja
      return;
    }

    // ---- 4) Clic en un espacio vacío: quitar la selección ----
    this.seleccion = null;
    this.dibujar();
  }                                                         // fin de alHacerClic

  /**
   * Compara dos selecciones para saber si son la misma carta.
   * @param {object|null} a - Primera selección.
   * @param {object|null} b - Segunda selección.
   * @returns {boolean} true si son iguales.
   */
  mismaSeleccion(a, b) {                                    // recibe las dos selecciones
    if (a === null || b === null) return false;             // si alguna no existe, no son iguales
    if (a.tipo !== b.tipo) return false;                    // si son de distinto tipo, tampoco
    if (a.tipo === 'mazo') return true;                     // dos selecciones del descarte son iguales
    return a.numero === b.numero && a.posicion === b.posicion; // misma columna y misma posición
  }                                                         // fin de mismaSeleccion

  /**
   * Después de cada jugada: muestra el motivo si no fue válida,
   * redibuja el tablero y revisa si la partida terminó.
   * @param {object} resultado - Lo que devolvió la lógica: {ok, mensaje}.
   * @returns {void} No devuelve nada.
   */
  procesarResultado(resultado) {                            // recibe el resultado
    if (!resultado.ok && resultado.mensaje !== '') {        // si la jugada no fue válida y hay explicación...
      this.aviso(resultado.mensaje);                        // ...la muestra arriba
    }
    this.dibujar();                                         // redibuja con el nuevo estado de las estructuras
    this.revisarFinDePartida();                             // ¿ganó o perdió?
  }                                                         // fin de procesarResultado

  /**
   * Si la partida terminó, detiene el reloj y muestra la ventana
   * de victoria o de derrota (esas ventanas se hacen en el pedazo 11.4).
   * @returns {void} No devuelve nada.
   */
  revisarFinDePartida() {                                   // no recibe nada
    if (this.juego.estado === 'jugando') return;            // si sigue jugando, no hace nada
    clearInterval(this.temporizador);                       // detiene el reloj
    this.actualizarBarra();                                 // deja el tiempo final en la barra
    if (this.juego.estado === 'ganado') {                   // si ganó...
      this.mostrarVictoria();                               // ...ventana de victoria (pedazo 11.4)
    } else {                                                // si perdió...
      this.mostrarDerrota();                                // ...ventana de derrota (pedazo 11.4)
    }
  }                                                         // fin de revisarFinDePartida

  // ⬇⬇⬇ AQUÍ PEGAREMOS EL PEDAZO 11.4 (las ventanas) ⬇⬇⬇

    // ===================== VENTANAS =====================

  /**
   * Abre la ventana flotante con el contenido indicado.
   * @param {string} contenidoHTML - Lo que se mostrará dentro de la ventana.
   * @returns {HTMLElement} El elemento de la ventana (para conectar sus botones).
   */
  abrirVentana(contenidoHTML) {                             // recibe el contenido
    const ventana = $('#ventana');                          // el cuadro de la ventana
    ventana.innerHTML = contenidoHTML;                      // escribe el contenido
    $('#capa').hidden = false;                              // muestra la capa oscura con la ventana
    return ventana;                                         // la devuelve
  }                                                         // fin de abrirVentana

  /**
   * Cierra la ventana flotante.
   * @returns {void} No devuelve nada.
   */
  cerrarVentana() {                                         // no recibe nada
    $('#capa').hidden = true;                               // oculta la capa
    $('#ventana').innerHTML = '';                           // borra el contenido
  }                                                         // fin de cerrarVentana

  /**
   * Muestra las reglas y los controles del juego.
   * @returns {void} No devuelve nada.
   */
  mostrarReglas() {                                         // no recibe nada
    const ventana = this.abrirVentana(
      '<h2>Reglas y controles</h2>' +
      '<p><b>Objetivo:</b> llevar las 52 cartas a las 4 fundaciones (arriba a la derecha), ' +
      'una por palo, en orden del As (A) al Rey (K).</p>' +
      '<ul>' +
      '<li>En las columnas se baja en orden y <b>alternando colores</b> (por ejemplo, 7♥ sobre 8♠).</li>' +
      '<li>Se puede mover un <b>grupo</b> de cartas boca arriba que ya esté en orden.</li>' +
      '<li>Solo un <b>Rey (K)</b> puede ir en una columna vacía.</li>' +
      '<li>Si una columna queda con una carta boca abajo arriba, esa carta se voltea.</li>' +
      '<li>El mazo se roba de a una carta y se puede recorrer <b>' + MAX_PASADAS + ' veces</b>.</li>' +
      '</ul>' +
      '<p><b>Se gana</b> cuando las 52 cartas están en las fundaciones. ' +
      '<b>Se pierde</b> si ya no quedan jugadas útiles o si te rindes.</p>' +
      '<p><b>Puntaje:</b> +10 carta a la fundación · +5 del mazo a una columna · ' +
      '+5 voltear una carta · −20 reiniciar el mazo · bonificación por tiempo al ganar.</p>' +
      '<p><b>Controles:</b> clic en el mazo para robar. Clic en una carta para elegirla ' +
      '(brilla en naranja) y clic en la columna o fundación a donde quieres llevarla.</p>' +
      '<div class="botones-ventana"><button id="btn-entendido" class="boton primario">Entendido</button></div>'
    );
    ventana.querySelector('#btn-entendido').onclick = () => this.cerrarVentana(); // el botón cierra la ventana
  }                                                         // fin de mostrarReglas

  /**
   * Pregunta si el jugador de verdad quiere rendirse.
   * @returns {void} No devuelve nada.
   */
  confirmarRendirse() {                                     // no recibe nada
    if (this.juego === null || this.juego.estado !== 'jugando') return; // solo si hay partida en curso
    const ventana = this.abrirVentana(
      '<h2>¿Rendirse?</h2>' +
      '<p style="text-align:center">La partida se contará como perdida.</p>' +
      '<div class="botones-ventana">' +
      '<button id="btn-cancelar" class="boton">Cancelar</button>' +
      '<button id="btn-si-rendirse" class="boton peligro">Rendirse</button>' +
      '</div>'
    );
    ventana.querySelector('#btn-cancelar').onclick = () => this.cerrarVentana(); // no se rinde
    ventana.querySelector('#btn-si-rendirse').onclick = () => this.seguro(() => { // sí se rinde:
      this.cerrarVentana();                                 // cierra esta ventana
      this.juego.rendirse();                                // la LÓGICA marca la partida como perdida
      this.dibujar();                                       // redibuja
      this.revisarFinDePartida();                           // muestra la ventana de derrota
    });
  }                                                         // fin de confirmarRendirse

  /**
   * Texto HTML con el resumen de la partida (puntaje, tiempo y movimientos).
   * @returns {string} El resumen listo para poner en una ventana.
   */
  resumenPartida() {                                        // no recibe nada
    return '<p style="text-align:center">' +
      'Puntaje: <b>' + this.juego.puntaje + '</b> · ' +
      'Tiempo: <b>' + formatoTiempo(this.juego.tiempoSegundos()) + '</b> · ' +
      'Movimientos: <b>' + this.juego.movimientos + '</b></p>';
  }                                                         // fin de resumenPartida

  /**
   * Ventana de victoria: pide el nombre (validado) para guardar el puntaje en el árbol.
   * @returns {void} No devuelve nada.
   */
  mostrarVictoria() {                                       // no recibe nada
    const ventana = this.abrirVentana(
      '<h2>🎉 ¡Ganaste!</h2>' +
      '<p style="text-align:center">Llevaste las 52 cartas a las fundaciones. ' +
      'Bonificación por tiempo: +' + this.juego.bonificacion + '</p>' +
      this.resumenPartida() +
      '<input id="campo-nombre" class="campo" placeholder="Escribe tu nombre" maxlength="30">' +
      '<p id="error-nombre" class="error"></p>' +
      '<div class="botones-ventana">' +
      '<button id="btn-no-guardar" class="boton">No guardar</button>' +
      '<button id="btn-guardar" class="boton primario">Guardar puntaje</button>' +
      '</div>'
    );
    const campoNombre = ventana.querySelector('#campo-nombre'); // el cuadro de texto
    campoNombre.focus();                                    // pone el cursor ahí para escribir de una vez

    const guardar = () => this.seguro(() => {               // qué pasa al pulsar "Guardar"
      const resultado = Validador.nombre(campoNombre.value); // VALIDA lo que escribió el usuario
      if (!resultado.ok) {                                  // si el nombre NO es válido...
        ventana.querySelector('#error-nombre').textContent = resultado.mensaje; // ...muestra el error
        return;                                             // ...y NO cierra la ventana (el juego sigue)
      }
      this.puntajes.agregar(                                // si es válido, lo INSERTA en el árbol BST
        resultado.valor,                                    // nombre limpio
        this.juego.puntaje,                                 // puntaje final
        this.juego.tiempoSegundos(),                        // tiempo
        this.juego.movimientos                              // movimientos
      );
      this.mostrarPuntajes();                               // muestra la tabla con el nuevo puntaje
    });

    ventana.querySelector('#btn-guardar').onclick = guardar; // botón Guardar
    campoNombre.onkeydown = (evento) => {                   // también se guarda con la tecla Enter
      if (evento.key === 'Enter') guardar();
    };
    ventana.querySelector('#btn-no-guardar').onclick = () => { // botón No guardar
      this.cerrarVentana();
      this.mostrarPantalla('menu');                         // vuelve al menú
    };
  }                                                         // fin de mostrarVictoria

  /**
   * Ventana de derrota (por falta de jugadas o por rendirse).
   * @returns {void} No devuelve nada.
   */
  mostrarDerrota() {                                        // no recibe nada
    let titulo;                                             // título según el motivo
    let explicacion;                                        // explicación según el motivo
    if (this.juego.motivoFin === 'rendicion') {             // si se rindió...
      titulo = '🏳️ Te rendiste';
      explicacion = 'La partida terminó.';
    } else {                                                // si no quedaron jugadas...
      titulo = '😕 Perdiste: no quedan jugadas';
      explicacion = 'Ya no hay movimientos que ayuden a avanzar y el mazo se agotó.';
    }
    const ventana = this.abrirVentana(
      '<h2>' + titulo + '</h2>' +
      '<p style="text-align:center">' + explicacion + ' Cartas en fundaciones: ' +
      this.juego.cartasEnFundaciones() + ' de 52.</p>' +
      this.resumenPartida() +
      '<div class="botones-ventana">' +
      '<button id="btn-ir-menu" class="boton">Menú</button>' +
      '<button id="btn-otra" class="boton primario">Nueva partida</button>' +
      '</div>'
    );
    ventana.querySelector('#btn-ir-menu').onclick = () => { // botón Menú
      this.cerrarVentana();
      this.mostrarPantalla('menu');
    };
    ventana.querySelector('#btn-otra').onclick = () => this.seguro(() => { // botón Nueva partida
      this.cerrarVentana();
      this.nuevaPartida();
    });
  }                                                         // fin de mostrarDerrota

  /**
   * Ventana de mejores puntajes: ranking (inorden inverso), buscar,
   * eliminar y los recorridos inorden, preorden y posorden del árbol BST.
   * @returns {void} No devuelve nada.
   */
  mostrarPuntajes() {                                       // no recibe nada
    // ---- Tabla del ranking: se recorre el árbol de MAYOR a MENOR ----
    let filas = '';                                         // aquí se arman las filas de la tabla
    this.puntajes.ranking((registro, puesto) => {           // INORDEN INVERSO del árbol
      filas = filas +
        '<tr>' +
        '<td>' + puesto + '</td>' +                         // puesto
        '<td>' + escaparHTML(registro.nombre) + '</td>' +   // nombre (protegido)
        '<td><b>' + registro.puntaje + '</b></td>' +        // puntaje
        '<td>' + formatoTiempo(registro.tiempo) + '</td>' + // tiempo
        '<td><button class="boton pequeno peligro" data-puntaje="' + registro.puntaje + '">Eliminar</button></td>' +
        '</tr>';
    });
    if (filas === '') {                                     // si el árbol está vacío...
      filas = '<tr><td colspan="5">Todavía no hay partidas ganadas.</td></tr>';
    }

    const ventana = this.abrirVentana(
      '<h2>🏆 Mejores puntajes</h2>' +
      '<table class="tabla">' +
      '<tr><th>#</th><th>Jugador</th><th>Puntaje</th><th>Tiempo</th><th></th></tr>' +
      filas +
      '</table>' +
      '<h3>Buscar un puntaje</h3>' +
      '<input id="campo-buscar" class="campo" placeholder="Ejemplo: 850">' +
      '<p id="error-buscar" class="error"></p>' +
      '<div id="resultado-buscar"></div>' +
      '<h3>Recorridos del árbol</h3>' +
      '<div class="recorrido"><b>Inorden:</b> ' + this.puntajes.recorridoTexto('inorden') + '</div>' +
      '<div class="recorrido"><b>Preorden:</b> ' + this.puntajes.recorridoTexto('preorden') + '</div>' +
      '<div class="recorrido"><b>Posorden:</b> ' + this.puntajes.recorridoTexto('posorden') + '</div>' +
      '<div class="botones-ventana">' +
      '<button id="btn-buscar" class="boton">Buscar</button>' +
      '<button id="btn-cerrar" class="boton primario">Cerrar</button>' +
      '</div>'
    );

    // ---- Botones "Eliminar" de cada fila ----
    const botonesEliminar = ventana.querySelectorAll('[data-puntaje]'); // todos los botones de eliminar
    botonesEliminar.forEach((boton) => {                    // a cada uno le asigna su acción
      boton.onclick = () => this.seguro(() => {
        this.puntajes.eliminar(Number(boton.dataset.puntaje)); // ELIMINA del árbol por su puntaje
        this.aviso('Puntaje eliminado.');
        this.mostrarPuntajes();                             // vuelve a dibujar la tabla actualizada
      });
    });

    // ---- Buscar un puntaje (con validación) ----
    const buscar = () => this.seguro(() => {
      const campo = ventana.querySelector('#campo-buscar'); // cuadro donde escribió
      const resultado = Validador.puntaje(campo.value);     // VALIDA que sea un número entero positivo
      const zonaError = ventana.querySelector('#error-buscar');
      const zonaResultado = ventana.querySelector('#resultado-buscar');
      if (!resultado.ok) {                                  // si no es válido...
        zonaError.textContent = resultado.mensaje;          // ...muestra el error (no se cierra nada)
        zonaResultado.innerHTML = '';
        return;
      }
      zonaError.textContent = '';                           // quita el error anterior
      const registro = this.puntajes.buscar(resultado.valor); // BUSCA en el árbol
      if (registro === null) {                              // si no existe...
        zonaResultado.innerHTML = '<div class="recorrido">No hay ninguna partida con ' + resultado.valor + ' puntos.</div>';
      } else {                                              // si existe...
        zonaResultado.innerHTML = '<div class="recorrido">Encontrado: <b>' + escaparHTML(registro.nombre) +
          '</b> — ' + registro.puntaje + ' puntos, ' + formatoTiempo(registro.tiempo) + ', ' + registro.fecha + '</div>';
      }
    });
    ventana.querySelector('#btn-buscar').onclick = buscar;  // botón Buscar
    ventana.querySelector('#campo-buscar').onkeydown = (evento) => { // o tecla Enter
      if (evento.key === 'Enter') buscar();
    };

    // ---- Cerrar ----
    ventana.querySelector('#btn-cerrar').onclick = () => {
      this.cerrarVentana();
      if (this.juego !== null && this.juego.estado !== 'jugando') { // si la partida ya terminó...
        this.mostrarPantalla('menu');                       // ...vuelve al menú
      }
    };
  }                                                         // fin de mostrarPuntajes

}                                                           // fin de la clase Interfaz

// ===================== INICIO DEL PROGRAMA =====================
// Cuando la página termina de cargar, se crea el gestor de puntajes y la interfaz.
window.addEventListener('DOMContentLoaded', () => {
  let almacen = null;                                       // dónde guardar los puntajes
  try {                                                     // intenta usar el almacenamiento del navegador
    localStorage.setItem('prueba', '1');                    // prueba a escribir
    localStorage.removeItem('prueba');                      // y borra la prueba
    almacen = localStorage;                                 // funciona: se usará localStorage
  } catch (error) {
    almacen = null;                                         // no funciona: el juego sigue, sin guardar
  }
  const gestorPuntajes = new GestorPuntajes(almacen);       // crea el gestor (con el árbol BST)
  window.interfaz = new Interfaz(gestorPuntajes);           // crea la interfaz (y la deja visible en la consola)
});