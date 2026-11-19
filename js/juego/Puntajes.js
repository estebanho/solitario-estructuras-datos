/**
 * Puntajes.js
 * 1) GestorPuntajes: tabla de mejores puntajes guardada en un ÁRBOL BST
 *    (la clave es el puntaje). Se guarda en el navegador (localStorage).
 * 2) Validador: revisa los datos que escribe el usuario para que el juego
 *    nunca se cierre por un dato inválido.
 */

// Nombre con el que se guardan los puntajes en el navegador
const NOMBRE_GUARDADO = 'solitario-puntajes';

class GestorPuntajes {                                      // molde del gestor de puntajes
  /**
   * Crea el gestor y carga los puntajes que estaban guardados.
   * @param {Storage|null} almacen - Dónde guardar (localStorage del navegador), o null para no guardar.
   * @returns {GestorPuntajes} El gestor listo para usar.
   */
  constructor(almacen) {                                    // recibe el almacenamiento
    // ÁRBOL BST cuya clave es el puntaje de cada registro
    this.arbol = new ArbolBST((registro) => registro.puntaje);
    this.almacen = almacen;                                 // guarda dónde se van a guardar los datos
    this.cargar();                                          // lee los puntajes guardados antes
  }                                                         // fin del constructor

  /**
   * Agrega una partida ganada a la tabla.
   * @param {string} nombre - Nombre del jugador (ya validado).
   * @param {number} puntaje - Puntaje final.
   * @param {number} tiempo - Duración de la partida en segundos.
   * @param {number} movimientos - Cantidad de movimientos.
   * @returns {object} El registro que se guardó.
   */
  agregar(nombre, puntaje, tiempo, movimientos) {           // recibe los datos de la partida
    const registro = {                                      // arma el registro
      nombre: nombre,
      puntaje: puntaje,
      tiempo: tiempo,
      movimientos: movimientos,
      fecha: new Date().toLocaleDateString('es-CO'),        // fecha de hoy, por ejemplo "18/11/2026"
    };
    this.arbol.insertar(registro);                          // lo INSERTA en el árbol
    this.guardar();                                         // guarda la tabla en el navegador
    return registro;                                        // devuelve el registro creado
  }                                                         // fin de agregar

  /**
   * Busca una partida por su puntaje exacto.
   * @param {number} puntaje - Puntaje que se busca.
   * @returns {object|null} El registro encontrado, o null si no existe.
   */
  buscar(puntaje) {                                         // recibe el puntaje
    return this.arbol.buscar(puntaje);                      // BUSCA en el árbol
  }                                                         // fin de buscar

  /**
   * Elimina una partida de la tabla por su puntaje.
   * @param {number} puntaje - Puntaje del registro a eliminar.
   * @returns {boolean} true si se eliminó; false si no existía.
   */
  eliminar(puntaje) {                                       // recibe el puntaje
    const seElimino = this.arbol.eliminar(puntaje);         // ELIMINA del árbol
    if (seElimino) {                                        // si de verdad se borró...
      this.guardar();                                       // ...guarda la tabla actualizada
    }
    return seElimino;                                       // devuelve si se eliminó
  }                                                         // fin de eliminar

  /**
   * Recorre las partidas de MAYOR a MENOR puntaje (inorden inverso del árbol).
   * @param {function} visitar - Función que recibe (registro, puesto) empezando en el puesto 1.
   * @returns {void} No devuelve nada.
   */
  ranking(visitar) {                                        // recibe una función
    let puesto = 1;                                         // el primero es el puesto 1
    this.arbol.inordenInverso((registro) => {               // recorre de mayor a menor
      visitar(registro, puesto);                            // entrega el registro y su puesto
      puesto++;                                             // el siguiente puesto
    });
  }                                                         // fin de ranking

  /**
   * Devuelve un recorrido del árbol como texto, por ejemplo "300 → 500 → 800".
   * @param {string} tipoRecorrido - 'inorden', 'preorden' o 'posorden'.
   * @returns {string} Los puntajes en el orden del recorrido.
   */
  recorridoTexto(tipoRecorrido) {                           // recibe el nombre del recorrido
    let texto = '';                                         // aquí se va armando el texto
    const agregarAlTexto = (registro) => {                  // función que agrega un puntaje al texto
      if (texto !== '') {                                   // si ya hay algo escrito...
        texto = texto + ' → ';                              // ...pone una flecha antes
      }
      texto = texto + registro.puntaje;                     // agrega el puntaje
    };
    if (tipoRecorrido === 'inorden') this.arbol.inorden(agregarAlTexto);
    if (tipoRecorrido === 'preorden') this.arbol.preorden(agregarAlTexto);
    if (tipoRecorrido === 'posorden') this.arbol.posorden(agregarAlTexto);
    if (texto === '') {                                     // si el árbol estaba vacío...
      return '(árbol vacío)';
    }
    return texto;                                           // devuelve el texto armado
  }                                                         // fin de recorridoTexto

