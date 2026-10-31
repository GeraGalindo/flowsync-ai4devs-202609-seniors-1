import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Borrar una tarea con `DELETE /api/v1/tasks/:id`. Todavía no hay requisito en
 * `openspec/specs/tasks/spec.md`: estos tests siguen los criterios de la API de
 * la historia E2-10 (`docs/backlog/E2-gestion-tareas/us-borrar-tarea.md`).
 */
test.group('Tasks | borrar', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function cuentaConToken(client: any, email: string) {
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })

    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    const user = await User.findByOrFail('email', email)

    return { user, token: login.body().data.token as string }
  }

  test('borra la tarea y responde 204 sin cuerpo', async ({ client, assert }) => {
    const { user, token } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.equal(response.text(), '')
    assert.isNull(await Task.find(task.id))
  })

  test('se puede borrar una tarea ajena', async ({ client, assert }) => {
    const { user: duena } = await cuentaConToken(client, 'duena@example.com')
    const { token } = await cuentaConToken(client, 'otra@example.com')
    const task = await Task.create({ title: 'Ajena', status: 'pending', assigneeId: duena.id })

    const response = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.isNull(await Task.find(task.id))
  })

  test('borrar dos veces responde 404 la segunda', async ({ client }) => {
    const { user, token } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    await client.delete(`/api/v1/tasks/${task.id}`).header('Authorization', `Bearer ${token}`)
    const segunda = await client
      .delete(`/api/v1/tasks/${task.id}`)
      .header('Authorization', `Bearer ${token}`)

    segunda.assertStatus(404)
  })

  test('un identificador que no es solo dígitos responde 404 y no borra nada')
    .with(['no-es-un-id', '{id}.0', '{id}e0', '%20{id}'])
    .run(async ({ client, assert }, plantilla) => {
      const { user, token } = await cuentaConToken(client, 'ada@example.com')
      const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

      const response = await client
        .delete(`/api/v1/tasks/${plantilla.replace('{id}', String(task.id))}`)
        .header('Authorization', `Bearer ${token}`)

      response.assertStatus(404)
      assert.isNotNull(await Task.find(task.id))
    })

  test('sin sesión responde 401 y no borra nada', async ({ client, assert }) => {
    const { user } = await cuentaConToken(client, 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    const response = await client.delete(`/api/v1/tasks/${task.id}`)

    response.assertStatus(401)
    assert.isNotNull(await Task.find(task.id))
  })
})
