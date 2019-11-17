import * as supertest from 'supertest';
import {} from 'jasmine';
import { OK, BAD_REQUEST } from 'http-status-codes';
import { SuperTest, Test } from 'supertest';
import { Logger } from '@overnightjs/logger';
import UserManagement from './UserManagement';
import User from '../types/User';

describe('UserManagement', () => {

    let userManagement : UserManagement;

    beforeAll(done => {
        userManagement =  UserManagement.getUserManagement();
        userManagement.connectUser({
            name: "AA BB",
            email: "ab@email.com",
            image: "ab.jpg",
            publicKey: {},
            port: undefined
        })
        userManagement.connectUser({
            name: "BB CC",
            email: "cc@email.com",
            image: "cc.jpg",
            publicKey: {},
            port: undefined
        })
        done();
    });

    describe('Add and disconnect new user', () => {
        const newUser : User = {
            name: "John Doe",
            email: "jd@email.com",
            image: "something.jpg",
            publicKey: {},
            port: {}
        }
        

        it(`should add the new user to the table`, done => {
            Logger.Info(userManagement);
            userManagement.connectUser(newUser);
            expect(userManagement["_userTable"]["jd@email.com"]).toBe(newUser);
            done();
        });

        it(`should remove port from the user in the table`, done => {
            Logger.Info("remove");
            userManagement.disconnectUser(newUser);
            expect(userManagement["_userTable"]["jd@email.com"].publicKey).toBeNull();
            done();
        });
    });
});