  /**
   * Guarda la tabla en el navegador usando el recorrido PREORDEN
   * (un registro por línea). Al cargar e insertar en ese mismo orden,
   * el árbol queda con exactamente la misma forma.
   * @returns {void} No devuelve nada.
   */
  guardar() {                                               // no recibe nada
    if (this.almacen === null) {                            // si no hay dónde guardar...
      return;                                               // ...no hace nada
    }
    let texto = '';                                         // aquí se arma todo el contenido
    this.arbol.preorden((registro) => {                     // recorre en PREORDEN
      texto = texto + JSON.stringify(registro) + '\n';      // convierte el registro en texto y salta de línea
    });
    try {                                                   // intenta guardar...
      this.almacen.setItem(NOMBRE_GUARDADO, texto);         // ...en el navegador
    } catch (error) {                                       // si falla (navegador sin permiso)...
      // no se hace nada: el juego sigue funcionando, solo que sin guardar
    }
  }                                                         // fin de guardar

  /**
   * Carga los puntajes guardados en el navegador.
   * Si alguna línea está dañada, se ignora y el juego no se cierra.
   * @returns {void} No devuelve nada.
   */
  cargar() {                                                // no recibe nada
    if (this.almacen === null) {                            // si no hay almacenamiento...
      return;                                               // ...no hay nada que cargar
    }
    let texto = '';                                         // contenido guardado
    try {
      texto = this.almacen.getItem(NOMBRE_GUARDADO) || '';  // lee lo guardado (o texto vacío si no hay nada)
    } catch (error) {
      return;                                               // si no se puede leer, sale sin cargar
    }
    const lineas = texto.split('\n');                       // separa el texto en líneas (una por registro)
    for (let i = 0; i < lineas.length; i++) {               // por cada línea...
      if (lineas[i] === '') continue;                       // ...salta las líneas vacías
      try {
        const registro = JSON.parse(lineas[i]);             // convierte el texto otra vez en registro
        this.arbol.insertar(registro);                      // lo inserta en el árbol (mismo orden = misma forma)
      } catch (error) {
        // línea dañada: se ignora y se sigue con la siguiente
      }
    }
  }                                                         // fin de cargar
}                                                           // fin de la clase GestorPuntajes

/**
 * Validador: revisa lo que escribe el usuario.
 * Cada función devuelve {ok: true, valor} si el dato es válido,
 * o {ok: false, mensaje} explicando el error.
 */
const Validador = {
  /**
   * Valida el nombre del jugador.
   * @param {string} texto - Lo que escribió el usuario.
   * @returns {object} {ok: true, valor: nombreLimpio} o {ok: false, mensaje}.
   */
  nombre(texto) {                                           // recibe el texto escrito
    const limpio = String(texto).trim();                    // quita los espacios del inicio y del final
    if (limpio.length === 0) {                              // si quedó vacío...
      return { ok: false, mensaje: 'Escribe tu nombre.' };
    }
    if (limpio.length > 15) {                               // si es demasiado largo...
      return { ok: false, mensaje: 'El nombre puede tener máximo 15 caracteres.' };
    }
    const soloPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/;   // solo letras, tildes, ñ, números y espacios
    if (!soloPermitidos.test(limpio)) {                     // si tiene otros símbolos...
      return { ok: false, mensaje: 'Usa solo letras, números y espacios.' };
    }
    return { ok: true, valor: limpio };                     // nombre válido
  },

  /**
   * Valida un puntaje escrito por el usuario (para buscar o eliminar).
   * @param {string} texto - Lo que escribió el usuario.
   * @returns {object} {ok: true, valor: numero} o {ok: false, mensaje}.
   */
  puntaje(texto) {                                          // recibe el texto escrito
    const limpio = String(texto).trim();                    // quita espacios
    if (limpio === '') {                                    // si está vacío...
      return { ok: false, mensaje: 'Escribe un puntaje.' };
    }
    const soloDigitos = /^[0-9]{1,7}$/;                     // de 1 a 7 dígitos, nada más
    if (!soloDigitos.test(limpio)) {                        // si tiene letras, signos o decimales...
      return { ok: false, mensaje: 'El puntaje debe ser un número entero positivo.' };
    }
    return { ok: true, valor: parseInt(limpio, 10) };       // convierte el texto a número
  },
};