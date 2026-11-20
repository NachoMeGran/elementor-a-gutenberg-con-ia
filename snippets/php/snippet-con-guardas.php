<?php
/**
 * Patrón para fragmentos PHP en Code Snippets que no se desactivan al guardar.
 *
 * Por qué: al guardar o activar un fragmento, el validador de Code Snippets
 * compara los nombres de función que declara con las funciones ya definidas
 * (get_defined_functions()). Si el fragmento ya se está ejecutando, sus
 * funciones existen, el validador informa «Cannot redeclare function» y el
 * fragmento puede quedar desactivado sin que lo notes.
 *
 * Cómo evitarlo: envolver cada declaración en function_exists() (el validador
 * reconoce ese patrón) o usar funciones anónimas. Y, en cualquier caso,
 * comprobar después de guardar que el fragmento sigue activo.
 *
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

defined( 'ABSPATH' ) || exit;

// Opción A: función con nombre, protegida.
if ( ! function_exists( 'mi_sitio_quitar_emojis' ) ) {
	/**
	 * Ejemplo inocuo: deja de cargar el script de emojis de WordPress.
	 */
	function mi_sitio_quitar_emojis() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
	}
}
add_action( 'init', 'mi_sitio_quitar_emojis' );

// Opción B: función anónima; no declara nombres, así que no puede chocar.
add_filter(
	'excerpt_length',
	static function () {
		return 30;
	}
);
