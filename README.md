# Solitario Klondike · Proyecto final de Estructuras de Datos

Juego de **Solitario (Klondike)** con interfaz gráfica estilo iOS (efecto vidrio transparente).
Las cinco estructuras de datos (pila, cola, lista circular, lista doblemente enlazada y
árbol binario de búsqueda) están **programadas desde cero con nodos y referencias**;
no se usa ninguna colección del lenguaje para ellas.

## Integrantes

- Esteban felipe Hernández ordoñez
- Integrante 2
- Integrante 3

## Lenguaje y requisitos

| Elemento | Detalle |
|---|---|
| Lenguaje | JavaScript, HTML5 y CSS3 |
| Librerías | Ninguna externa (HTML5 y CSS solo dibujan la interfaz) |
| Navegador | Google Chrome, Microsoft Edge o Firefox actualizados |
| Instalación | No requiere instalar nada |

## Cómo ejecutarlo

1. Descargar el proyecto: botón verde **Code → Download ZIP** y descomprimirlo
   (o clonarlo con `git clone`).
2. Abrir la carpeta y hacer doble clic en **`index.html`**. El juego se abre en el navegador.
3. En el menú principal, pulsar **Nueva partida**.

## Cómo se juega

- **Objetivo:** llevar las 52 cartas a las 4 fundaciones, una por palo, del As al Rey.
- En las columnas se baja en orden y alternando colores (rojo sobre negro).
- Solo un Rey puede ir en una columna vacía.
- El mazo se roba de a una carta y se puede recorrer 3 veces.
- **Controles:** clic en el mazo para robar; clic en una carta para elegirla y clic en
  la columna o fundación de destino.
- **Se gana** al llevar las 52 cartas a las fundaciones.
- **Se pierde** si ya no quedan jugadas útiles o si el jugador se rinde.

## Estructura del proyecto

```
index.html                  Página del juego (menú, tablero y ventanas)
css/estilos.css             Apariencia estilo iOS
js/estructuras/             Estructuras de datos programadas desde cero
  Nodos.js                  NodoSimple, NodoDoble, NodoArbol
  Pila.js                   Pila
  Cola.js                   Cola
  ListaCircular.js          Lista circular
  ListaDoble.js             Lista doblemente enlazada
  ArbolBST.js               Árbol binario de búsqueda
js/juego/
  Carta.js                  Una carta de la baraja
  Solitario.js              Reglas y lógica del juego
  Puntajes.js               Tabla de puntajes (árbol BST) y validación de datos
js/interfaz/
  Interfaz.js               Dibuja el tablero, recibe los clics y muestra las ventanas
```

## Dónde se usa cada estructura

| Estructura | Uso en el juego |
|---|---|
| **Pila** | Las 4 fundaciones: solo se pone o se quita la carta de arriba. |
| **Cola** | El reparto: las cartas barajadas se reparten en el orden en que entraron. |
| **Lista circular** | El mazo de robo: al llegar a la última carta vuelve a empezar. |
| **Lista doble** | Las 7 columnas: mover un grupo de cartas = cortar y pegar la lista. |
| **Árbol BST** | Mejores puntajes: ranking, buscar, eliminar y recorridos. |