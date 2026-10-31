import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * `DELETE /api/v1/tasks/:id`. La spec viva todavía no tiene requisito para el
 * borrado: estos tests cubren el contrato del endpoint y los criterios CA-2,
 * CA-3, CA-10 y CA-11 de `docs/backlog/E2-gestion-tareas/us-borrar-tarea.md`.
 */
test.group('Tasks | borrar', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function cuenta(email: string) {
    const user = await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const token = await User.accessTokens.create(user)

    return { user, bearer: `Bearer ${token.value!.release()}` }
  }

  test('borrar una tarea responde 204 sin cuerpo y la tarea deja de existir', async ({
    client,
    assert,
  }) => {
    const { user, bearer } = await cuenta('ada@example.com')
    const task = await Task.create({ title: 'Sobra', status: 'pending', assigneeId: user.id })

    const response = await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', bearer)

    response.assertStatus(204)
    assert.isEmpty(response.text())
    assert.isNull(await Task.find(task.id))
  })

  test('la tarea borrada desaparece de la lista de otra cuenta', async ({ client, assert }) => {
    const { user, bearer } = await cuenta('ada@example.com')
    const otra = await cuenta('grace@example.com')
    const task = await Task.create({ title: 'Sobra', status: 'pending', assigneeId: user.id })

    await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', bearer)

    const lista = await client.get('/api/v1/tasks').header('Authorization', otra.bearer)
    lista.assertStatus(200)
    const ids = (lista.body().data as { id: number }[]).map((tarea) => tarea.id)
    assert.notInclude(ids, task.id)
  })

  test('se puede borrar una tarea ajena sin permiso especial', async ({ client, assert }) => {
    const { user } = await cuenta('ada@example.com')
    const otra = await cuenta('grace@example.com')
    const task = await Task.create({ title: 'Ajena', status: 'done', assigneeId: user.id })

    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', otra.bearer)

    response.assertStatus(204)
    assert.isNull(await Task.find(task.id))
  })

  test('borrar sin sesión responde 401 y no borra nada', async ({ client, assert }) => {
    const { user } = await cuenta('ada@example.com')
    const task = await Task.create({ title: 'Sigue', status: 'pending', assigneeId: user.id })

    const response = await client.delete(`/api/v1/tasks/${task.id}`)

    response.assertStatus(401)
    assert.isNotNull(await Task.find(task.id))
  })

  test('borrar una tarea que no existe responde 404', async ({ client }) => {
    const { bearer } = await cuenta('ada@example.com')

    const response = await client.delete('/api/v1/tasks/999999').header('Authorization', bearer)

    response.assertStatus(404)
  })

  test('borrar dos veces responde 404 la segunda', async ({ client }) => {
    const { user, bearer } = await cuenta('ada@example.com')
    const task = await Task.create({ title: 'Sobra', status: 'pending', assigneeId: user.id })

    await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', bearer)
    const segunda = await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', bearer)

    segunda.assertStatus(404)
  })

  test('un identificador no numérico responde 404', async ({ client }) => {
    const { bearer } = await cuenta('ada@example.com')

    const response = await client.delete('/api/v1/tasks/abc').header('Authorization', bearer)

    response.assertStatus(404)
  })

  for (const sufijo of ['.0', 'e0', '%20']) {
    test('un identificador que solo parece el de la tarea ({$self}) no la borra')
      .with([sufijo])
      .run(async ({ client, assert }, sufijoDelId) => {
        const { user, bearer } = await cuenta('ada@example.com')
        const task = await Task.create({ title: 'Sigue', status: 'pending', assigneeId: user.id })

        const response = await client
          .delete(`/api/v1/tasks/${task.id}${sufijoDelId}`)
          .header('Authorization', bearer)

        response.assertStatus(404)
        assert.isNotNull(await Task.find(task.id))
      })
  }
})
