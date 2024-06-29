import { Controller, Endpoint, Query } from '../../../src/dummy-server/DummyServer';

@Controller('/admin')
export class AdminController {

  @Endpoint('GET', '/users')
  async getAllUsers(@Query() query: { limit: number }) {
    // ... your logic to fetch all users with limit
    return [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];
  }
}