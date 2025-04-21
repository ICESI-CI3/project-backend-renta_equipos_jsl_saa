import { Injectable } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesService {

    constructor(
        @InjectRepository(Device) private readonly deviceRepository : Repository<Device>,
    ) {}

    async findOne(term : string) : Promise<Device | null> {
        let device : Device | null;

        if (isUUID(term)) {
            device = await this.deviceRepository.findOneBy({ id: term });
        }else{
            const queryBuilder = this.deviceRepository.createQueryBuilder('device');
            device = await queryBuilder
                .where('LOWER(device.name) = LOWER(:name)', { name: term })
                .orWhere('LOWER(device.slug) = LOWER(:slug)', { slug: term })
                .getOne();
        }

        return device;
    }

    // async update (id: string, updateDeviceDTO: Device){
    //     const device: Device | undefined = this.deviceRepository.preload({
    //         id,
    //         ...updateDeviceDTO,
    //     });

    //     if (!device) {
    //         throw new Error('El dispositivo no existe');
    //     }

    //     return this.deviceRepository.save(device);
    // }
}
