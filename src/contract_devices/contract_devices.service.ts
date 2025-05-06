import { Injectable } from "@nestjs/common";
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

  async createContractDevice(contractDeviceDto: CreateContractDeviceDto, quantity: number): Promise<ContractDevice[]> {
    const availableDevices = await this.deviceRepository.find({
      where: { name: contractDeviceDto.deviceName, status: "Disponible" },
    });

    if (availableDevices.length < quantity) {
      throw new Error(
        `No hay suficientes dispositivos disponibles con el nombre "${contractDeviceDto.deviceName}". Se encontraron ${availableDevices.length}, pero se necesitan ${quantity}.`
      );
    }

    const contract = await this.contractRepository.findOne({ where: { id: contractDeviceDto.contract_id } });
    if (!contract) {
      throw new Error("El contrato especificado no existe");
    }

    const createdContractDevices: ContractDevice[] = [];

    for (let i = 0; i < quantity; i++) {
      const device = availableDevices[i];

      const newContractDevice = this.contractDeviceRepository.create({
        contract_id: contract.id,
        device_id: device.id,
        deviceName: device.name,
      });

      const saved = await this.contractDeviceRepository.save(newContractDevice);
      createdContractDevices.push(saved);

      // Cambiar estado del dispositivo
      device.status = "Asignado";
      await this.deviceRepository.save(device);
    }

    return createdContractDevices;
  }

  async getAllContractDevices(): Promise<ContractDevice[]> {
    return this.contractDeviceRepository.find();
  }

  async getContractDeviceById(id: string): Promise<ContractDevice> {
    const result = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundError("El contrato de dispositivo no existe");
    }
    return result;
  }

  async updateContractDevice(id: string, contractDeviceDto: CreateContractDeviceDto): Promise<ContractDevice> {
    const exists = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundError("El contrato de dispositivo no existe");
    }

    await this.contractDeviceRepository.update(id, contractDeviceDto);
    const updated = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundError("No se pudo obtener el contrato actualizado");
    }

    return updated;
  }

  async deleteContractDevice(id: string): Promise<void> {
    const exists = await this.contractDeviceRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundError("El contrato de dispositivo no existe");
    }
    await this.contractDeviceRepository.delete(id);
  }

  async getContractDevicesByDeviceName(deviceName: string): Promise<ContractDevice[]> {
    const results = await this.contractDeviceRepository.find({ where: { deviceName } });
    if (!results.length) {
      throw new NotFoundError("No hay contratos con ese dispositivo");
    }
    return results;
  }
}
