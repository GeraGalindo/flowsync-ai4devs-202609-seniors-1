import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cubre los scenarios del requisito «Borrado definitivo de una tarea» de
 * `openspec/specs/tasks/spec.md`.
 */
test.group('Tasks | borrado', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /** Crea una cuenta, le abre sesión y devuelve su token y su id. */
  async function cuenta(client: any, email: string) {
    const user = await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { id: user.id, token: login.body().data.token as string }
  }

  test('borrar una tarea responde 204 sin cuerpo y la tarea deja de existir', async ({
    client,
    assert,
  }) => {
    const { id: assigneeId, token } = await cuenta(client, 'ada@example.com')
    const tarea = await Task.create({ title: 'Revisar', status: 'pending', assigneeId })

    const response = await client
      .delete(`/api/v1/tasks/${tarea.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.equal(response.text(), '')
    assert.isNull(await Task.find(tarea.id))

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    const ids = (lista.body().data as any[]).map((t) => t.id)
    assert.notInclude(ids, tarea.id)
  })

  test('se puede borrar una tarea de otra persona', async ({ client, assert }) => {
    const { id: assigneeId } = await cuenta(client, 'ada@example.com')
    const { token } = await cuenta(client, 'grace@example.com')
    const tarea = await Task.create({ title: 'Ajena', status: 'in_progress', assigneeId })

    const response = await client
      .delete(`/api/v1/tasks/${tarea.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
    assert.isNull(await Task.find(tarea.id))
  })

  test('borrar sin sesión responde 401 y no borra nada', async ({ client, assert }) => {
    const { id: assigneeId } = await cuenta(client, 'ada@example.com')
    const tarea = await Task.create({ title: 'Sigue aquí', status: 'pending', assigneeId })

    const response = await client.delete(`/api/v1/tasks/${tarea.id}`)

    response.assertStatus(401)
    assert.isNotNull(await Task.find(tarea.id))
  })

  test('borrar dos veces responde 404 la segunda', async ({ client }) => {
    const { id: assigneeId, token } = await cuenta(client, 'ada@example.com')
    const tarea = await Task.create({ title: 'Una vez', status: 'pending', assigneeId })
    const borrar = () =>
      client.delete(`/api/v1/tasks/${tarea.id}`).header('Authorization', `Bearer ${token}`)

    const primera = await borrar()
    primera.assertStatus(204)

    const segunda = await borrar()
    segunda.assertStatus(404)
  })

  test('un identificador que no es un número responde 404 y no borra nada', async ({
    client,
    assert,
  }) => {
    const { id: assigneeId, token } = await cuenta(client, 'ada@example.com')
    const tarea = await Task.create({ title: 'Intacta', status: 'pending', assigneeId })

    const response = await client
      .delete('/api/v1/tasks/no-es-un-id')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    assert.isNotNull(await Task.find(tarea.id))
  })
})
