// database.service.ts
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    private readonly sql: NeonQueryFunction<false, false>;

    constructor(private configService: ConfigService) {
        const databaseUrl = this.configService.get('DB_HOST');
        this.sql = neon(databaseUrl);
    }
        async getData() {
        const data = await this.sql`...`;
        return data;
    }
}