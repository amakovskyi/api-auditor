import express, { Application, Request, Response } from 'express';
import * as Http from 'http';
import 'reflect-metadata';

export declare type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface EndpointMetadata {
  method: EndpointMethod;
  path: string;
}

interface ControllerMetadata {
  pathPrefix: string;
}

interface MethodArgumentMetadata {
  queryArgumentIndex?: number;
  bodyArgumentIndex?: number;
  pathArgumentIndex?: number;
}

export function Controller(pathPrefix: string = '') {
  return function(target: Object) {
    Reflect.defineMetadata('DummyServer:ControllerMetadata', { pathPrefix } as ControllerMetadata, target);
  };
}

export function Endpoint(method: EndpointMethod, path: string) {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('DummyServer:EndpointMetadata', { method, path } as EndpointMetadata, target, propertyKey);
  };
}

export function Query() {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const metadata: MethodArgumentMetadata = Reflect.getMetadata('DummyServer:MethodArguments', target, propertyKey) || {};
    metadata.queryArgumentIndex = parameterIndex;
    Reflect.defineMetadata('DummyServer:MethodArguments', metadata, target, propertyKey);
  };
}

export function Body() {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const metadata: MethodArgumentMetadata = Reflect.getMetadata('DummyServer:MethodArguments', target, propertyKey) || {};
    metadata.bodyArgumentIndex = parameterIndex;
    Reflect.defineMetadata('DummyServer:MethodArguments', metadata, target, propertyKey);
  };
}

export function Path() {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const metadata: MethodArgumentMetadata = Reflect.getMetadata('DummyServer:MethodArguments', target, propertyKey) || {};
    metadata.pathArgumentIndex = parameterIndex;
    Reflect.defineMetadata('DummyServer:MethodArguments', metadata, target, propertyKey);
  };
}

class EndpointHandler {
  constructor(
    private readonly controller: any,
    private readonly methodName: string,
    private readonly methodArgumentMetadata: MethodArgumentMetadata,
  ) {
  }

  async handle(req: Request, res: Response) {
    try {
      const args: any[] = [];
      if (this.methodArgumentMetadata.queryArgumentIndex != null && this.methodArgumentMetadata.queryArgumentIndex >= 0) {
        args[this.methodArgumentMetadata.queryArgumentIndex] = req.query;
      }
      if (this.methodArgumentMetadata.bodyArgumentIndex != null && this.methodArgumentMetadata.bodyArgumentIndex >= 0) {
        args[this.methodArgumentMetadata.bodyArgumentIndex] = req.body;
      }
      if (this.methodArgumentMetadata.pathArgumentIndex != null && this.methodArgumentMetadata.pathArgumentIndex >= 0) {
        args[this.methodArgumentMetadata.pathArgumentIndex] = req.params;
      }
      let response: any = await this.controller[this.methodName](...args);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ResponseError) {
        res.status(error.statusCode);
        if (error.response) {
          res.json(error.response);
        }
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export class DummyServer {
  private constructor(
    private readonly app: Application,
    private readonly server: Http.Server,
  ) {
  }

  static launch(port: number, ...controllers: any[]): DummyServer {
    const app = express();
    app.use(express.json());

    for (const controller of controllers) {
      console.log(`Mapping controller ${controller.constructor?.name}`);
      const controllerMetadata: ControllerMetadata | undefined = Reflect.getMetadata('DummyServer:ControllerMetadata', controller.constructor);
      const controllerPathPrefix = controllerMetadata?.pathPrefix || '';
      const prototype = Object.getPrototypeOf(controller);
      const methods = Object.getOwnPropertyNames(prototype).filter(prop => typeof prototype[prop] === 'function' && prop !== 'constructor');
      for (const methodName of methods) {
        console.log(`> method ${methodName}`);
        const endpointMetadata: EndpointMetadata | undefined = Reflect.getMetadata('DummyServer:EndpointMetadata', controller, methodName);
        if (endpointMetadata) {
          const methodArgumentMetadata: MethodArgumentMetadata = Reflect.getMetadata('DummyServer:MethodArguments', prototype, methodName);
          console.log(JSON.stringify(methodArgumentMetadata));
          const fullPath = controllerPathPrefix + endpointMetadata.path;
          const endpointHandler = new EndpointHandler(controller, methodName, methodArgumentMetadata);
          switch (endpointMetadata.method) {
            case 'GET':
              app.get(fullPath, (req, res) => endpointHandler.handle(req, res));
              break;
            case 'POST':
              app.post(fullPath, (req, res) => endpointHandler.handle(req, res));
              break;
            case 'PUT':
              app.put(fullPath, (req, res) => endpointHandler.handle(req, res));
              break;
            case 'DELETE':
              app.delete(fullPath, (req, res) => endpointHandler.handle(req, res));
              break;
          }
        }
      }
    }

    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    return new DummyServer(app, server);
  }

  close() {
    this.server.close();
  }
}

export class ResponseError extends Error {
  constructor(public statusCode: number, public response?: any) {
    super(`Error ${statusCode}`);
    this.name = 'ResponseError';
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}