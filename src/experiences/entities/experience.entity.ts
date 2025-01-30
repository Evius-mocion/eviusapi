import { Participation } from 'src/participation/entities/participation.entity';
import { Station } from 'src/stations/entities/station.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('experiences')
export class Experience {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;
    
    @Column({nullable: false})
    description: string;

    @Column({nullable: false})
    category: string;


    @OneToMany(() => Station, station => station.experience, {
        nullable: true
    })
    stations?: Station[];
    
    @OneToMany(() => Participation, participation => participation.experience, {
        nullable: true
    })
    participations?: Participation[];

}
