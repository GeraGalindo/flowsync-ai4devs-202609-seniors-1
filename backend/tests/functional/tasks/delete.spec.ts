import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * `DELETE /api/v1/tasks/:id`. Todavía no hay requisito en
 * `openspec/specs/tasks/spec.md`: lo que se comprueba sale de RF-12 del PRD y
 * de los criterios de `docs/backlog/E2-gestion-tareas/us-borrar-tarea.md`.
 */
test.group('Tasks | borrar', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function cuentaConToken(client: any, email: string) {
    const user = await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: login.body().data.token as string }
  }

  test('borrar una tarea responde 204 sin cuerpo y la tarea deja de existir', async ({
    client,
    assert,
  }) => {
    const { user, token } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Sobra', status: 'pending', assigneeId: user.id })

    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.equal(response.text(), '')
    assert.isNull(await Task.find(task.id))
  })

  test('se puede borrar una tarea ajena', async ({ client, assert }) => {
    const { user: ajena } = await cuentaConToken(client, 'ajena@example.com')
    const { token } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'De otra', status: 'done', assigneeId: ajena.id })

    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.isNull(await Task.find(task.id))
  })

  test('sin sesión responde 401 y no se borra nada', async ({ client, assert }) => {
    const { user } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Sigue', status: 'pending', assigneeId: user.id })

    const response = await client.delete(`/api/v1/tasks/${task.id}`)

    response.assertStatus(401)
    assert.isNotNull(await Task.find(task.id))
  })

  test('borrarla por segunda vez responde 404', async ({ client }) => {
    const { user, token } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Una vez', status: 'pending', assigneeId: user.id })

    await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', `Bearer ${token}`)
    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
  })

  test('otra forma de escribir el identificador responde 404 y no borra: {$self}')
    .with(['1.0', '1e0', '+1', '%201', '01abc'])
    .run(async ({ client, assert }, alias) => {
      const { user, token } = await cuentaConToken(client, 'ada@example.com')
      const task = await Task.create({ title: 'Sigue', status: 'pending', assigneeId: user.id })
      const escrito = alias.replace('1', String(task.id))

      const response = await client
        .delete(`/api/v1/tasks/${escrito}`)
        .header('Authorization', `Bearer ${token}`)

      response.assertStatus(404)
      assert.isNotNull(await Task.find(task.id))
    })

  test('un identificador no numérico responde 404', async ({ client }) => {
    const { token } = await cuentaConToken(client, 'ada@example.com')

    const response = await client
      .delete('/api/v1/tasks/no-es-un-id')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
  })
})
