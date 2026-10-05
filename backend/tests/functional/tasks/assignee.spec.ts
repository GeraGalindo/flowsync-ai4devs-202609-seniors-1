import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable se identifica por nombre e
 * iniciales, no se filtra su email, y una cuenta sin nombre sigue llegando con
 * iniciales.
 *
 * Las tareas se crean por la API y no con el modelo: el responsable es la
 * cuenta dueña del token, y es así como el sistema lo asigna.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const today = '2026-10-05'

  async function sesion(client: any, fullName: string | null, email: string) {
    await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function crearTarea(client: any, token: string) {
    const response = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })

    response.assertStatus(201)
    return response
  }

  async function obtenerTarea(client: any, token: string, id: number) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .header('Authorization', `Bearer ${token}`)
      .qs({ today })

    response.assertStatus(200)
    return response.body().data
  }

  // La lista es la misma para todo el espacio y la BD es compartida con el
  // servidor de desarrollo: se busca la tarea por id, no por posición.
  async function buscarEnLista(client: any, token: string, id: number) {
    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data.find((tarea: { id: number }) => tarea.id === id)
  }

  test('una tarea trae el nombre y las iniciales de su responsable', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const creada = await crearTarea(client, token)

    const tarea = await obtenerTarea(client, token, creada.body().data.id)

    assert.equal(tarea.assignee.fullName, 'Ada Lovelace')
    assert.equal(tarea.assignee.initials, 'AL')
  })

  test('el responsable de una tarea no expone su email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const email = 'ada@example.com'
    const token = await sesion(client, 'Ada Lovelace', email)
    const creada = await crearTarea(client, token)
    const id = creada.body().data.id

    const suelta = await obtenerTarea(client, token, id)
    const enLista = await buscarEnLista(client, token, id)
    assert.exists(enLista)

    // Toda vía por la que sale una tarea cuenta: la suelta, la de la lista y
    // la que devuelve la propia creación.
    const vias = { suelta, enLista, creada: creada.body().data }

    for (const [via, tarea] of Object.entries(vias)) {
      const assignee = JSON.stringify(tarea.assignee)
      assert.notInclude(assignee, email, `la tarea ${via} filtra el email`)
      assert.notInclude(assignee, 'secreto123', `la tarea ${via} filtra la contraseña`)
      assert.notInclude(assignee, token, `la tarea ${via} filtra el token`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, null, 'sin-nombre@example.com')
    const creada = await crearTarea(client, token)

    const tarea = await obtenerTarea(client, token, creada.body().data.id)

    assert.isNull(tarea.assignee.fullName)
    assert.isString(tarea.assignee.initials)
    assert.isNotEmpty(tarea.assignee.initials)
  })
})
