import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface UserMetaData {
  state: string;
  client: Socket;
}

@Injectable()
export class UserService {
  private users = new Map<string, UserMetaData>();



  loginUser(username: string, client: Socket): string {
    if (this.users.has(username)) {
      const userMetaData = {
        client: client,
        state: 'loggedIn'
      }
      this.users.set(username, userMetaData); // adding an extra assignment cant find a solution TBD
      return `Welcome, ${username}`;
    }

    return null;
  }

  signUpUser(username: string, client: Socket): string {
    if (!this.users.has(username)) {
      const userMetaData = {
        client: client,
        state: 'loggedIn'
      }
      this.users.set(username, userMetaData);
      return `Welcome, ${username}`;
    }
    return null;
  }

  getUserSocket(username: string): Socket {
    return this.users.get(username)['client'];
  }

  // handleDisconnect(client: Socket): void {
  //   const username = [...this.users.entries()].find(([, socket]) => socket.id === client.id)?.[0];
  //   if (username) {
  //     this.users.delete(username);
  //   }
  //   console.log(`Client disconnected: ${client.id}`);
  // }
}
