import { swaggerSpec } from '../swagger.config';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';

const outputPath = join(dirname(__dirname), 'openapi.json');
writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`✅ OpenAPI spec generated at: ${outputPath}`);
