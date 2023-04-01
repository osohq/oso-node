import { ExpressIntegration, init } from '@osohq/express';
import { DEFAULT_USER_ID } from '@osohq/node';
import express, { Application } from 'express';
import { Server } from 'http';
import request from 'supertest';

describe('test centralized middleware', () => {
  let server: Server;
  let app: Application;
  let oso: ExpressIntegration;

  beforeEach(() => {
    app = express();
    oso = init({
      apiKey: 'YOUR_API_KEY',
    });
  });

  afterEach(() => {
    server.close();
  });

  test('static enforce args', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    const mockAuthorize = jest
      .spyOn(ExpressIntegration.prototype, 'authorize')
      // eslint-disable-next-line @typescript-eslint/require-await
      .mockImplementationOnce(async (actor, action, resource) => true);

    await request(app).get('/').expect(200);
    expect(mockAuthorize).toHaveBeenCalledWith(
      { type: 'User', id: DEFAULT_USER_ID },
      action,
      {
        type: resourceType,
        id: resourceId,
      }
    );
  });
});
