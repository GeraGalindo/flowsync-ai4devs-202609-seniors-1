import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * `DELETE /api/v1/tasks/:id`. La spec viva todavía no tiene requisito de
 * borrado: estos casos salen de la historia E2-10 del backlog (CA-1, CA-3,
 * CA-10 y CA-11) y del contrato pedido, `204` sin cuerpo.
 */
test.group('Tasks | borrar', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /** Crea una cuenta y devuelve el token con el que opera. */
  async function cuenta(client: any, email: string) {
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })

    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return login.body().data.token as string
  }

  async function tareaDe(client: any, token: string) {
    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })

    creada.assertStatus(201)

    return creada.body().data.id as number
  }

  test('borrar una tarea responde 204 sin cuerpo y la tarea deja de existir', async ({
    client,
    assert,
  }) => {
    const token = await cuenta(client, 'ada@example.com')
    const id = await tareaDe(client, token)

    const respuesta = await client
      .delete(`/api/v1/tasks/${id}`)
      .header('Authorization', `Bearer ${token}`)

    respuesta.assertStatus(204)
    assert.equal(respuesta.text(), '')
    assert.isNull(await Task.find(id))
  })

  test('cualquier cuenta con sesión puede borrar una tarea ajena', async ({ client, assert }) => {
    const responsable = await cuenta(client, 'ada@example.com')
    const otra = await cuenta(client, 'grace@example.com')
    const id = await tareaDe(client, responsable)

    const respuesta = await client
      .delete(`/api/v1/tasks/${id}`)
      .header('Authorization', `Bearer ${otra}`)

    respuesta.assertStatus(204)
    assert.isNull(await Task.find(id))
  })

  test('borrar solo se lleva la tarea indicada', async ({ client, assert }) => {
    const token = await cuenta(client, 'ada@example.com')
    const borrada = await tareaDe(client, token)
    const intacta = await tareaDe(client, token)

    await client.delete(`/api/v1/tasks/${borrada}`).header('Authorization', `Bearer ${token}`)

    assert.isNotNull(await Task.find(intacta))
  })

  test('borrar dos veces responde 404 la segunda', async ({ client }) => {
    const token = await cuenta(client, 'ada@example.com')
    const id = await tareaDe(client, token)

    await client.delete(`/api/v1/tasks/${id}`).header('Authorization', `Bearer ${token}`)

    const segunda = await client
      .delete(`/api/v1/tasks/${id}`)
      .header('Authorization', `Bearer ${token}`)

    segunda.assertStatus(404)
  })

  test('un identificador que no es un número responde 404', async ({ client }) => {
    const token = await cuenta(client, 'ada@example.com')

    const respuesta = await client
      .delete('/api/v1/tasks/no-es-un-id')
      .header('Authorization', `Bearer ${token}`)

    respuesta.assertStatus(404)
  })

  test('un identificador que solo se parece al de una tarea responde 404 y no la borra', async ({
    client,
    assert,
  }) => {
    const token = await cuenta(client, 'ada@example.com')
    const id = await tareaDe(client, token)

    for (const parecido of [`${id}.0`, `${id}e0`, `${id}%20`]) {
      const respuesta = await client
        .delete(`/api/v1/tasks/${parecido}`)
        .header('Authorization', `Bearer ${token}`)

      respuesta.assertStatus(404)
      assert.isNotNull(await Task.find(id))
    }
  })

  test('sin sesión responde 401 y no se borra nada', async ({ client, assert }) => {
    const token = await cuenta(client, 'ada@example.com')
    const id = await tareaDe(client, token)

    const respuesta = await client.delete(`/api/v1/tasks/${id}`)

    respuesta.assertStatus(401)
    assert.isNotNull(await Task.find(id))
  })
})
