

import { Hono } from 'hono'
import {appUser} from './users'

const mainApp = new Hono().basePath('/api')

mainApp.get('/', (c) => {
  return c.text('Hello Hono!')
})




mainApp.route('/users', appUser)
export default mainApp
