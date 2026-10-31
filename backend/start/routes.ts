/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import openapi from '@foadonis/openapi/services/main'

router.get('/', () => {
  return { hello: 'world' }
})

/**
 * Documentación OpenAPI. Registra tres rutas a partir del `path` que reciba
 * —por defecto `/api`—: la interfaz en `/api`, y el documento en `/api.json` y
 * `/api.yaml`. La interfaz se sirve en la raíz del `path` y lee el documento
 * del `/api.json`, así que las dos cosas viven en sitios distintos.
 *
 * Va fuera del grupo `/api/v1` a propósito: dentro heredaría ese prefijo y la
 * documentación pasaría a colgar de la propia versión que documenta.
 */
openapi.registerRoutes()

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Tasks, 'index'])
        router.post('/', [controllers.Tasks, 'store'])
        router.get(':id', [controllers.Tasks, 'show'])
        // SQLite compara por afinidad numérica: sin el matcher, `1.0` o `1e0`
        // encontrarían la tarea 1, y un borrado es irreversible.
        router.delete(':id', [controllers.Tasks, 'destroy']).where('id', router.matchers.number())
        router.patch(':id/status', [controllers.TaskStatuses, 'update'])
        router.put(':id/due-date', [controllers.TaskDueDates, 'update'])
      })
      .prefix('tasks')
      .as('tasks')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
