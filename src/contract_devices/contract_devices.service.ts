import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractDevice } from "./entities/contract_device.entity";
import { Device } from "../devices/entities/device.entity";
import { Contract } from "../contract/entities/contract.entity";
import { CreateContractDeviceDto } from "./dto/create-contract_device.dto";
import { NotFoundError } from "rxjs";

@Injectable()
export class ContractDevicesService {
  constructor(
    @InjectRepository(ContractDevice) private readonly contractDeviceRepository: Repository<ContractDevice>,
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>
  ) {}

  async createContractDevice(
    contractDeviceDto: CreateContractDeviceDto,
    quantity: number
  ): Promise<string> {
  
    const availableDevices = await this.deviceRepository.find({
      where: { name: contractDeviceDto.device_name, status: "Disponible" },
    });
  
    if (availableDevices.length < quantity) {
      throw new BadRequestException(
        `No hay suficientes dispositivos disponibles con el nombre "${contractDeviceDto.device_name}". Se encontraron ${availableDevices.length}, pero se necesitan ${quantity}.`
      );
    }
  
    const contract = await this.contractRepository.findOne({ where: { id: contractDeviceDto.contract_id } });
    if (!contract) {
      throw new BadRequestException("El contrato especificado no existe");
    }
  
    for (let i = 0; i < quantity; i++) {
      const device = availableDevices[i];
  
      const newContractDevice = this.contractDeviceRepository.create({
        contract_id: contract.id,
        device_id: device.id,
        device_name: device.name,
      });
  
      await this.contractDeviceRepository.save(newContractDevice);
  
      // Cambiar estado del dispositivo
      await this.deviceRepository.update(device.id, {
        status: "Asignado"
      });
    }
  
    return "Dispositivos asignados correctamente al contrato";
  }

  async getAllContractDevices(): Promise<ContractDevice[]> {
    return this.contractDeviceRepository.find();
  }

  async getContractDeviceById(id: string): Promise<ContractDevice> {
    const result = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("El contrato de dispositivo no existe");
    }
    return result;
  }

  async updateContractDevice(id: string, contractDeviceDto: CreateContractDeviceDto): Promise<ContractDevice> {
    const exists = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException("El contrato de dispositivo no existe");
    }

    await this.contractDeviceRepository.update(id, contractDeviceDto);
    const updated = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException("No se pudo obtener el contrato actualizado");
    }

    return updated;
  }

  async deleteContractDevice(id: string): Promise<void> {
    const exists = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException("El contrato de dispositivo no existe");
    }
    await this.contractDeviceRepository.delete(id);
  }

  async getContractDevicesByDeviceName(device_name: string): Promise<ContractDevice[]> {
    const results = await this.contractDeviceRepository.find({ where: { device_name } });
    if (!results.length) {
      throw new NotFoundError("No hay contratos con ese dispositivo");
    }
    return results;
  }
}
