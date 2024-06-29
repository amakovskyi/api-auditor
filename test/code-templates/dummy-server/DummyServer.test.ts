import axios from 'axios';
import { DummyServer } from '../../../src/dummy-server/DummyServer';
import { UserController } from './UserController';
import { AdminController } from './AdminController';

describe('DummyServer', () => {
  let server: DummyServer;

  beforeAll(async () => {
    server = DummyServer.launch(3000, new UserController(), new AdminController());
  });

  afterAll(async () => {
    server.close();
  });

  it('should get user by ID', async () => {
    const response = await axios.get('http://localhost:3000/users?id=123');
    console.log(JSON.stringify(response.data));
    expect(response.data).toEqual({ id: '123', name: 'John Doe' });
  });

  it('should create new user', async () => {
    const response = await axios.post('http://localhost:3000/users', { id: '123', name: 'John Doe' });
    console.log(JSON.stringify(response.data));
    expect(response.data).toEqual({
      message: 'User created',
      user: { id: '123', name: 'John Doe' },
    });
  });

  it('should get user details', async () => {
    const response = await axios.get('http://localhost:3000/users/456/details?detailed=true');
    console.log(JSON.stringify(response.data));
    expect(response.data).toEqual({ id: '456', details: 'Very detailed' });
  });

  it('should get all users from admin controller', async () => {
    const response = await axios.get('http://localhost:3000/admin/users?limit=2');
    console.log(JSON.stringify(response.data));
    expect(response.data).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);
  });

  it('should return a 404 error', async () => {
    try {
      await axios.get('http://localhost:3000/users/invalid/details');
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toEqual({
        details: 'Invalid user ID',
      });
    }
  });

});