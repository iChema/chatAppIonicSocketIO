import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  socket: any;
  public myUserId: string;
  chats = [];
  // tslint:disable-next-line:variable-name
  chat_input: string;

  constructor(publicnavCtrl: NavController) {
    if (this.myUserId == null) {
      // this.myUserId = Date.now().toString();
      this.myUserId = 'CUPM960124HGTRRR06';
    }

    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log(this.myUserId);
      this.socket.emit('join', {curp:this.myUserId,sala:1} , (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('No error');
        }
      });
    });
    /*this.socket.on('connect', () => {
      console.log(this.myUserId);
      this.socket.emit('join', this.myUserId , (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('No error');
        }
      });
    });*/

    this.Receive();
  }

  send(msg) {
    // tslint:disable-next-line:triple-equals
    if (msg != '') {
      // Assign user typed message along with generated user id
      const saltedMsg = this.myUserId + '#' + msg;
      // Push the message through socket
      this.socket.emit('message', saltedMsg);
    }
    this.chat_input = '';
  }

  ReceiveHi() {
    // Socket receiving method
    this.socket.emit('new user', this.myUserId , (data) => {
      if (data) {
        console.log(data);
      } else {
        console.log('Estas dos veces el mismo');
      }
    });
  }

  Receive() {
    // Socket receiving method
    this.socket.on('message', (msg) => {
      // separate the salted message with "#" tag
      const saletdMsgArr = msg.split('#');
      let item = {};
      // check the sender id and change the style class
      // tslint:disable-next-line:triple-equals
      if (saletdMsgArr[0] == this.myUserId) {
        item = { styleClass: 'chat-message right', msgStr: saletdMsgArr[1] };
      } else {
        item = { styleClass: 'chat-message left', msgStr: saletdMsgArr[1] };
      }
      // push the bind object to array
      // Final chats array will iterate in the view
      this.chats.push(item);
    });
  }
}
