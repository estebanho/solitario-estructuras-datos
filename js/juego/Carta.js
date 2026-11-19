/**
 * Carta.js
 * Representa una carta de la baraja francesa (52 cartas: 4 palos x 13 valores).
 * No es una estructura de datos: es el DATO que se guarda dentro de las estructuras.
 */

// Símbolos de los palos. La posición en la lista es el número del palo:
// 0 = picas, 1 = corazones, 2 = diamantes, 3 = tréboles.
const PALOS = ['♠', '♥', '♦', '♣'];

// Nombres de los palos, para los mensajes que se le muestran al jugador.
const NOMBRES_PALOS = ['picas', 'corazones', 'diamantes', 'tréboles'];

// Texto de cada valor. La posición 0 queda vacía para que el número coincida:
// VALORES[1] = 'A' (As), VALORES[11] = 'J', VALORES[12] = 'Q', VALORES[13] = 'K' (Rey).
const VALORES = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class Carta {                                     // molde para crear cartas
  /**
   * Crea una carta (empieza boca abajo).
   * @param {number} palo - Número del palo: 0 picas, 1 corazones, 2 diamantes, 3 tréboles.
   * @param {number} valor - Valor de la carta, de 1 (As) a 13 (Rey).
   * @returns {Carta} La carta creada.
   */
  constructor(palo, valor) {                      // se ejecuta al hacer: new Carta(palo, valor)
    this.palo = palo;                             // guarda el número del palo (0 a 3)
    this.valor = valor;                           // guarda el valor (1 a 13)
    this.bocaArriba = false;                      // al crearla, la carta está boca abajo
    this.id = valor + '-' + palo;                 // identificador único, por ejemplo "13-0" = K de picas
  }                                               // fin del constructor

  /**
   * Indica si la carta es roja (corazones o diamantes).
   * @returns {boolean} true si es roja; false si es negra.
   */
  esRoja() {                                      // no recibe nada
    return this.palo === 1 || this.palo === 2;    // 1 = corazones y 2 = diamantes son rojas
  }                                               // fin de esRoja

  /**
   * Devuelve el símbolo del palo de la carta.
   * @returns {string} '♠', '♥', '♦' o '♣'.
   */
  simbolo() {                                     // no recibe nada
    return PALOS[this.palo];                      // busca el símbolo según el número del palo
  }                                               // fin de simbolo

  /**
   * Devuelve el texto del valor de la carta.
   * @returns {string} 'A', '2', ... '10', 'J', 'Q' o 'K'.
   */
  textoValor() {                                  // no recibe nada
    return VALORES[this.valor];                   // busca el texto según el valor
  }                                               // fin de textoValor

  /**
   * Devuelve el nombre corto de la carta, por ejemplo "Q♥".
   * @returns {string} Valor + símbolo del palo.
   */
  nombre() {                                      // no recibe nada
    return this.textoValor() + this.simbolo();    // une el valor y el símbolo
  }                                               // fin de nombre
}                                                 // fin de la clase Carta