import { Body, Endpoint, Path, Query, ResponseError } from '../../../src/dummy-server/DummyServer';

export class UserController {

  @Endpoint('GET', '/users')
  async getUserById(@Query() query: { id: string }) {
    // ... your logic to fetch user by ID
    return { id: query.id, name: 'John Doe' };
  }

  @Endpoint('POST', '/users')
  async createUser(@Body() user: any) {
    // ... your logic to create a new user
    return { message: 'User created', user };
  }

  @Endpoint('GET', '/users/:id/details')
  async getUserDetails(@Path() path: { id: string }, @Query() query: { detailed: boolean }) {
    if (path.id === 'invalid') {
      throw new ResponseError(404, { details: 'Invalid user ID' });
    }
    // ... your logic to fetch user details
    return { id: path.id, details: query.detailed ? 'Very detailed' : 'Basic details' };
  }

}
