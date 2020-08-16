export const typeDefs = ["type Greeting2 {\n  text: String!\n  pending: Boolean!\n}\n\ntype Query {\n  sayBye: String!\n  sayHello: Greeting!\n}\n\ntype Greeting {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayBye: string;
  sayHello: Greeting;
}

export interface Greeting {
  text: string;
  error: boolean;
}

export interface Greeting2 {
  text: string;
  pending: boolean;
}
