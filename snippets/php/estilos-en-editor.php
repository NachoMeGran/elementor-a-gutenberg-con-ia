<?php
/**
 * Carga el sistema de diseño en la parte pública y en el editor de bloques.
 *
 * Pensado para un tema hijo de GeneratePress (functions.php) o para un
 * plugin propio. Supone que el CSS está en el tema hijo, en /css/tokens.css.
 *
 * - wp_enqueue_scripts: parte pública.
 * - add_editor_style(): estilos del contenido en el editor. WordPress los
 *   prefija con .editor-styles-wrapper para que no afecten a la interfaz.
 *
 * Referencia: «Enqueueing assets in the Editor», Block Editor Handbook.
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'mi_sitio_estilos_publicos' ) ) {
	/**
	 * Encola los tokens en la parte pública, con versión por fecha de archivo
	 * para que la caché del navegador se renueve al cambiarlo.
	 */
	function mi_sitio_estilos_publicos() {
		$ruta = get_stylesheet_directory() . '/css/tokens.css';
		if ( ! file_exists( $ruta ) ) {
			return;
		}
		wp_enqueue_style(
			'mi-sitio-tokens',
			get_stylesheet_directory_uri() . '/css/tokens.css',
			array(),
			(string) filemtime( $ruta )
		);
	}
	add_action( 'wp_enqueue_scripts', 'mi_sitio_estilos_publicos', 20 );
}

if ( ! function_exists( 'mi_sitio_estilos_editor' ) ) {
	/**
	 * Registra los mismos tokens como estilos del editor.
	 */
	function mi_sitio_estilos_editor() {
		add_theme_support( 'editor-styles' );
		add_editor_style( 'css/tokens.css' );
	}
	add_action( 'after_setup_theme', 'mi_sitio_estilos_editor' );
}
