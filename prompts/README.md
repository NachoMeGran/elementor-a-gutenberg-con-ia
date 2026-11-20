# Instrucciones de ejemplo para el agente

Estas instrucciones están pensadas para un agente de IA conectado a WordPress por MCP. No son fórmulas mágicas: son encargos bien hechos, como los que darías a una persona competente que no conoce tu web. Adáptalas a tu caso antes de usarlas.

## Estructura común

Todas siguen la misma estructura, porque cada parte evita un tipo de error:

| Parte | Para qué sirve |
|---|---|
| **Objetivo** | Qué resultado se espera, en una o dos frases. |
| **Contexto** | Lo que el agente necesita saber y no puede deducir: pila técnica, decisiones ya tomadas, documentos de referencia. |
| **Permisos** | Qué puede hacer sin preguntar, qué requiere aprobación y qué no debe hacer. |
| **Restricciones** | Límites de alcance, de estilo y de método. |
| **Pasos** | El orden de trabajo, cuando importa. |
| **Verificación** | Cómo debe comprobar que el trabajo está bien antes de darlo por terminado. |
| **Informe** | Qué debe entregar, separando lo verificado de lo no verificado. |

## Reglas que van en todas

- Ninguna instrucción incluye credenciales. La conexión se autoriza por el flujo del servidor MCP.
- Las acciones sensibles (publicar, borrar, redirigir, cambiar ajustes globales, activar o desactivar plugins) siempre requieren aprobación explícita.
- El informe distingue entre «hecho y verificado», «hecho sin verificar» y «no hecho».
- Ante la duda, el agente pregunta en lugar de suponer.

## Índice

1. [Auditoría previa](01-auditoria.md)
2. [Inventario y propuesta de plan](02-inventario.md)
3. [Reconstruir una página con bloques](03-reconstruir-pagina.md)
4. [Limpieza de restos de Elementor](04-limpieza-elementor.md)
5. [Verificación de una fase](05-verificacion.md)

Los nombres de herramientas que aparecen (`wp_get_post_blocks`, `wp_update_post_blocks`, `wp_replace_in_post`, `wp_cli_run`, `wp_clear_cache`, `wp_rm_*`) son los del servidor Easy MCP AI usado en el caso real. Si tu servidor MCP usa otros nombres, sustitúyelos.
