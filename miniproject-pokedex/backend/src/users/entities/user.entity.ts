import { Entity, Column, PrimaryColumn} from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({ length: 255 })
    email: string;

    @Column({ length: 500 })
    password: string;

    @Column({ length: 500 })
    first_name: string;

    @Column({ length: 500 })
    last_name: string;

    @Column()
    is_active: boolean;

    //  i can't use CreateDateColumn , i test and it doesn't work .
    @Column({ 
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

}
