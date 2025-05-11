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
  import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateContractDto } from './dto/create-contract.dto';
  
  @Controller('api/v1/contracts')
  export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}
    /**
     * Creates a new contract.
     * @param contract - The contract data to create.
     * @returns The created contract.
     */
    @Post("")
    @ApiOperation({ summary: 'Crear un nuevo contrato' })
    @ApiBody({ type: CreateContractDto })
    async createContract(@Body() contract: Contract): Promise<Contract> {
      try {
        return await this.contractsService.createContract(contract);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    /**
     * Retrieves all contracts.
     * @returns A list of all contracts.
     */
    @Get("")
    @ApiOperation({ summary: 'Obtener todos los contratos' })
    async getAllContracts(): Promise<Contract[]> {
      return this.contractsService.getAllContracts();
    }
    
    /**
     * Retrieves a contract by its unique identifier.
     * @param id - The UUID of the contract to retrieve.
     * @returns The contract with the specified ID.
     */
    @Get(":id")
    @ApiOperation({ summary: 'Obtener un contrato por su ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del contrato' })
    async getContractById(@Param('id') id: string): Promise<Contract> {
      try {
        return await this.contractsService.getContractById(id);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
    
    /**
     * Updates a contract by its unique identifier.
     * @param id - The UUID of the contract to update.
     * @param contract - The updated contract data.
     * @returns The updated contract.
     */
    @Put(":id")
    @ApiOperation({ summary: 'Actualizar un contrato por ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del contrato' })
    @ApiBody({ type: CreateContractDto })
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
    
    /**
     * Deletes a contract by its unique identifier.
     * @param id - The UUID of the contract to delete.
     * @returns A confirmation of the deletion.
     */
    @Delete(":id")
    @ApiOperation({ summary: 'Eliminar un contrato por ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del contrato' })
    async deleteContract(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.contractsService.deleteContract(id);
        return { message: 'Contrato eliminado exitosamente' };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
    
    /**
     * Retrieves contracts by user email.
     * @param email - The email of the user to retrieve contracts for.
     * @returns A list of contracts associated with the specified user email.
     */
    @Get(':email')
    @ApiOperation({ summary: 'Obtener contratos por correo del usuario' })
    @ApiParam({ name: 'email', type: 'string', description: 'Correo electrónico del usuario' })
    async getContractsByUserEmail(
      @Param('email') email: string
    ): Promise<Contract[]> {
      try {
        return await this.contractsService.getContractByUserEmail(email);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
    
    /**
     * Retrieves contracts by status.
     * @param status - The status of the contracts to retrieve.
     * @returns A list of contracts with the specified status.
     */
     // @Auth(ValidRoles.admin, ValidRoles.superuser)
    @Get(':status')
    @ApiOperation({ summary: 'Obtener contratos por estado' })
    @ApiParam({ name: 'status', type: 'string', description: 'Estado del contrato (ej. Activo)' })
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
  