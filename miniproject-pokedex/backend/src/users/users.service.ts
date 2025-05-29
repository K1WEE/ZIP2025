
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(user: User): Promise<User> {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        return this.userRepository.save(user);
    }

    async update(email: string, user: User): Promise<User | null> {
        const existingUser = await this.findOne(email);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updateData: Partial<User> = { ...user };
        if (user.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(user.password, saltRounds);
        }

        if (await this.userRepository.update({ email }, updateData)){
            console.log('Update successful', updateData,{ email });
            // If the update was successful, return the updated user
            return this.findOne(email);
        }

        throw new Error('Update failed');
    }

    async remove(email: string): Promise<void> {
        const user = await this.findOne(email);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.remove(user);
    }
}
