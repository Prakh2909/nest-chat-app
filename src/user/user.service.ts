import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface UserMetaData {
  state: string;
  client: Socket;
}

@Injectable()
export class UserService {
  private users = new Map<string, UserMetaData>();



  loginUser(username: string, client: Socket): {message: string, status: boolean} {
    let message: string='';
    let status: boolean=false;
    if (this.users.has(username)) {
      if(this.users.get(username).state != 'loggedIn'){
        const userMetaData = {
          client: client,
          state: 'loggedIn'
        }
        this.users.set(username, userMetaData);
        message = `Welcome, ${username}`;
        status=true;
      }else{
        message = `User is already logged in`;
      }
    }else{
      message = `User does not exist.`
    }

    return {message, status};
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

  logoutUsername(username: string): void {
    if (this.users.has(username)) {
      this.users.get(username).state = 'loggedOut';
    }
  }

  // handleDisconnect(client: Socket): void {
  //   const username = [...this.users.entries()].find(([, socket]) => socket.id === client.id)?.[0];
  //   if (username) {
  //     this.users.delete(username);
  //   }
  //   console.log(`Client disconnected: ${client.id}`);
  // }
}
