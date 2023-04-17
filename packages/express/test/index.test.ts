import { ExpressIntegration, init } from '@osohq/express';
import { DEFAULT_USER_ID, OsoSdkError } from '@osohq/node';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import request from 'supertest';

describe('test centralized middleware', () => {
  let server: Server;
  let app: Application;
  let mockAuthorize: jest.SpyInstance;

  beforeEach(() => {
    app = express();
    mockAuthorize = jest.spyOn(ExpressIntegration.prototype, 'authorize');
  });

  afterEach(() => {
    server.close();
  });

  test('static enforce args', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

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

  test('custom user function', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';
    const testUser = 'random';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultActorId: (_req: Request) => testUser,
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

    await request(app).get('/').expect(200);
    expect(mockAuthorize).toHaveBeenCalledWith(
      { type: 'User', id: testUser },
      action,
      {
        type: resourceType,
        id: resourceId,
      }
    );
  });

  test('denied authorization result', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => false
    );

    await request(app).get('/').expect(404);
  });

  test('custom error handler', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultErrorHandler: (res: Response, _next: NextFunction) => {
        res.status(418).send("I'm a teapot");
        return;
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => false
    );

    await request(app).get('/').expect(418);
  });

  test('custom action function', async () => {
    const resourceType = 'Foo';
    const resourceId = '123';
    const testAction = 'baz';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultAction: (_req: Request) => testAction,
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

    await request(app).get('/').expect(200);
    expect(mockAuthorize).toHaveBeenCalledWith(
      { type: 'User', id: DEFAULT_USER_ID },
      testAction,
      {
        type: resourceType,
        id: resourceId,
      }
    );
  });

  test('error from oso returns 500', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.use(oso.enforce({ action, resourceType, resourceId }));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
    mockAuthorize.mockImplementationOnce(() => {
      throw new OsoSdkError('error');
    });

    await request(app).get('/').expect(500);
  });
});

describe('test route middleware', () => {
  let server: Server;
  let app: Application;
  let oso: ExpressIntegration;
  let mockAuthorize: jest.SpyInstance;

  beforeEach(() => {
    app = express();
    oso = init({
      apiKey: 'YOUR_API_KEY',
    });
    mockAuthorize = jest.spyOn(ExpressIntegration.prototype, 'authorize');
  });

  afterEach(() => {
    server.close();
  });

  test('static enforce args', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = '123';

    app.get(
      '/',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      oso.enforce({ action, resourceType, resourceId }),
      (_req, res) => {
        res.send('Hello World!');
      }
    );

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

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

  test('dynamic path parameter', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = ':id';

    app.get(
      '/:id',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      oso.enforce({ action, resourceType, resourceId }),
      (_req, res) => {
        res.send('Hello World!');
      }
    );

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

    const testId = '123';
    await request(app).get(`/${testId}`).expect(200);
    expect(mockAuthorize).toHaveBeenCalledWith(
      { type: 'User', id: DEFAULT_USER_ID },
      action,
      {
        type: resourceType,
        id: testId,
      }
    );
  });

  test('unsupported request method returns 500', async () => {
    const resourceType = 'Foo';
    const resourceId = '123';

    const oso = init({
      apiKey: 'YOUR_API_KEY',
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.all('/', oso.enforce({ resourceType, resourceId }), (req, res) => {
      res.send('Hello World!');
    });

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

    await request(app).head('/').expect(500);
  });

  test('multiple dynamic path parameters returns 500', async () => {
    const action = 'view';
    const resourceType = 'Foo';
    const resourceId = ':id/:org_id';

    app.get(
      '/:org_id/:id',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      oso.enforce({ action, resourceType, resourceId }),
      (_req, res) => {
        res.send('Hello World!');
      }
    );

    server = app.listen(5678);

    mockAuthorize.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_actor, _action, _resource) => true
    );

    await request(app).get(`/123/456`).expect(500);
  });
});
