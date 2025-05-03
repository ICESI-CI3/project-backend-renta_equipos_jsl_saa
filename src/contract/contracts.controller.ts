import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus
  } from '@nestjs/common';
  import { ContractsService } from './contracts.service';
  import { Contract } from './entities/contract.entity';
  
  @Controller('contracts')
  export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}
  
    @Post("api/v1/")
    async createContract(@Body() contract: Contract): Promise<Contract> {
      try {
        return await this.contractsService.createContract(contract);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    @Get("api/v1/")
    async getAllContracts(): Promise<Contract[]> {
      return this.contractsService.getAllContracts();
    }
  
    @Get("api/v1/:id")
    async getContractById(@Param('id') id: string): Promise<Contract> {
      try {
        return await this.contractsService.getContractById(id);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  
    @Put("api/v1/:id")
    async updateContract(
      @Param('id') id: string,
      @Body() contract: Contract
    ): Promise<Contract> {
      try {
        return await this.contractsService.updateContract(id, contract);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  
    @Delete("api/v1/:id")
    async deleteContract(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.contractsService.deleteContract(id);
        return { message: 'Contrato eliminado exitosamente' };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  
    @Get('api/v1/user/:email')
    async getContractsByUserEmail(
      @Param('email') email: string
    ): Promise<Contract[]> {
      try {
        return await this.contractsService.getContractByUserEmail(email);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  
    @Get('api/v1/status/:status')
    async getContractsByStatus(
      @Param('status') status: string
    ): Promise<Contract[]> {
      try {
        return await this.contractsService.getContractByStatus(status);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }
  